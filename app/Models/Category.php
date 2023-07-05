<?php

namespace App\Models;

use App\Models\Supplier;
use App\Models\ComparisonItem;
use Illuminate\Database\Eloquent\Model;
use App\Models\Local_purchase_order_item;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function supplier()
    {
        return $this->belongsToMany(Supplier::class);
    }

    public function items()
    {
        return $this->belongsToMany(Local_purchase_order_item::class);
    }

    public function comparison()
    {
        return $this->belongsToMany(ComparisonItem::class);
    }
}
