<?php

namespace App\Models;

use App\Models\Supplier;
use App\Models\ComparisonItem;
use App\Models\FeedbackDiscount;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Feedback extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function comparisonItems()
    {
        return $this->belongsTo(ComparisonItem::class);
    }

    public function discount()
    {
        return $this->belongsTo(FeedbackDiscount::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
}
