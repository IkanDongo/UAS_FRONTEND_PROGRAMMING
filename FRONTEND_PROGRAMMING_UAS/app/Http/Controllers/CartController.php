<?php

namespace App\Http\Controllers;

use App\Models\Carts;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function addItem(Request $request)
    {
        $product = Products::find($request->product_id);
        
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $item = Carts::create([
            'user_id' => auth()->id(),
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
        ]);

        return response()->json($item);
    }
    
    public function getCart($user_id)
    {
        // Mengambil semua data cart berdasarkan user_id, termasuk relasi dengan produk
        $cart = Carts::where('user_id', $user_id)->with('product')->get();
    
        // Cek apakah data cart ada
        if ($cart->isEmpty()) {
            \Log::warning('No cart found for user_id: ' . $user_id);
            return response()->json(['message' => 'Cart not found'], 404);
        }
    
        // Siapkan array untuk menyimpan data cart dengan produk
        $cartData = $cart->map(function ($cartItem) {
            return [
                'cart_id' => $cartItem->id,
                'quantity' => $cartItem->quantity,
                'product' => [
                    'product_id' => $cartItem->product->id,
                    'name' => $cartItem->product->name, 
                    'price' => $cartItem->product->price, 
                    'stock' => $cartItem->product->stock, 
                ]
            ];
        });
    
        \Log::info('Cart data for user_id ' . $user_id . ': ' . $cartData);
    
        return response()->json([
            'message' => 'Cart found.',
            'cart_data' => $cartData
        ]);
    }
    
    
}
