<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'recipient',
        'sender_id',
        'parent_id',
        'subject',
        'body',
        'status',
        'type',
        'error_message',
    ];
}
