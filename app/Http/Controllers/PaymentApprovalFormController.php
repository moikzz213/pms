<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\Local_purchase_order;
use App\Models\Payment_approval_form;
use Illuminate\Support\Facades\Storage;
use App\Models\Payment_approval_form_item;
use Intervention\Image\Facades\Image as Img;

class PaymentApprovalFormController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function fetch(Request $request,$search=null)
    {
        $field = 'updated_at';
         $sort = "desc";
         $orderBy = $request['sort'];
         
         if($orderBy){
             $orderBy = explode(",", $orderBy);
           
             $field = $orderBy[0];
             $sort = $orderBy[1];
         }
         $searchData = array(); 
        
         if($search && $search !== '-'){
            $data = Payment_approval_form::where("paf_no", "LIKE", "%".$search."%")
                ->orWhereHas('lpos', function ($q) use ($search){
                    $q->where("lpo_no", "LIKE", "%".$search."%");
                })->orWhereHas('prfs', function ($q) use ($search){
                    $q->where("prf_no", "LIKE", "%".$search."%");  
                })->with("prfs","process_by", "lpos", "company")->paginate(10);
             
         }else{
          
            if(@$request['company_id']){
                $searchData = array_merge($searchData, array('company_id' => $request['company_id']));
            }
            if(@$request['status']){
                $searchData = array_merge($searchData,array('status' => $request['status']));
            }
            if(@$request['supplier_id']){
                $searchData =  array_merge($searchData,array('supplier_id' => $request['supplier_id']));
            }
            if(@$request['process_by']){
                $searchData =  array_merge($searchData,array('user_id' => $request['process_by']));
            }
            
           
             $data = Payment_approval_form::where($searchData)->with( "prfs","process_by", "lpos", "company")->orderBy("updated_at", "desc")->paginate(10); 
         } 
        
        return response()->json($data , 200); 
    }  
 

    
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $success = true;
        $responseCode = 200;
        $id = '';
        $data = array();  
       
         
        
        DB::beginTransaction();
        // do all your updates here
        try {

            if(@$request['id']){ 
                 
                $result = Payment_approval_form::find($request['id']);
                $id = $request['id'];
                $result->paf_items()->delete();
                $result->paf_approvals()->delete();
                $result->paf_items()->createMany($request['items']); 
                $result->paf_approvals()->createMany($request['approvers']);
                 
                $result->update($request['data']);
                $logType = 'update';
            }else{
                $nData = array_merge($request['data'], array('user_id' => auth()->id(), 'status' => 'onprocess')); 
                $result = Payment_approval_form::create($nData);
                $id = $result['id'];
                
                $result->paf_approvals()->createMany($request['approvers']);
                $result->paf_items()->createMany($request['items']);  

                $curYear = Carbon::now()->format('Y');
                $paf_no = $this->pad( $id, 6 );
                $paf_no = "PAF-".$curYear."-".$paf_no; 
                $result->update(array("paf_no" => $paf_no)); 

                $logType = 'new';
            }  
            

            if($request['relations'] && $request['data']['relation'] == 'lpo'){ 
                $result->prfs()->delete();
                $result->lpos()->sync( $request['relations'] );
            }elseif($request['relations'] && $request['data']['relation'] == 'prf'){
                $result->lpos()->delete();
                $result->prfs()->sync( $request['relations'] );
            }
             
            $arrDetail = array(  array($request['data']), array($request['approvers']), array($request['items']) );
            $result->logs()->create([
                'user_id' => auth()->id(),
                'log_type' => $logType,
                'details' => json_encode($arrDetail)
            ]);
            
            $msg = "PAF has been created!"; 
          
            DB::commit();
            
        } catch (\Exception $e) {
            DB::rollback();
            dd($e);
            $success = false;
            $msg = "Error: Failed to add the data!";
            $responseCode = 500;
        }

        return response()->json([
            'success' => $success,
            'message' => $msg,
            'id' => $id,
           
        ], $responseCode);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Payment_approval_form  $Payment_approval_form
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $data = Payment_approval_form::where('id', '=', $request->id)
        ->with(["paf_items.supplier","prfs",'lpos',"process_by", "company.images", 'paf_approvals.users.profile', "images", "paf_approvals"  => function($query){
             $query->where('user_id', '>',0);
            $query->orderBy("orders", "ASC");
        }, 'paf_items' => function($query) {
            $query->where('qty', '!=', null);
            $query->where('unit_price', '!=', null);
        }])->first(); 

        return response()->json([
            'item' => $data 
        ], 200); 
    } 

    public function pafClosed(Request $request){
        $result = Payment_approval_form::where('id', '=', $request['id'])->first(); 
        $userStorage = '/uploads';
        if (!Storage::exists($userStorage)) {
            Storage::makeDirectory($userStorage, 0755, true);
        }
        $fileArray = array();
            if( $request->hasFile('images') ) { 
                $uploadKey = Carbon::now()->format('YmdHis');
                $img_id = array();
                foreach($request->file('images') as $k => $file) {
                    $fileName = $file->getClientOriginalName();
                    $title = pathinfo($fileName, PATHINFO_FILENAME);
                    $extn = strtolower($file->getClientOriginalExtension());
                    $slugTitle = Str::slug($title, '-');
                    $path = $slugTitle."-".$uploadKey.".".$extn;
                    $mime = $file->getClientMimeType(); 
                    $file->move(storage_path() . '/app' . $userStorage, $path);
                    
                     // Setup data into array
                    $fileArray = array(
                        'original_name' => $fileName,
                        'title' => $title,
                        'disk' => 'local',
                        'path' => $path, 
                        'types' => 'paf',
                        'mime' => $mime,
                        'user_id' => $request['user_id'],
                        'created_at' => Carbon::now(),
                    );

                    $images = Image::insertGetId($fileArray);
                    array_push( $img_id, $images);
                }
                 
                $result->images()->sync($img_id); 
            }
            
            $nDate = date('m/d/Y', strtotime($request['invoice_date']));
            $nDate = date('Y-m-d', strtotime($nDate));
            
            $result->update(array("invoice_date" => $nDate, "invoices" => $request['invoices'],"status" => 'closed')); 

            return response()->json([
                'success' => true               
            ], 200);
    }

    public function updatePAF(Request $request){
       
        $data = Payment_approval_form::where('id', '=', $request['id'])->first(); 
        
        $item = array("amount_in_words" => $request['data']['amount_in_words'], "currency" => $request['data']['currency'], 
        'currency_rate' => $request['data']['currency_rate'], 'discount' => $request['data']['discount'], 
        'discount_title' => $request['data']['discount_title'], 'net_amount' => $request['data']['net_amount'], 
        'remarks_general' => $request['data']['remarks_general']
        , 'total_amount' => $request['data']['total_amount'], 'total_vat' => $request['data']['total_vat'], 
        'vat_custom' => $request['data']['vat_custom'], 'supplier_count' => $request['data']['supplier_count']); 
        
        if($request['items']){
            $data->paf_items()->createMany($request['items']);  
        }
       
        $data->paf_approvals()->delete();

        $data->paf_approvals()->createMany($request['approvals']);

        $data->update($item); 
        
        $data->logs()->create([
            'user_id' => $request['logged_id'],
            'log_type' => 'update',
            'details' => json_encode($item)
        ]);
         
        $msg = 'PAF has been updated!';

        return response()->json([
            'status' => true,
            'message' => $msg
        ], 200); 
    }

    public function updateItem(Request $request){
        if($request['type'] == 'save'){
            $data = Payment_approval_form_item::where('id', '=', $request['id'])->first();

            $item = array("amount" => $request['data']['amount'], "description" => $request['data']['description'], 
                        'qty' => $request['data']['qty'], 'local_purchase_order_id' => $request['data']['local_purchase_order_id'], 
                        'unit_price' => $request['data']['unit_price'], 'location' => $request['data']['location']
                        , 'serial_number' => $request['data']['serial_number'] , 'supplier_id' => $request['data']['supplier_id'] 
                        , 'supplier_invoice_num' => $request['data']['supplier_invoice_num'], 'total_amount' => $request['data']['total_amount'], 
                        'vat' => $request['data']['vat'], 'invoice_date' => $request['data']['invoice_date'] );
                        
            $data->update($item);  
            $msg = "Item has been updated!";
         }else{
            Payment_approval_form_item::where('id', '=', $request['id'])->delete();
            $msg = "Item has been deleted!";
         }
    
        return response()->json([
            'status' => true,
            'message' => $msg
        ], 200); 
    }
    
    public function updateStatus(Request $request){
        
        $data = Payment_approval_form::where('id', '=', $request['id'])->first();

        // Reason Remarks has been put at remarks_finance field
        if($request['type'] == 'cancelled'){
            $item = array("status" => $request['type'], 'reasons' => $request['reason']);
        }else{
            $item = array("status" => $request['type']);
        }

        $data->update($item);
        $data->logs()->create([
            'user_id' => auth()->id(),
            'log_type' => 'change_status',
            'details' => json_encode($item)
        ]);
         
        $msg = 'PAF has been '.$request['type']; 

        return response()->json([
            'status' => true,
            'message' => $msg
        ], 200);
    }

    function pad($num, $size){
        return substr(str_repeat(0, $size).$num, - $size);
    }

    function reportTable(Request $request){
        $search = $request['daterange'];
        $fromDate = $search['from'];
        $toDate = $search['to'];
        $dataSearch = $request['data'];
       
        $data = Payment_approval_form_item::where('qty', '!=', NULL)->whereDate('created_at', '>=', $fromDate)->whereDate('created_at', '<=', $toDate)->whereHas('paf', function($query) use ($dataSearch) {
            if($dataSearch){
                if(@$dataSearch['company_id']){
                    $query->where("payment_approval_forms.company_id",$dataSearch['company_id']);
                }
                if(@$dataSearch['supplier_id']){
                    $query->where("payment_approval_forms.supplier_id",$dataSearch['supplier_id']);
                }
                if(@$dataSearch['process_by']){
                    $query->where("payment_approval_forms.user_id",$dataSearch['process_by']);
                }
                if(@$dataSearch['status']){
                    $query->where("payment_approval_forms.status",$dataSearch['status']);
                }
            }
        }) 
        ->with("supplier", 'paf.process_by', 'lpo.department', 'requests.company' )->orderBy("payment_approval_form_id", "asc")->get();

        return response()->json( $data, 200); 
    }
}