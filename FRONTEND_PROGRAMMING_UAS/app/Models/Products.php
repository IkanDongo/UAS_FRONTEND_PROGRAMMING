<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use App\Models\Carts;

class Products extends Model
{
    protected $connection = 'mongodb';
    protected $fillable = [
        'name',
        'description',
        'category',
        'price',
        'stock',
        'image',
    ];
    
    public function index()
{
    $products = Products::all();
    return response()->json($products);
}

    public function carts()
    {
        return $this->belongsToMany(Carts::class, 'cart_products', 'product_id', 'cart_id')
                    ->withPivot('quantity');
    }
    public function comments()
    {
        return $this->hasMany(Comments::class);
    }

}