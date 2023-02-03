<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CompanyController extends Controller
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

    public function saveData(Request $request)
    {

        $user_id = auth()->id();
        $data = NULL;
        $msg = "Error: kindly refresh the page/ contact administrator";
        $responseCode = 200;
        DB::beginTransaction();
        // do all your updates here
        try { 
           
            if(isset($request['id'])){
                $data = Company::find($request['id']);
                $data->update($request['data']);
                $log_type = "update";
            }else{
                $data = Company::create($request['data']);
                $log_type = "new";
            } 
            $logsData = $request['data'];
            if(@$request['image']){
                $data->images()->sync($request['image']);
                $logsData = array_merge($logsData, $request['image']);
            }else{
                $data->images()->detach();
            }
            
            $data->logs()->create([
                'user_id' => auth()->user()->id,
                'log_type' => $log_type,
                'details' => json_encode($request['data'])
            ]);

            $msg = "data has been updated/created";
            DB::commit();

        } catch (\Exception $e) {
            DB::rollback();
            $msg = $e;
            $responseCode = 500;
        }

        return response()->json([
            'result' => $data,
            'message' => $msg
        ], $responseCode);
    }
    
    public function fetch($perPage, $search, $orderBy=null)
    {
        $field = 'title';
        $sort = "asc";
      
        if($orderBy !== '-'){
            $orderBy = explode(",", $orderBy);
            $field = $orderBy[0];
            $sort = $orderBy[1];
        }
        
        if($search != '-'){
            $data = Company::where('title', 'LIKE', '%'.$search.'%')
            ->orderBy($field, $sort)->paginate($perPage);
        }else{ 
            $data = Company::orderBy($field, $sort)->paginate($perPage);
        }
        return response()->json($data, 200);
    }

    public function fetchNonpaginate()
    { 
        
        $data = Company::with('images')->orderBy('title', 'asc')->get();
        return response()->json($data, 200);
    }

    public function edit($id)
    {
        $data = Company::where('id', $id)->with('images')->first(); 
        return response()->json($data, 200);
    }

    public function destroy($id)
    {
        $data = Company::where('id', $id)->first();

        $data->logs()->create([
            'user_id' => auth()->user()->id,
            'log_type' => 'deleted',
            'details' => json_encode($data)
        ]);

        $data->delete();
        return response()->json($data, 200);
    }
 
}
