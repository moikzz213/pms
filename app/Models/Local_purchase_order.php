<?php

namespace App\Models;

use App\Models\Requests;
use App\Models\User;
use App\Models\Profile;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Model;
use App\Models\Local_purchase_order_item;
use App\Models\Local_purchase_order_approval;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Local_purchase_order extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function users()
    {
        return $this->belongsTo(User::class, 'id', 'contact_person');
    } 

    public function lpo_items()
    {
        return $this->hasMany(Local_purchase_order_item::class);
    }

    public function lpo_approvals()
    {
        return $this->hasMany(Local_purchase_order_approval::class);
    }

    public function process_by()
    {
        return $this->belongsTo(Profile::class, 'user_id', 'user_id');
    }

    public function shipping()
    {
        return $this->belongsTo(Company::class);
    }

    public function billing()
    {
        return $this->belongsTo(Company::class, 'billing_details_id', 'id');
    }

    public function contact_person()
    {
        return $this->belongsTo(User::class, 'contact_person');
    } 
    
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function requests()
    {
        return $this->belongsTo(Requests::class, 'request_id', 'id');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

}
