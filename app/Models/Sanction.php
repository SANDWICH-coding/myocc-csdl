<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sanction extends Model
{
    protected $fillable = [
        'sanction_type',
        'sanction_name',
        'sanction_description',
        'monetary_amount',
        'service_time',
        'service_time_type',
        'status'
    ];

    public function events()
    {
        return $this->hasMany(Event::class);
    }
}
