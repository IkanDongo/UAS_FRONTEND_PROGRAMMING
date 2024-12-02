<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comments;

class CommentController extends Controller
{
    public function index($productId)
    {
        $comments = Comments::where('product_id', $productId)
            ->with('user:id,name')
            ->get();

        return response()->json([
            'success' => true,
            'comments' => $comments,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,_id',
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
    
        $comment = Comments::create($validated);

        return response()->json([
            'success' => true,
            'comment' => $comment,
        ]);
    }
}
