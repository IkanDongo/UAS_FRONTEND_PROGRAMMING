<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comments;
use App\Models\User;

class CommentController extends Controller
{
    public function store(Request $request, $user_id)
    {
        if (!User::where('_id', $user_id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        }

        $validated = $request->validate([
            'product_id' => 'required|exists:products,_id',
            'comment' => 'nullable|string|max:250',
            'rating' => 'nullable|integer|min:1|max:5',
        ]);

        if (empty($validated['comment']) && empty($validated['rating'])) {
            return response()->json([
                'success' => false,
                'message' => 'At least one of them, comment or rating, must be filled in.',
            ], 422);
        }

        $validated['user_id'] = $user_id;

        $comment = Comments::create($validated);

        return response()->json([
            'success' => true,
            'comment' => $comment,
        ]);
    }
}