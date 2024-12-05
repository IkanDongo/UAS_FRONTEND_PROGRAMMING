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
        return response()->json($users);
    }

    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:50',
            'email' => 'required|string|unique:users,email',
            'password' => 'required|string|min:8',
            'phoneno' => 'required|string|min:8',
            'address' => 'required|string|max:50',
            
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
        $user->phoneno = $request->phoneno;
        $user->address = $request->address;
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

    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User removed successfully'], 200);
    }

    public function show($id)
    {
        $user = User::find($id);

        if(!$user) {
            return response()->json([
                'status' => false,
            ]);
        }

        return response()->json([
            'status' => true,
            'user' => $user
        ]);
    }
}