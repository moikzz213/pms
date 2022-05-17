<?php

namespace App\Models;

use App\Models\Profile;
use App\Models\Local_purchase_order;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Department extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function profile()
    {
        return $this->belongsToMany(Profile::class);
    }

    public function lpo()
    {
        return $this->belongsToMany(Local_purchase_order::class);
    }
}
