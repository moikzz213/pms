<?php

namespace App\Models;

use App\Models\Log;
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

    public function logs()
    {
        return $this->morphToMany(Log::class, 'loggable');
    }

    public function lpos()
    {
        return $this->belongsToMany(Local_purchase_order::class);
    }

    public function prfs()
    {
        return $this->belongsToMany(Requests::class);
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

  

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function images()
    { 
        return $this->morphToMany(
            Image::class,
            'imageable',
            'imageables',
            'imageable_id',
            'image_id',
            '',
            'id'
        );

    }

}
