<?php

namespace App\Models;

use App\Models\Requests;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Image extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function requests()
    {
        // return $this->morphedByMany(Category::class, 'section_id');
        return $this->morphedByMany(
            Request::class,
            'imageable',
            'imageables',
            'image_id',
            'imageable_id',
            'id',
            'request_id',
        );
    }
}
