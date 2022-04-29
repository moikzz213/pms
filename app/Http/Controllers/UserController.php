<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function __construct()
    {
       
    } 

    public function fetch()
    {
        $data = User::with('profile.company', 'profile.department')->paginate(10); 
        
        return response()->json([
            'item' => $data 
        ], 200); 
    } 

    public function fetchActiveUsers()
    {
        $data = User::where("status", "=", "active")->with('profile.company', 'profile.department')->get(); 
        
        return response()->json([
            'item' => $data 
        ], 200); 
    } 

    public function search($search){
        if($search !== '-'){
            $data = User::whereHas('profile', function ($q) use ($search){
                $q->where("name", "LIKE", "%".$search."%"); 
                $q->orWhere("designation", "LIKE", "%".$search."%");
            })->orWhereHas('profile.company', function ($q) use ($search){
                $q->where("title", "LIKE", "%".$search."%");  
            })->orWhereHas('profile.department', function ($q) use ($search){
                $q->where("title", "LIKE", "%".$search."%");  
            })->with('profile.company', 'profile.department')->paginate(10);
        }else{
            $data =  User::with('profile.company', 'profile.department')->paginate(10); 
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
        $newData = array(
            
                "name" =>  $request['data'][0]['name'],
                "contact_no" => $request['data'][0]['contact_no'],
                "designation" => $request['data'][0]['designation'],
                "company_id" => $request['data'][0]['company_id'],
                "department_id" => $request['data'][0]['department_id'] 
           
        ); 
        $userData = array(
            "email" => $request['data'][0]['email'],
            "role"  => "normal",
            "password"  => Hash::make($request['data'][0]['email']),
            "status"    => "active",
            "created_at"    => Carbon::now()
        );  
        
        DB::beginTransaction();
        // do all your updates here
        try {
            $data       = User::create($userData);
           
            $id = $data['id'];

            $data->profile()->create($newData);
         
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
        $data = User::where('id', '=', $request->id)->with('profile.company', 'profile.department')->first(); 

        return response()->json([
            'item' => $data 
        ], 200); 
    } 

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $User
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $success = true;
        $responseCode = 200;
        $id = ''; 
        $newData = array(
            
            "name" =>  $request['data'][0]['name'],
            "contact_no" => $request['data'][0]['contact_no'],
            "designation" => $request['data'][0]['designation'],
            "company_id" => $request['data'][0]['company_id'],
            "department_id" => $request['data'][0]['department_id'] 
       
        ); 
        $userData = array(
            "email" => $request['data'][0]['email'],
            "status"    => $request['data'][0]['status']
        ); 
      
        DB::beginTransaction();
        // do all your updates here
        try { 
            $data = User::where('id', '=', $request->id)->first(); 
            $data->update($userData); 

            $data->profile()->update($newData);

            
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
     * @param  \App\Models\User  $User
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $data = User::where('id', '=', $request->id)->first(); 
            
        $data->delete();
        $msg = "Data has been deleted!"; 
        return response()->json([
            'success' => true,
            'msg' =>  "Data has been deleted!"
        ], 200);
    }

    public function logout(Request $request){
        
    }
}
