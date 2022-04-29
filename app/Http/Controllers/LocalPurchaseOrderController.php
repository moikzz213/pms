<?php

namespace App\Http\Controllers;

use App\Models\Local_purchase_order;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

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

    public function filterSearch(Request $request){ 
        if($request['data']){
            $data = Local_purchase_order::where($request['data'])->with("supplier","requests","process_by")->paginate(10);
        }else{
            $data = Local_purchase_order::with("supplier","requests","process_by")->paginate(10); 
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
            $lpo_no = "LPO-".$curYear.$lpo_no;

            $result->update(array("lpo_no" => $lpo_no)); 
             
            $msg = "LPO has been created!"; 
          
            DB::commit();
            
        } catch (\Exception $e) {
            DB::rollback();
            
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
        $data = Local_purchase_order::where('id', '=', $request->id)->with("supplier","requests","process_by", 'billing', 'contact_person.profile', 'lpo_approvals.users.profile', 'lpo_items')->first(); 

        return response()->json([
            'item' => $data 
        ], 200); 
    } 
    
    public function updateStatus(Request $request){
        
        $data = Local_purchase_order::where('id', '=', $request['id'])->first(); 

        $item = array("status" => $request['type']);
        $data->update($item); 
         
        $msg = 'LPO has been '.$request['type']; 

        return response()->json([
            'status' => true,
            'message' => $msg
        ], 200); 
    } 

    function pad($num, $size){ 
        return substr(str_repeat(0, $size).$num, - $size);
    }
}
