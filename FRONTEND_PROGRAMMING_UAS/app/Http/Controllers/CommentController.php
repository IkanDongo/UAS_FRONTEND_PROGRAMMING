<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comments;

class CommentController extends Controller
{
    public function store(Request $request, $user_id)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,_id',
            'comment' => 'nullable|string|max:250',
            'rating' => 'nullable|integer|min:1|max:5',
        ]);
    
        if (empty($validated['comment']) && empty($validated['rating'])) {
            return response()->json([
                'success' => false,
                'message' => 'Minimal salah satu, komentar atau rating, harus diisi.',
            ], 422);
        }
    
        $validated['user_id'] = $user_id;
    
        $comment = Comments::create($validated);
    
        return response()->json([
            'success' => true,
            'comment' => $comment,
        ]);
    }
    public function index($product_id)
    {
        $comments = Comments::where('product_id', $product_id)->get();
        return response()->json($comments);
    }
    
}
