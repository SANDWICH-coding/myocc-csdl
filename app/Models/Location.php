<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = [
        'location_name',
        'address',
        'polygon_points',
        'location_photo',
        'status'
    ];
    protected $casts = [
        'polygon_points' => 'array',
    ];

    public function events()
    {
        return $this->hasMany(Event::class);
    }
}
