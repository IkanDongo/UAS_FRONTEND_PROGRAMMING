<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;

class TipsTriks extends Model
{
    use HasFactory;

    protected $table = 'tipstrik';

    protected $fillable = [
        'name',
        'title', 
        'content',
        'image',
    ];
}