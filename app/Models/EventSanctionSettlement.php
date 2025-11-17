<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventSanctionSettlement extends Model
{
    protected $fillable = [
        'event_id',
        'user_id_no',
        'sanction_id',
        'settlement_type',
        'amount_paid',
        'service_completed',
        'service_time_type',
        'settlement_logged_by',
        'status',
        'remarks',
    ];

    public function sanction()
    {
        return $this->belongsTo(Sanction::class);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // Generate a unique 8-digit numeric ID
            do {
                $id = str_pad(mt_rand(1, 99999999), 8, '0', STR_PAD_LEFT);
            } while (self::where('id', $id)->exists());

            $model->id = $id;
        });
    }
}
