<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Products;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Products::all();
        return response()->json($products);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {

        
        
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'image|file|max:1024',
        ]);

        if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('image');
        $validatedData['image'] = basename($imagePath);
        }


        $product = Products::create($validatedData);
        $product->image = $product->image ? asset('storage/image/' . $product->image) : null;


    return response()->json([
    'message' => 'Products created successfully',
    'product' => $product,
    ], 201);

    }

    /**
     * Display the specified resource.
     */
    public function find(string $id)
    {
        $product = Products::find($id);

        if (!$product) {
            return response()->json(['message' => 'Products not found'], 404);
        }

        return response()->json($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Products::find($id);

        if (!$product) {
            return response()->json(['message' => 'Products not found'], 404);
        }

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            
        ]);
        

        $product->update($validatedData);

        return response()->json([
            'message' => 'Products updated successfully',
            'product' => $product,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Products::find($id);

        if (!$product) {
            return response()->json(['message' => 'Products not found'], 404);
        }

        $product->delete();

        return response()->json(['message' => 'Products deleted successfully']);
    }

    public function addRating(Request $request, $productId)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $product = Products::find($productId);

        if (!$product) {
            return response()->json(['message' => 'Products not found'], 404);
        }

        $rating = $product->ratings()->create([
            'user_id' => $validated['user_id'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        return response()->json([
            'message' => 'Rating added successfully',
            'rating' => $rating,
        ], 201);
    }

    public function getRatings($productId)
    {
        $product = Products::with('ratings.user')->find($productId);

        if (!$product) {
            return response()->json(['message' => 'Products not found'], 404);
        }

        return response()->json($product->ratings);
    }

    public function destroyRating($productId, $ratingId)
    {
        $product = Products::find($productId);

        if (!$product) {
            return response()->json(['message' => 'Products not found'], 404);
        }

        $rating = $product->ratings()->find($ratingId);

        if (!$rating) {
            return response()->json(['message' => 'Rating not found'], 404);
        }

        if ($rating->user_id !== auth()->id() && !auth()->user()->is_admin) {
            return response()->json(['message' => 'You are not authorized to delete this rating'], 403);
        }

        $rating->delete();

        return response()->json(['message' => 'Rating deleted successfully']);
    }
}