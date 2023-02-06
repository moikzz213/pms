<?php

namespace App\Models;

use App\Models\Feedback;
use App\Models\Comparison;
use App\Models\ComparisonRecipient;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ComparisonItem extends Model
{
    use HasFactory;
    protected $guarded = [];


    public function comparison()
    {
        return $this->belongsTo(Comparison::class, 'comparison_id');
    } 

    public function feedbackItems()
    {
        return $this->hasMany(Feedback::class, 'comparison_item_id');
    }
}
