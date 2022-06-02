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
    public function fetch()
    {
        $data = Payment_approval_form::with( "process_by", "lpos", "company")->orderBy("updated_at", "desc")->paginate(10); 
        
        return response()->json([
            'item' => $data 
        ], 200); 
    } 

    public function search($search){
        if($search !== '-'){
            $data = Payment_approval_form::where("paf_no", "LIKE", "%".$search."%")->orWhereHas('lpos', function ($q) use ($search){
                $q->where("lpo_no", "LIKE", "%".$search."%");  
            })->with(  "process_by", "lpos", "company")->paginate(10);
        }else{
            $data = Payment_approval_form::with(  "process_by", "lpos", "company")->orderBy("updated_at", "desc")->paginate(10); 
        }
        return response()->json([
            'item' => $data 
        ], 200); 
    }

    public function filterSearch(Request $request){ 
       
        if($request['data']){
            $searchSupplier = false;
            $search = '';
            if(@$request['data']['supplier_id']){
                $searchSupplier = true;
                $search = $request['data']['supplier_id'];
            }
            if($searchSupplier){
                $data = Payment_approval_form::where($request['data'])->orWhereHas(
                    'paf_items.supplier', function ($q) use ($search){
                        $q->where("supplier_id", "=",  $search);  
                    }
                )->with( "process_by", "lpos", "company")->orderBy("updated_at", "desc")->paginate(10);
            }else{

                $data = Payment_approval_form::where($request['data'])->with( "process_by", "lpos", "company")->orderBy("updated_at", "desc")->paginate(10);
            }
        }else{
            $data = Payment_approval_form::with(  "process_by", "lpos", "company")->orderBy("updated_at", "desc")->paginate(10); 
        }

        return response()->json([
            'item' => $data 
        ], 200); 
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
            $result = Payment_approval_form::create($request[0]['details'][0]);
            $id = $result['id']; 
            
           $result->paf_approvals()->createMany($request[0]['approvals']);
           $result->paf_items()->createMany($request[0]['items']);  
            
            $curYear = Carbon::now()->format('Y');
            $paf_no = $this->pad( $id, 6 );
            $paf_no = "PAF-".$curYear."-".$paf_no; 
           
            $result->update(array("paf_no" => $paf_no)); 

            if($request[0]['lpo']){
                Local_purchase_order::whereIn("id", $request[0]['lpo'])->update(array("status" => "closed"));  
                $result->lpos()->sync( $request[0]['lpo'] );
            }elseif($request[0]['prfs']){
                $result->prfs()->sync( $request[0]['prfs'] );
            }
             
            $arrDetail = array(  array($request[0]['details'][0]), array($request[0]['approvals']), array($request[0]['items']) );
            $result->logs()->create([
                'user_id' => $request[0]['user_id'],
                'log_type' => 'new',
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
        $data = Payment_approval_form::where('id', '=', $request->id)->with(["paf_items.supplier","requests","process_by", "company", 'paf_approvals.users.profile', 'paf_items', "images", "paf_approvals"  => function($query){
            $query->orderBy("orders", "ASC");
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
    
    public function updateStatus(Request $request){
        
        $data = Payment_approval_form::where('id', '=', $request['id'])->first(); 

        $item = array("status" => $request['type']);
        $data->update($item); 

        $data->logs()->create([
            'user_id' => $request['user_id'],
            'log_type' => 'change_status',
            'details' => json_encode($item)
        ]);
         
        $msg = 'LPO Status changed to '.$request['type']; 

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
       
        $data = Payment_approval_form_item::whereDate('created_at', '>=', $fromDate)->whereDate('created_at', '<=', $toDate)->whereHas('paf', function($query) use ($dataSearch) {
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
        ->with("supplier", 'paf.company', 'paf.process_by', 'lpo.department' )->orderBy("created_at", "asc")->get();

        return response()->json([
            'item'     =>$data            
        ], 200); 
    }
}