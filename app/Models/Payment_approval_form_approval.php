<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment_approval_form_approval extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function paf()
    {
        return $this->belongsTo(Payment_approval_form::class);
    }

    public function users()
    {
        return $this->belongsTo(User::class,  "user_id");
    }
}
