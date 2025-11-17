<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostAnnouncement extends Model
{
    protected $fillable = [
        'author_id',
        'privacy_id',
        'title',
        'content',
        'post_photo',
        'status',
    ];
}
