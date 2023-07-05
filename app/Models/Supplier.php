<?php

namespace App\Models;
use App\Models\Comparison;
use App\Models\Feedback;
use App\Models\FeedbackDiscount;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Supplier extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function logs()
    {
        return $this->morphToMany(Log::class, 'loggable');
    }

    public function category()
    {
        return $this->belongsToMany(Category::class);
    }

    public function quotations()
    {
        return $this->hasMany(Feedback::class);
    }

    public function netamount()
    {
        return $this->hasMany(FeedbackDiscount::class);
    }

    public function comparison()
    {
        return $this->belongsToMany(Comparison::class);
    }
}
