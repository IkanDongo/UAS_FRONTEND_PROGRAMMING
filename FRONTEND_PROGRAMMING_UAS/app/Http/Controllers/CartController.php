<?php

namespace App\Http\Controllers;

use App\Models\Carts;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CartController extends Controller
{
    public function addItem(Request $request, $user_id)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,_id',
            'quantity' => 'required|integer|min:1',
        ]);
    
        $product = Products::find($validated['product_id']);
        
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
    
        $existingCartItem = Carts::where('user_id', $user_id)
            ->where('product_id', $validated['product_id'])
            ->first();
    
        if ($existingCartItem) {
            $existingCartItem->quantity += $validated['quantity'];
            $existingCartItem->save();
    
            return response()->json([
                'message' => 'Cart updated successfully!',
                'cart_item' => $existingCartItem,
            ], 200);
        }
    
        $cartItem = Carts::create([
            'user_id' => $user_id,
            'product_id' => $validated['product_id'],
            'quantity' => $validated['quantity'],
        ]);
    
        return response()->json([
            'message' => 'Item added to cart successfully!',
            'cart_item' => $cartItem,
        ], 201);
    }
    

    public function removeCart($user_id, $cart_id)
    {
        $deleted = Carts::where('user_id', $user_id)
                    ->where('_id', $cart_id)
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

    public function updateQuantity(Request $request, $userId, $itemId)
    {
        $validatedData = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = Carts::where('user_id', $userId)->where('product_id', $itemId)->first(['cart_id']);

        if (!$cartItem) {
            return response()->json(['message' => 'Cart item not found.'], 404);
        }

        $cartItem->quantity = $validatedData['quantity'];
        $cartItem->save();

        return response()->json(['message' => 'Quantity updated successfully.', 'data' => $cartItem]);
    }
}
