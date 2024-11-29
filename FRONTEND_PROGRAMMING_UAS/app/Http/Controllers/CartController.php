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
    
    public function getCart()
    {
        $cart = Carts::where('user_id', auth()->id())
            ->with('product') 
            ->get();
            
        return response()->json($cart);
    }
}
