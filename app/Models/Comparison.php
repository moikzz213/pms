<?php

namespace App\Models;

use App\Models\Log;
use App\Models\Recipient;
use App\Models\ComparisonItem;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Comparison extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function items()
    {
        return $this->hasMany(ComparisonItem::class);
    } 

    public function recipients()
    {
        return $this->belongsToMany(Recipient::class);
    }

    public function logs()
    {
        return $this->morphToMany(Log::class, 'loggable');
    }
}
