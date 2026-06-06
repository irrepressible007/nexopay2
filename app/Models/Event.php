<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'description',
        'cover_image',
        'start_date',
        'end_date',
        'status',
        'participant_price',
        'ca_price',
        'volunteer_price',
        'capacity',
        'form_schema',
        'ca_form_schema',
        'volunteer_form_schema',
        'segments',
        'gallery_images',
        'has_base_price',
        'require_login',
        'payment_instructions',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'form_schema' => 'array',
            'ca_form_schema' => 'array',
            'volunteer_form_schema' => 'array',
            'segments' => 'array',
            'gallery_images' => 'array',
            'has_base_price' => 'boolean',
            'require_login' => 'boolean',
        ];
    }

    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }

    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('Y-m-d\TH:i:s');
    }
}
