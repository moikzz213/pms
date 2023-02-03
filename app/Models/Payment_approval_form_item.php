<?php

namespace App\Models;

use App\Models\Requests;
use App\Models\Supplier;
use App\Models\Local_purchase_order;
use App\Models\Payment_approval_form;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment_approval_form_item extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function paf()
    {
        return $this->belongsTo(Payment_approval_form::class, 'payment_approval_form_id');
    }

    public function lpo()
    {
        return $this->belongsTo(Local_purchase_order::class, 'local_purchase_order_id');
    }

    public function requests()
    {
        return $this->belongsTo(Requests::class, 'local_purchase_order_id');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }
}
