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
    ];

    public function setAttribute($key, $value)
    {
        if (in_array($key, ['user_id_no', 'first_name', 'last_name', 'middle_name'])) {
            $this->attributes[$key] = strtoupper($value);
        } else {
            $this->attributes[$key] = $value;
        }
    }

}
