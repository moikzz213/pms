<?php

namespace App\Models;

use App\Models\Image;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Requests extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function profile()
    {
        return $this->belongsTo(Profile::class, 'user_id', "user_id");
    }

    public function process_by()
    {
        return $this->belongsTo(Profile::class, 'process_by', 'user_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function images()
    { 
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
