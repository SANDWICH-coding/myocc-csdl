<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventAttendance extends Model
{
    protected $fillable = [
        'event_id',
        'user_id_no',
        'checkpoint',
        'attended_at',
        'location_coordinates',
        'device_user_id_no',
        'device_model'
    ];

    protected $casts = [
        'location_coordinates' => 'array',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

}
