<?php

namespace App\Models;
 
use App\Models\Image;
use App\Models\Comparison;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FeedbackDiscount extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function discount()
    {
        return $this->belongsTo(Comparison::class);
    }

    public function images(){
        return $this->morphToMany(
            Image::class,
            'imageable',
            'imageables',
            'imageable_id',
            'image_id',
            '',
            'id'
        );
    }
}
