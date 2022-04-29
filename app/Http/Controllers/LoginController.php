<?php

namespace App\Http\Controllers;
 
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
class LoginController extends Controller
{
     
    public function authenticate(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required' 
        ]);

        $user = User::where('email', $request->email)->first();
        
        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => 'Invalid credentials.',
            ]);
        }
        
        $role = '';
        $token = '';
        if($user->role == 'normal'){
            $role = 'normal';
            $token = $user->createToken($user->email.'_Token', [''])->plainTextToken; 
        }elseif($user->role == 'procurement'){
            $role = 'procurement';
            $token = $user->createToken($user->email.'_ProcToken', ['server:procurement'])->plainTextToken; 
        }elseif($user->role == 'admin'){
            $role = 'admin';
            $token = $user->createToken($user->email.'_AdminToken', ['server:admin'])->plainTextToken; 
        }
    
        return response()->json([
            'status' => 200,
            'username' => $user->email,
            'token' => $token,
            'role'  => $role
        ]);
         
    }
}
