<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next)
    {
        // Periksa apakah pengguna sudah terautentikasi
        if (auth()->check()) {
            if (auth()->user()->is_admin !== true) {
                return redirect('/'); // Pengalihan ke halaman utama
            }
        } else {
            return redirect('/login'); // Pengalihan ke halaman login
        }
    
        return $next($request);
    }
    
}
