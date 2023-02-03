<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function dashboard()
    {
        return view('layouts.dashboard');
    } 

    public function home()
    {
        $role = Auth::user()->role; 
        $allRoles = array('moderator', 'superadmin', 'normal','procurement');
        if (in_array($role, $allRoles)) {
            return redirect('/d/admin/dashboard');
        }else{
            return view('/login');
        }
    }
}