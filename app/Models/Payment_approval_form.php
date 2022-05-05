<?php

namespace App\Models;

use App\Models\User;
use App\Models\Company;
use App\Models\Profile;
use App\Models\Requests;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Model;
use App\Models\Payment_approval_form_item;
use App\Models\Local_purchase_order_approval;
use App\Models\Payment_approval_form_approval;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment_approval_form extends Model
{
    use HasFactory;
    protected $guarded = []; 

    public function lpo_num()
    {
        return $this->belongsTo(Local_purchase_order::class, 'local_purchase_order_id');
    }

    public function paf_items()
    {
        return $this->hasMany(Payment_approval_form_item::class);
    }

    public function paf_approvals()
    {
        return $this->hasMany(Payment_approval_form_approval::class);
    }

    public function process_by()
    {
        return $this->belongsTo(Profile::class, 'user_id', 'user_id');
    } 

    public function requests()
    {
        return $this->belongsTo(Requests::class, 'request_id');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

}
