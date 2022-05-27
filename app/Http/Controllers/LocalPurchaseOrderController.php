<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\Local_purchase_order;
use App\Models\Local_purchase_order_item;

class LocalPurchaseOrderController extends Controller
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
        $data = Local_purchase_order::with("supplier","requests","process_by")->orderBy("updated_at", "desc")->paginate(10); 
        
        return response()->json([
            'item' => $data 
        ], 200); 
    }

    public function fetchProcessStatus()
    {
        $data = Local_purchase_order::where('status', '=', 'onprocess')->orderBy("lpo_no", "desc")->get(); 
        
        return response()->json([
            'item' => $data 
        ], 200); 
    }

    public function search($search){
        if($search !== '-'){
            $data = Local_purchase_order::where("lpo_no", "LIKE", "%".$search."%")->orWhereHas('requests', function ($q) use ($search){
                $q->where("prf_no", "=", $search);  
            })->with("supplier","requests","process_by")->paginate(10);
        }else{
            $data = Local_purchase_order::with("supplier","requests","process_by")->orderBy("updated_at", "desc")->paginate(10); 
        }
        return response()->json([
            'item' => $data 
        ], 200); 
    }

    public function filterSearch(Request $request){ 
        if($request['data']){
            $data = Local_purchase_order::where($request['data'])->with("supplier","requests","process_by")->orderBy("updated_at", "desc")->paginate(10);
        }else{
            $data = Local_purchase_order::with("supplier","requests","process_by")->orderBy("updated_at", "desc")->paginate(10); 
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
            $result = Local_purchase_order::create($request[0]['details'][0]);
            $id = $result['id']; 
            
           $result->lpo_approvals()->createMany($request[0]['approvals']);
           $result->lpo_items()->createMany($request[0]['items']);  

            $curYear = Carbon::now()->format('Y');
            $lpo_no = $this->pad( $id, 6 );
            $lpo_no = @$request[0]['comp_code'].'-'.@$request[0]['supplier_code'].'-'.$curYear."-".$lpo_no;

            $result->update(array("lpo_no" => $lpo_no)); 

            $arrDetail = array(  array($request[0]['details'][0]), array($request[0]['approvals']), array($request[0]['items']) );
            $result->logs()->create([
                'user_id' => $request[0]['user_id'],
                'log_type' => 'new',
                'details' => json_encode($arrDetail)
            ]);
             
            $msg = "LPO has been created!"; 
          
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
     * @param  \App\Models\Local_purchase_order  $local_purchase_order
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $data = Local_purchase_order::where('id', '=', $request->id)->with("supplier","requests", "location","process_by", 'billing', 'contact_person.profile', 'lpo_approvals.users.profile', 'lpo_items')->first(); 

        return response()->json([
            'item' => $data 
        ], 200); 
    } 
    
    public function updateStatus(Request $request){
        
        $data = Local_purchase_order::where('id', '=', $request['id'])->first(); 

        $item = array("status" => $request['type']);
        $data->update($item); 

        $data->logs()->create([
            'user_id' => $request['user_id'],
            'log_type' => 'change_status',
            'details' => json_encode($item)
        ]);
         
        $msg = 'LPO has been '.$request['type']; 

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
       
        $data = Local_purchase_order_item::whereBetween('created_at', [$fromDate, $toDate])->whereHas('lpo', function($query) use ($dataSearch) {
            if($dataSearch){
                if(@$dataSearch['company_id']){
                    $query->where("local_purchase_orders.company_id",$dataSearch['company_id']);
                }
                if(@$dataSearch['supplier_id']){
                    $query->where("local_purchase_orders.supplier_id",$dataSearch['supplier_id']);
                }
                if(@$dataSearch['process_by']){
                    $query->where("local_purchase_orders.user_id",$dataSearch['process_by']);
                }
                if(@$dataSearch['status']){
                    $query->where("local_purchase_orders.status",$dataSearch['status']);
                }
            }
        }) 
        ->with("lpo.supplier","lpo.requests.location", "lpo.requests.profile" ,"lpo.process_by", 'lpo.department','category')->orderBy("created_at", "asc")->get();

        return response()->json([
            'item'     =>$data            
        ], 200); 
    }
}
