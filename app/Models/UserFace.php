<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserFace extends Model
{
    protected $fillable = [
        'user_id_no',
        'user_face_embeddings'
    ];

    protected $casts = [
        'user_face_embeddings' => 'array',
    ];
}
