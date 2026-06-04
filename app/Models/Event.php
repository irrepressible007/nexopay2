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
        'segments',
        'gallery_images',
        'has_base_price',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'form_schema' => 'array',
            'segments' => 'array',
            'gallery_images' => 'array',
            'has_base_price' => 'boolean',
        ];
    }

    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }
}
