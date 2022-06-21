<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\Local_purchase_order;
use App\Models\Local_purchase_order_item;
use App\Models\Local_purchase_order_approval;

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
    public function fetch(Request $request)
    {
        $searchData = array();
        if(@$request['company_id']){
            $searchData = array_merge($searchData, array('company_id' => $request['company_id']));
        }
        if(@$request['status']){
            $searchData = array_merge($searchData,array('status' => $request['status']));
        }
        if(@$request['supplier_id']){
            $searchData =  array_merge($searchData,array('supplier_id' => $request['supplier_id']));
        }
        if(@$request['user_id']){
            $searchData =  array_merge($searchData,array('user_id' => $request['user_id']));
        }

        $data = Local_purchase_order::where($searchData)->with("supplier","requests","process_by")->orderBy("updated_at", "desc")->paginate(10); 
        
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
                $q->where("prf_no", "LIKE", "%".$search."%");  
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
        $data = Local_purchase_order::where('id', '=', $request->id)->with(["supplier","requests", "location","process_by", 'billing', 'contact_person.profile', 'lpo_items', 'lpo_approvals.users.profile', 
        'lpo_approvals' => function($query){
            $query->orderBy("orders", "ASC");
        }])->first(); 

        return response()->json([
            'item' => $data 
        ], 200); 
    } 

    public function updateLPO(Request $request){
       
        $data = Local_purchase_order::where('id', '=', $request['id'])->first(); 
        
        $item = array("delivery_terms" => $request['data']['delivery_terms'], "discount" => $request['data']['discount'], 'net_amount' => $request['data']['net_amount'], 
        'remarks_finance' => $request['data']['remarks_finance'], 
        'remarks_general' => $request['data']['remarks_general'], 'remarks_optional' => $request['data']['remarks_optional'], 'remarks_payment_terms' => $request['data']['remarks_payment_terms']
        , 'total_amount' => $request['data']['total_amount'], 'vat' => $request['data']['vat'], 'currency' => $request['data']['currency'], 'vat_custom' => $request['data']['vat_custom']); 
        
        if($request['items']){
            $data->lpo_items()->createMany($request['items']);  
        }
       
        $data->lpo_approvals()->delete();

        $data->lpo_approvals()->createMany($request['approvals']);

        $data->update($item); 
        
        $data->logs()->create([
            'user_id' => $request['logged_id'],
            'log_type' => 'update',
            'details' => json_encode($item)
        ]);
         
        $msg = 'LPO has been updated!';

        return response()->json([
            'status' => true,
            'message' => $msg
        ], 200); 
    }
    
    public function updateItem(Request $request){
      
        $data = Local_purchase_order_item::where('id', '=', $request['id'])->first(); 
        
        $item = array("category_id" => $request['data']['category_id'], "item" => $request['data']['item'], 'qty' => $request['data']['qty'], 'specification' => $request['data']['specification'], 
        'unit_price' => $request['data']['unit_price'], 'uom' => $request['data']['uom'] );
        $data->update($item); 

        // $data->logs()->create([
        //     'user_id' => $request['logged_id'],
        //     'log_type' => 'update',
        //     'details' => json_encode($item)
        // ]);
         
        // $msg = 'LPO has been '.$request['type']; 

        return response()->json([
            'status' => true,
            'message' => "Item has been updated!"
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

    function fetchBusinessReport(Request $request){ 

        $data = Local_purchase_order::selectRaw('*, sum(net_amount) as sum')->where(array('status' => 'closed', 'status' => 'onprocess'))->whereYear('created_at', $request['year'])->whereMonth('created_at', $request['month'])->whereIn('department_id', $request['department'])
        ->groupBy('department_id','company_id')->get(); 
          
        $companies = Company::orderBy('title', 'asc')->get(); 
        $newData = array();
        foreach($companies AS $k => $v){
            $cnt = 0;
            $newData[$k]['company'] = $v->title; 
            $newData[$k]['company_id'] = $v->id; 
            foreach($data AS $kk => $vv){  
                if($vv->company_id == $v->id){
                    $newData[$k]['data'][$cnt]['department'] = $vv->department_id; 
                    $newData[$k]['data'][$cnt]['sum'] = $vv->sum;
                    $cnt++;
                } 
               
            }
        }
        return response()->json([ 
            'item' => $newData 
        ], 200); 
    }
}
