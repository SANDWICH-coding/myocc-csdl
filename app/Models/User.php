<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'user_id_no', 'password', 'user_role', 'face_enrolled', 'profile_photo'
    ];

    protected $hidden = [
        'password'
    ];
}
