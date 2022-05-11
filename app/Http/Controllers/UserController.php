<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;
class UserController extends Controller
{
    public function __construct()
    {
       
    } 

    public function fetch()
    {
        $data = User::where('id', '!=', 1)->with('profile.company', 'profile.department')->paginate(10); 
        
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

            $arrDetail = array( 
                "name" =>  $request['data'][0]['name'],
                "contact_no" => $request['data'][0]['contact_no'],
                "designation" => $request['data'][0]['designation'],
                "company_id" => $request['data'][0]['company_id'],
                "department_id" => $request['data'][0]['department_id'],
                "email" => $request['data'][0]['email'],
                "role"  => "normal",
                "password"  => Hash::make($request['data'][0]['email']),
                "status"    => "active",
                "created_at"    => Carbon::now()
            );
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
     
    public function show($id)
    {
        $data = User::where('id', '=', $id)->with('profile.company', 'profile.department')->first(); 

        return response()->json([
            'item' => $data 
        ], 200); 
    }
    
    public function profile(Request $request)
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
        if(@$request['data'][0]['department_id']){
            $newData = array( 
                "name" =>  $request['data'][0]['name'],
                "contact_no" => $request['data'][0]['contact_no'],
                "designation" => $request['data'][0]['designation'],
                "company_id" => $request['data'][0]['company_id'],
                "department_id" =>$request['data'][0]['department_id']
            ); 
            $userData = array(
                "email" => $request['data'][0]['email'],
                "status"    => $request['data'][0]['status']
            ); 
        }else{
            $newData = array( 
                "name" =>  $request['data'][0]['name'],
                "contact_no" => $request['data'][0]['contact_no'],
                "designation" => $request['data'][0]['designation'],
                "company_id" => $request['data'][0]['company_id']              
            ); 
        }
      
        DB::beginTransaction();
        // do all your updates here
        try { 
            $data = User::where('id', '=', $request->id)->first(); 
            if(@$request['data'][0]['department_id']){
                $data->update($userData); 
            }

            $data->profile()->update($newData);

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

    public function change_password(Request $request)
    {
        
        $success = true;
        $responseCode = 200;
        $id = ''; 
        
        $newData = array( 
            "password" =>  Hash::make($request->password)              
        ); 
        
      
        DB::beginTransaction();
        // do all your updates here
        try { 
            $data = User::where('id', '=', $request->id)->first(); 
             
            $data->update($newData);  
            
            $msg = "Password has been updated!"; 
          
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
            
        $data->profile()->sync();
        $data->delete();
        $msg = "Data has been deleted!"; 
        return response()->json([
            'success' => true,
            'msg' =>  "Data has been deleted!"
        ], 200);
    }

    public function logout($token){
        $token = PersonalAccessToken::findToken($token);
        $user = $token->tokenable;
        
        
        $data = User::where('id', '=', $user->id)->first(); 
        $data->tokens()->delete();
        return response()->json([
            'success' => true
        ], 200);
        
    }

    public function import(Request $request){
        $success = true;
        $responseCode = 200;
        DB::beginTransaction();
        // do all your updates here
        try {
             
            foreach($request['data'] AS $v){ 
                
                $data = User::create(
                                    [
                                    "email" => $v['email'],
                                    "role"  => "normal",
                                    "password"  => Hash::make($v['email']),
                                    "status"    => "active",
                                    "created_at"    => Carbon::now()
                                    ]
                            );

                $data->profile()->create(
                    [
                        "name" =>  $v['name'], 
                        "designation" =>  $v['designation'] ? $v['designation'] : null, 
                        "company_id" => $v['company_id'],
                        "department_id" => $v['department_id']  
                    ]
                );
                
            } 
          
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
