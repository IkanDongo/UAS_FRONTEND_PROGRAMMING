<?php


namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'name' => 'Admin',
            'email' => 'Admin@example.com',
            'password' => Hash::make('Admin123!'),
            'is_admin' => true, // Set as admin
            'email_verified_at' => now()->toDateTimeString(),
            'remember_token' => Str::random(10),
            'created_at' => now()->toDateTimeString(),
            'updated_at' => now()->toDateTimeString(),
        ]);

        // Menambahkan pengguna biasa
        DB::table('users')->insert([
            'name' => 'User',
            'email' => 'User@example.com',
            'password' => Hash::make('User123!'),
            'is_admin' => false, 
            'email_verified_at' => now()->toDateTimeString(),
            'remember_token' => Str::random(10),
            'created_at' => now()->toDateTimeString(),
            'updated_at' => now()->toDateTimeString(),
        ]);
    }
}