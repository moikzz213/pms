<?php

namespace App\Models;

use App\Models\Log;
use App\Models\Image;
use App\Models\Company;
use App\Models\Feedback;
use App\Models\Supplier;
use App\Models\Department;
use App\Models\ComparisonItem;
use App\Models\FeedbackDiscount;
use App\Models\ComparisonApproval;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Comparison extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function comparison_approvals()
    {
        return $this->hasMany(ComparisonApproval::class);
    }

    public function items()
    {
        return $this->hasMany(ComparisonItem::class);
    } 

    public function quotations()
    {
        return $this->hasMany(Feedback::class);
    } 

    public function quotation_total_amount()
    {
        return $this->hasMany(FeedbackDiscount::class);
    }

    public function processedBy()
    {
        return $this->belongsTo(Profile::class, 'user_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function suppliers()
    {
        return $this->belongsToMany(Supplier::class);
    }

    public function logs()
    {
        return $this->morphToMany(Log::class, 'loggable');
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
