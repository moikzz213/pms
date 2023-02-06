<?php

namespace App\Models;

use App\Models\Feedback;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FeedbackDiscount extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function discount()
    {
        return $this->belongsTo(Feedback::class);
    }
}
