<?php


namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class CartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = \App\Models\User::first();
        $product = \App\Models\Products::first(); 

        DB::table('carts')->insert([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'image' => 'TSLEuEvwpfRjmxNdLGD0suh7jxZhZi7AaWHyGkLi.svg',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}