<?php

namespace App\Http\Controllers;

use App\Models\Image;
use App\Models\Local_purchase_order;
use App\Models\Payment_approval_form;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
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
        $data = Payment_approval_form::with("supplier","requests","process_by", "lpos", "company")->orderBy("updated_at", "desc")->paginate(10); 
        
        return response()->json([
            'item' => $data 
        ], 200); 
    } 

    public function search($search){
        if($search !== '-'){
            $data = Payment_approval_form::where("paf_no", "LIKE", "%".$search."%")->orWhereHas('lpos', function ($q) use ($search){
                $q->where("lpo_no", "LIKE", "%".$search."%");  
            })->with("supplier","requests","process_by", "lpos", "company")->paginate(10);
        }else{
            $data = Payment_approval_form::with("supplier","requests","process_by", "lpos", "company")->paginate(10); 
        }
        return response()->json([
            'item' => $data 
        ], 200); 
    }

    public function filterSearch(Request $request){ 
       
        if($request['data']){
            $data = Payment_approval_form::where($request['data'])->with("supplier","requests","process_by", "lpos", "company")->paginate(10);
        }else{
            $data = Payment_approval_form::with("supplier","requests","process_by", "lpos", "company")->paginate(10); 
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
           
            Local_purchase_order::whereIn("id", $request[0]['lpo'])->update(array("status" => "closed")); 

            $curYear = Carbon::now()->format('Y');
            $paf_no = $this->pad( $id, 6 );
            $paf_no = "PAF-".$curYear.$paf_no;

            $result->update(array("paf_no" => $paf_no)); 
            $result->lpos()->sync( $request[0]['lpo'] );
             
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
        $data = Payment_approval_form::where('id', '=', $request->id)->with("supplier","requests","process_by", "company", 'paf_approvals.users.profile', 'paf_items', "images")->first(); 

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
         
        $msg = 'LPO Status changed to '.$request['type']; 

        return response()->json([
            'status' => true,
            'message' => $msg
        ], 200); 
    } 

    function pad($num, $size){ 
        return substr(str_repeat(0, $size).$num, - $size);
    }
}
