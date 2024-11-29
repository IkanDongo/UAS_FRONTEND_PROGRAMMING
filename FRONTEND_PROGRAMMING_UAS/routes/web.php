<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use Illuminate\Support\Facades\Route;

Route::get('/users', [UserController::class, 'index']);
Route::patch('/users/{id}/toggleAdmin', [UserController::class, 'toggleAdmin']);
Route::post('/users', [UserController::class, 'create']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

Route::post('/products', [ProductController::class, 'create']);
Route::get('/products', [ProductController::class, 'index']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);
Route::put('/products/{id}', [ProductController::class, 'update']);

// Route::post('/cart/add', [CartController::class, 'addToCart']);
// Route::post('/cart/remove', [CartController::class, 'removeFromCart']);
Route::get('/cart', [CartController::class, 'getCart']);
// Route::middleware('auth')->get('/carts', [CartController::class, 'getCart']);

Route::post('/login', [AuthController::class, 'login'])->middleware(\App\Http\Middleware\CorsMiddleware::class);;

Route::get('/{any}', function () {
    return view('login');
})->where('any', '.*');


// Route::post('/products', [ProductController::class, 'create']);
// Route::get('/products', [ProductController::class, 'index']);
// Route::get('/products/{id}', [ProductController::class, 'find']);