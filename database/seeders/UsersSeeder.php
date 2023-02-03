<?php

namespace Database\Seeders;

use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = new \App\Models\User([ 
            'email'    => 'admin@admin.com',
            'password' => Hash::make('gag@112211'),
            'status'    => 'active', 
            'role'     => 'admin'
        ]);

        $user->save(); 

        $profile = new \App\Models\Profile([ 
            'name'     => 'Super Admin', 
            'designation'    => 'Sr. Web Developer', 
            'user_id'    => 1, 
            'company_id'     =>  1,
            'department_id' => 27
        ]);
        $profile->save();
}
}