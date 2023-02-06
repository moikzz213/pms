<?php

namespace App\Models;

use App\Models\User;
use App\Models\Company;
use App\Models\Requests;
use App\Models\Supplier;
use App\Models\Comparison;
use App\Models\Local_purchase_order;
use App\Models\Payment_approval_form;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Log extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function request()
    {
        return $this->morphedByMany(Requests::class, 'loggable');
    }

    public function comparison()
    {
        return $this->morphedByMany(Comparison::class, 'loggable');
    }

    public function company()
    {
        return $this->morphedByMany(Company::class, 'loggable');
    }

    public function supplier()
    {
        return $this->morphedByMany(Supplier::class, 'loggable');
    }

    public function lpo()
    {
        return $this->morphedByMany(Local_purchase_order::class, 'loggable');
    } 

    public function paf()
    {
        return $this->morphedByMany(Payment_approval_form::class, 'loggable');
    } 
 

    public function users()
    {
        return $this->morphedByMany(User::class, 'loggable');
    }
}