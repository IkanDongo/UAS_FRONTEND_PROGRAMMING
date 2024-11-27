<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

Route::get('/users', [UserController::class, 'index']);
// Route::get('/users{id}', [UserController::class, '']);
Route::post('/users', [UserController::class, 'create']);

Route::post('/login', [AuthController::class, 'login'])->middleware(\App\Http\Middleware\CorsMiddleware::class);;

Route::get('/{any}', function () {
    return view('login');
})->where('any', '.*');


Route::post('/products', [ProductController::class, 'create']);