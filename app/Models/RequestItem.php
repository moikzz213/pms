<?php

namespace App\Models;

use App\Models\Requests;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RequestItem extends Model
{
    use HasFactory;
    protected $guarded = [];
    
    public function requests()
    {
        return $this->belongsTo(Requests::class, 'request_id');
    }
}
