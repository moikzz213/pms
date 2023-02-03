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
        return $this->morphedByMany(
            Requests::class,
            'imageable',
            'imageables',
            'image_id',
            'imageable_id',
            'id',
            'request_id',
        );
    }

    public function pafs()
    { 
        return $this->morphedByMany(
            Payment_approval_form::class,
            'imageable',
            'imageables',
            'image_id',
            'imageable_id',
            'id',
            'payment_approval_form_id',
        );
    }
}
