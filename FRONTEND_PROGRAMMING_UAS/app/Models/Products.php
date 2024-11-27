<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Model;
use MongoDB\Laravel\Eloquent\Model;

class Products extends Model
{
    protected $fillable = [
        'name',
        'description',
        'category',
        'price',
        'stock',
    ];

    // public function ratings()
    // {
    //     return $this->hasMany(Rating::class);
    // }
}