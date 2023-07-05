<?php

namespace App\Models;

use App\Models\Profile;
use App\Models\Comparison;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ComparisonApproval extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function comparison()
    {
        return $this->belongsTo(Comparison::class);
    } 

    public function profile()
    {
        return $this->belongsTo(Profile::class,  "user_id", "user_id");
    }
}
