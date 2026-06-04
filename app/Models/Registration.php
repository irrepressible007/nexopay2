<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Registration extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'event_id',
        'role_id',
        'bkash_txid',
        'status',
        'form_data',
        'selected_segments',
        'payable_amount',
        'qr_uuid',
        'progress_status',
        'position',
        'prize_won',
        'is_checked_in',
    ];

    protected function casts(): array
    {
        return [
            'form_data' => 'array',
            'selected_segments' => 'array',
            'is_checked_in' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}
