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
        // DB::table('users')->insert([
        //     'name' => 'Admin',
        //     'email' => 'Admin@example.com',
        //     'password' => Hash::make('Admin123!'),
        //     'is_admin' => true, // Set as admin
        //     'email_verified_at' => now()->toDateTimeString(),
        //     'remember_token' => Str::random(10),
        //     'created_at' => now()->toDateTimeString(),
        //     'updated_at' => now()->toDateTimeString(),
        // ]);
        DB::table('products')->insert([
            [
                'name' => 'Product 1',
                'description' => 'Description for Product 1',
                'category' => 'Category A',
                'price' => 100.00,
                'stock' => 50,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // [
            //     'name' => 'Product 2',
            //     'description' => 'Description for Product 2',
            //     'category' => 'Category B',
            //     'price' => 150.00,
            //     'stock' => 30,
            //     'created_at' => now(),
            //     'updated_at' => now(),
            // ],
        ]);
        $user = \App\Models\User::first();
        $product = \App\Models\Products::first(); 

        DB::table('carts')->insert([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}