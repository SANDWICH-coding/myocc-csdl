<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class UserViolationRecord extends Model
{
    // Allow mass assignment for these fields
    protected $fillable = [
        'reference_no',
        'user_id',
        'violation_ids',
        'sanction_id',
        'issued_by',
        'status',
        'issued_date_time',
        'remarks',
    ];

    // Cast fields to appropriate types
    protected $casts = [
        'violation_ids' => 'array',          // JSON field cast to array
        'issued_date_time' => 'datetime',    // Datetime field cast to Carbon
    ];

    /**
     * The user who received the violation
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Optionally, the staff/admin who issued the violation
     */
    public function issuer()
    {
        return $this->belongsTo(User::class, 'issued_by');
    }

    /**
     * If you have a sanctions table, link the sanction
     */
    public function sanction()
    {
        return $this->belongsTo(Sanction::class, 'sanction_id');
    }
}
