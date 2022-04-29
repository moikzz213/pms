<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DepartmentController extends Controller
{
    public function __construct()
    {
      //  $this->middleware('auth');
    } 

    public function fetchAll()
    {
        $data = Department::get(); 
        
        return response()->json([
            'item' => $data 
        ], 200); 
    } 

    public function fetch()
    {
        $data = Department::paginate(10); 
        
        return response()->json([
            'item' => $data 
        ], 200); 
    } 

    public function search($search){
        if($search !== '-'){
            $data = Department::where("title", "LIKE", "%".$search."%")->paginate(10);
        }else{
            $data = Department::paginate(10); 
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
            $data = DB::table("departments")->insertGetId($newData);
         
            $msg = "Data has been added"; 
          
            DB::commit();
            
        } catch (\Exception $e) {
            DB::rollback();
            $success = false;
            $msg = "Error: Failed to add the data!";
            $responseCode = 500;
        }

        return response()->json([
            'success' => $success,
            'msg' => $msg,
            'id' => $data,
           
        ], $responseCode);
    }
     
    public function show(Request $request)
    {
        $data = Department::where('id', '=', $request->id)->first(); 

        return response()->json([
            'item' => $data 
        ], 200); 
    } 

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Department  $Department
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
            $data = Department::where('id', '=', $request->id)->first(); 
            
            $data->update($newData);
            $msg = "Data has been updated!"; 
          
            DB::commit();
            
        } catch (\Exception $e) {
            DB::rollback(); 
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
     * @param  \App\Models\Department  $Department
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $data = Department::where('id', '=', $request->id)->first(); 
            
        $data->delete();
        $msg = "Data has been deleted!"; 
        return response()->json([
            'success' => true,
            'msg' =>  "Data has been deleted!"
        ], 200);
    }
}
