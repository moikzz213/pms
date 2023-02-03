<?php

namespace App\Http\Controllers;
 

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
class LoginController extends Controller
{
    public function authenticate()
    {
        
        $access = "";
        if(Auth::guest()){
            $role = "guest";
            $status = 'draft';
        }else{
            $user = auth()->user()->load(['profile']);

            if(isset($user)){ 
                $role = $user->role;
                $status = 'active';

                return response()->json([
                    'status' => $status,
                    'username' => isset($user) ? $user->email : null,
                    'user' => isset($user) ? $user : null,
                    'role'  => $role
                ]);
            }
        }  
        
    }  
     
}
