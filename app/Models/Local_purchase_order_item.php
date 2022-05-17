<?php

namespace App\Models;

use App\Models\Category;
use App\Models\Local_purchase_order;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Local_purchase_order_item extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function lpo()
    {
        return $this->belongsTo(Local_purchase_order::class, 'local_purchase_order_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
