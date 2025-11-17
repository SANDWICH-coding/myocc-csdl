<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Violation extends Model
{
    protected $fillable = [
        'violation_code',
        'violation_description',
        'status',
    ];
}
