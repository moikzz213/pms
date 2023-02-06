<?php

namespace App\Http\Controllers; 
use App\Models\Comparison;
 
use Illuminate\Http\Request;
use Illuminate\Support\Carbon; 
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
 

class ComparisonController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function fetch(Request $request,$search=null)
    {  
       
        $loggedUser = auth()->user();
        $id = $loggedUser->id;

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
           
            $data = Comparison::where("title", "LIKE", "%".$search."%")->paginate(10);
             
         }else{
            if(@$request['company_id']){
                $searchData = array_merge($searchData, array('company_id' => $request['company_id']));
            }
            if(@$request['status']){
                $searchData = array_merge($searchData,array('status' => $request['status']));
            }
           
            if(@$request['process_by']){
                $searchData =  array_merge($searchData,array('user_id' => $request['process_by']));
            }
            
            $data = Comparison::where($searchData)->orderBy($field, $sort)->paginate(10);
         }
      
         
         return response()->json( $data, 200); 
    }  

    public function store(Request $request){
        $success = true;
        $responseCode = 200;
        $id = '';
        $data = array();   
        DB::beginTransaction();
        // do all your updates here
        try { 
            
            if(@$request['id']){ 
                 
                $result = Comparison::find($request['id']);
                $id = $request['id'];
                $result->items()->delete(); 
                $result->items()->createMany($request['items']);
                 
                $result->update($request['data']);
                $logType = 'update';
                $msg = "Comparison has been updated!"; 
            }else{
                $nData = array_merge($request['data'], array('user_id' => auth()->id()));
                $result = Comparison::create($nData);
                $id = $result['id']; 
                $result->items()->createMany($request['items']); 

                $logType = 'new';
                $msg = "New Comparison has been created!"; 
            }
           
            if($request['suppliers'] && count($request['suppliers']) > 0){  
                $nData = array();
                // foreach($request['suppliers'] AS $k => $v){
                //     $nData[$k] = array('supplier_id' => $v);
                // }
                $result->recipients()->sync( $request['suppliers'] );
            }

            $arrDetail = array(  array($request['data']), array($request['items']) );
            $result->logs()->create([
                'user_id' => auth()->id(),
                'log_type' => $logType,
                'details' => json_encode($arrDetail)
            ]);
             
          
          
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
    public function show($id){

    }
  
}