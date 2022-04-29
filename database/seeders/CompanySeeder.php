<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = new \App\Models\Company([
            'title'     => "Ghassan Aboud Group FZE",
            'address'     => 'Jafza 14, Gate 4, Street No. 405, Jebel Ali, Dubai',
            'tax_no'     => '100435155500003',
            'contact_person'     => 'Saleh Al Chalabi',
            'contact_no'     => '04-8812437',
            'email'     => 'saleh@gagroup.net',
        ]);
        $data->save();
    }
}
