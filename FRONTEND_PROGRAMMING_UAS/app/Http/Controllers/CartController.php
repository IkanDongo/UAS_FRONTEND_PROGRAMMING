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

    public function removeCart($userId, $productId)
    {
        $deleted = Carts::where('user_id', $userId)
                    ->where('product_id', $productId)
                    ->delete();

        if ($deleted) {
            return response()->json(['message' => 'Item removed successfully'], 200);
        }

        return response()->json(['message' => 'Item not found or could not be deleted'], 404);
    }

    
    public function getCart($user_id)
    {
        $cart = Carts::where('user_id', $user_id)->with('product')->get();
    
        if ($cart->isEmpty()) {
            return response()->json(['message' => 'Cart not found'], 404);
        }
    
        $cartData = $cart->map(function ($cartItem) {
            return [
                'cart_id' => $cartItem->id,
                'quantity' => $cartItem->quantity,
                'product' => [
                    'product_id' => $cartItem->product->id,
                    'name' => $cartItem->product->name, 
                    'price' => $cartItem->product->price, 
                    'stock' => $cartItem->product->stock, 
                    'image' => $cartItem->product->image, 
                ]
            ];
        });
        
        return response()->json([
            'message' => 'Cart found.',
            'cart_data' => $cartData
        ]);
    }
    
    
}
