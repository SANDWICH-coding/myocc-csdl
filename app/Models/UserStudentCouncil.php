<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserStudentCouncil extends Model
{
    protected $fillable = [
        'user_id',
        'position',
        'is_removed'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
