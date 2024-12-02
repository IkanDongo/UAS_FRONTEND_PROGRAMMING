<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CommentController;
use Illuminate\Support\Facades\Route;

Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::patch('/users/{id}/toggleAdmin', [UserController::class, 'toggleAdmin']);
Route::post('/users', [UserController::class, 'create']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

Route::post('/products', [ProductController::class, 'create']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'find']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);
Route::put('/products/{id}', [ProductController::class, 'update']);

Route::put('/carts/{user_id}', [CartController::class, 'updateQuantity']);
Route::get('/carts/{user_id}', [CartController::class, 'getCart']);
Route::delete('/carts/{user_id}/{product_id}', [CartController::class, 'removeCart']);

Route::post('/login', [AuthController::class, 'login'])->middleware(\App\Http\Middleware\CorsMiddleware::class);;

Route::get('/{any}', function () {
    return view('login');
})->where('any', '.*');

Route::get('/comments/{product_id}', [CommentController::class, 'index']);
Route::post('/comments', [CommentController::class, 'store']);