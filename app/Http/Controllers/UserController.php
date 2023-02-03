<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Jobs\UserResetPassword;
use App\Models\Profile;
use App\Models\Requests;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\Local_purchase_order;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use App\Models\Payment_approval_form;
use Laravel\Sanctum\PersonalAccessToken;

class UserController extends Controller
{
    public function __construct()
    {
       
    }
 
    // List of Procurement Team Only
    public function profile_procurement()
    { 
        $data = User::where('role', '=', 'procurement')->with('profile')->orderBy("email","ASC")->get();
        return response()->json(  $data ,200); 
    } 

    public function fetch(Request $request, $search)
    {
        $field = 'email';
        $sort = "asc";
        $orderBy = $request['sort'];
        $perPage = $request['shows'];
        $relationOrderBy = false;
        
        if($orderBy){
            $orderBy = explode(",", $orderBy);
          
            $field = $orderBy[0]; 
            $sort = $orderBy[1];
        } 
      
        if($search && $search !== '-'){ 
            $data = User::where('id', '!=', 1)->whereHas('profile', function($q) use($search){
                $q->where("name", "LIKE", "%".$search."%");
            })->with('profile.company', 'profile.department')->orderBy('email', $sort)->paginate($perPage);

        }else{           
            $data = User::leftjoin('profiles', 'profiles.user_id', '=', 'users.id')->where('users.id', '!=', 1)->with('profile.company', 'profile.department')->orderBy($field, $sort)->paginate($perPage);
        } 
        
        return response()->json( $data, 200);
    }

    public function fetchActiveUsers()
    {
        $data = User::where("status", "=", "active")->where('id', '!=', 1)->whereHas('profile', function($q){
            $q->orderBy("name", "ASC");
        })->with('profile.company', 'profile.department')->orderBy("email","ASC")->get(); 
        
        return response()->json([
            'item' => $data 
        ], 200); 
    }  

    // For Reports - Status Counts
    public function fetchProcurement(Request $request)
    { 
        $year = $request['year'];
        $data = User::where('role', '=', "procurement")->whereHas('requests', function($query) use ($year) {
            $query->whereYear('created_at', $year);
        })->with('profile', 'lpos', 'pafs')->get();
        $newData = array();
        if($data){
            foreach($data AS $k => $v){
                $newData[$k]['name'] = $v['profile']->name;
    
                $requestPending     = $v->requests->where('status', 'pending')->count();
                $requestProcess     = $v->requests->where('status', 'onprocess')->count();
                $requestHold        = $v->requests->where('status', 'onhold')->count();
                $requestCancelled   = $v->requests->where('status', 'cancelled')->count();
                $requestClosed      = $v->requests->where('status', 'closed')->count();

                if($v->lpos){
                    $requestPending     += $v->lpos->where('status', 'pending')->count(); 
                    $requestProcess     += $v->lpos->where('status', 'onprocess')->count();
                    $requestHold        += $v->lpos->where('status', 'onhold')->count();
                    $requestCancelled   += $v->lpos->where('status', 'cancelled')->count();
                    $requestClosed      += $v->lpos->where('status', 'closed')->count();
                }
                if($v->pafs){
                    $requestPending     += $v->pafs->where('status', 'pending')->count(); 
                    $requestProcess     += $v->pafs->where('status', 'onprocess')->count();
                    $requestHold        += $v->pafs->where('status', 'onhold')->count();
                    $requestCancelled   += $v->pafs->where('status', 'cancelled')->count();
                    $requestClosed      += $v->pafs->where('status', 'closed')->count();
                }
                $newData[$k]['pending'] =  $requestPending;
                $newData[$k]['onprocess'] = $requestProcess;
                $newData[$k]['onhold'] =  $requestHold;
                $newData[$k]['cancelled'] = $requestCancelled;
                $newData[$k]['closed'] =  $requestClosed;
            } 
        } 
       
        return response()->json( $newData, 200); 
    }

     // For Reports - Monthly Counts
     public function fetchProcurementMonthly(Request $request)
     { 
         $year = $request['year'];
       
         $data = User::where('role', '=', "procurement")->orderBy('id', 'ASC')->get();
         $newData = array();
         if($data){

            $monthsArray = array( 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12);
             
            foreach ($monthsArray as $k => $x) { 
                $date = Carbon::createFromFormat('!m', $x); 
               
                $monthName = $date->format('M');
                $newData[$k]['month'] = $monthName; 
               
                foreach($data AS $kk => $v){ 

                    $totalCount = Requests::where('process_by', $v->id)->whereYear('created_at',"=", $year)->whereMonth('created_at', "=",$x)->count();   
                    $totalCount += Local_purchase_order::where('user_id', $v->id)->whereYear('created_at',"=", $year)->whereMonth('created_at',"=", $x)->count();   
                    $totalCount +=  Payment_approval_form::where('user_id', $v->id)->whereYear('created_at',"=", $year)->whereMonth('created_at',"=", $x)->count();  
                   
                    $newData[$k]['data'][$kk]['id'] = $v->id;
                    $newData[$k]['data'][$kk]['count'] = $totalCount;
                    
                } 
            }
         } 
        
         return response()->json( $newData , 200); 
     }

    public function search($search){
        if($search !== '-'){
            $data = User::where('id', '!=', 1)->where('email', "LIKE", "%".$search."%")->orWhereHas('profile', function ($q) use ($search){
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
                "name" =>  @$request['nProfile']->name,
                "contact_no" => @$request['nProfile']->contact_no,
                "designation" => @$request['nProfile']->designation,
                "company_id" => @$request['nProfile']->company_id,
                "department_id" => @$request['nProfile']->department_id
        ); 
         
        DB::beginTransaction();
        // do all your updates here
        try {
        
            if(isset($request['id'])){
                $data = User::where('id', $request['id'])->first();             
                $data->update($request['nUser']);
                $data->profile()->update($request['nProfile']);
                $type = 'update';
                $msg = "User has been updated";
            }else{
                $newData = array('password' => Hash::make($request['nUser']->email));
                $newData = array_merge($newData, $request['nUser']);
                $data       = User::create($userData);

                $userID = array('user_id' => $user['id']);
                $profile = array_merge($request['nProfile'], $userID);
                
                $data->profile()->insert($profile);        
                $msg = "User has been added";
                $type = 'new';
            }

            $arrDetail = array_merge($request['nProfile'], $request['nUser']);
            $data->logs()->create([
                'user_id' => auth()->id(),
                'log_type' => $type,
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
        return response()->json( $data , 200); 
    }
    
    public function profile(Request $request)
    {
        $data = User::where('id', '=', $request->id)->with('profile.company', 'profile.department')->first(); 

        return response()->json([
            'item' => $data 
        ], 200); 
    }

    public function profile_update(Request $request)
    {
        $success = true;
        $responseCode = 200;
        $id = auth()->id();
        
        $newData = array( 
            "name" =>  $request['data']['name'],
            "contact_no" => $request['data']['contact_no'],
            "designation" => $request['data']['position'],
            "company_id" => $request['data']['company_id']              
        );  
      
        DB::beginTransaction();
        // do all your updates here
        try { 
            $result = User::where('id', '=', $id)->first(); 
              
            $result->profile()->update($newData); 
            $result->logs()->create([
                'user_id' => $id,
                'log_type' => 'update',
                'details' => json_encode($newData)
            ]);
            
            $msg = "Data has been updated!"; 
          
            DB::commit();
            
        } catch (\Exception $e) {
            DB::rollback(); 
           
            $success = false;
            $msg = $e;
            $responseCode = 500;
        }

        return response()->json([
            'success' => $success,
            'msg' => $msg
        ], $responseCode);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $User
     * @return \Illuminate\Http\Response
     */
 
    public function reset_link_password(Request $request)
    {
        
        $success = true;
        $responseCode = 200;
        $id = ''; 
        $password = Str::random(8);
        $newData = array( 
            "password" =>  Hash::make($password)
        );
      
        DB::beginTransaction();
        // do all your updates here
        try { 
            $data = User::where('id', '=', $request->id)->first();
             
            $data->update($newData); 
            $rabbitArray = array("password" => $password, "email" => $data['email'], "subject" => "Procurement - Reset Password");
            
            UserResetPassword::dispatch($rabbitArray); 
            $msg = "New Password has been sent to the User's Email";
            DB::commit();
            
        } catch (\Exception $e) {
            DB::rollback();
             
            $success = false;
            $msg = "Error: Failed to reset/send the password!";
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
        $id = auth()->id();
        
        $newData = array( 
            "password" =>  Hash::make($request->password)              
        ); 
        
      
        DB::beginTransaction();
        // do all your updates here
        try { 
            $data = User::where('id', '=', $id)->first(); 
             
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
            
        $data->profile()->delete();
        $data->delete();
        $msg = "Data has been deleted!"; 
        return response()->json([
            'success' => true,
            'msg' =>  "Data has been deleted!"
        ], 200);
    }

    public function logout($token){ 
        
        $data = User::where('id', '=', auth()->id())->first(); 
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
                                    "email" => strtolower($v['email']),
                                    "role"  => "normal",
                                    "password"  => Hash::make(strtolower($v['email'])),
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
