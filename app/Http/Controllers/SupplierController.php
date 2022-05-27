<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class SupplierController extends Controller
{
    public function __construct()
    {
       // $this->middleware('auth');
    } 

    public function fetch()
    {
        $data = Supplier::orderBy('title', 'ASC')->paginate(10); 
        
        return response()->json([
            'item' => $data 
        ], 200); 
    } 

    public function fetchAll()
    {
        $data = Supplier::orderBy('title', 'ASC')->get(); 
        
        return response()->json([
            'item' => $data 
        ], 200); 
    }
    

    public function search($search){
        if($search !== '-'){
            $data = Supplier::where("title", "LIKE", "%".$search."%")->orWhere("tax_no", "LIKE", "%".$search."%")->orWhere("contact_person", "LIKE", "%".$search."%")->orWhere("email", "=", $search)->paginate(10);
        }else{
            $data = Supplier::orderBy('title', 'ASC')->paginate(10); 
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
        $data = '';
        $newData = $request->data[0];
        $newData['created_at'] = Carbon::now();

        DB::beginTransaction();
        // do all your updates here
        try {
            $data = Supplier::create($newData);
            $id = $data['id'];

            $arrDetail =  $newData;
            $data->logs()->create([
                'user_id' => $request['user_id'],
                'log_type' => 'new',
                'details' => json_encode($arrDetail)
            ]);

            $msg = "Data has been added"; 
          
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
            'msg' => $msg,
            'id' => $id,
           
        ], $responseCode);
    }
     
    public function show(Request $request)
    {
        $data = Supplier::where('id', '=', $request->id)->first(); 

        return response()->json([
            'item' => $data 
        ], 200); 
    } 

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Supplier  $company
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $success = true;
        $responseCode = 200;
        $data = '';
        $newData = $request->data[0]; 
      
        DB::beginTransaction();
        // do all your updates here
        try { 
            $data = Supplier::where('id', '=', $request->id)->first(); 
            
            $data->update($newData);

            $arrDetail =  $newData;
            $data->logs()->create([
                'user_id' => $request['user_id'],
                'log_type' => 'update',
                'details' => json_encode($arrDetail)
            ]);
            $msg = "Data has been updated!"; 
          
            DB::commit();
            
        } catch (\Exception $e) {
            DB::rollback();
            dd($e);
            $success = false;
            $msg = "Error: Failed to update the data!";
            $responseCode = 500;
        }

        return response()->json([
            'success' => $success,
            'msg' => $msg
        ], $responseCode);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Supplier  $company
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $data = Supplier::where('id', '=', $request['id'])->first();  
     
        $data->logs()->create([
            'user_id' => $request['user_id'],
            'log_type' => 'delete',
            'details' => json_encode($data)
        ]);
        
        $data->delete();
        $msg = "Data has been deleted!"; 
        return response()->json([
            'success' => true,
            'msg' =>  "Data has been deleted!"
        ], 200);
    }

    public function import(Request $request){
        $success = true;
        $responseCode = 200;
        DB::beginTransaction();
        // do all your updates here
        try {
            $data = Supplier::insert($request['data']);
         
            $msg = "Data has been imported"; 
          
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
            'msg' => $msg, 
           
        ], $responseCode);
    }
}
