<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserInformation extends Model
{
    protected $fillable = [
        'user_id_no',
        'first_name',
        'last_name',
        'middle_name',
        'email_address',
        'profile_photo',
    ];

}
