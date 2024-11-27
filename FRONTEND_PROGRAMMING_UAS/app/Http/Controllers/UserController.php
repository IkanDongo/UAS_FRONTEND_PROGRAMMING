<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        // $users = User::select('name', 'email')->get();
        
        return response()->json($users);
    }

    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:50',
            'email' => 'required|string|unique:users,email',
            'password' => 'required|string|min:8'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 400);
        }

        $user = new User;
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->save();
        
        return response()->json([
            'message' => 'User created successfully',
            'success' => true,
            'user' => $user
        ], 201);
    }

    public function toggleAdmin($id)
{
    $user = User::findOrFail($id);
    $user->is_admin = !$user->is_admin;
    $user->save();

    return response()->json([
        'message' => 'User admin status updated successfully.',
        'user' => $user
    ]);
}
}
