<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment_approval_form_item extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function paf()
    {
        return $this->belongsTo(Payment_approval_form::class, 'payment_approval_form_id');
    }
}
