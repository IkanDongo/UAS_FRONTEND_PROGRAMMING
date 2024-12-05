<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TipsTriks;

class TipsTrikController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tipstriks = TipsTriks::all();
        return response()->json($tipstriks);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'week_number' => 'required|integer',
            'image' => 'image|file|max:1024',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('image');
            $validated['image'] = basename($imagePath);
        }

        $tipsTrik = TipsTriks::create($validated);
        $tipsTrik->image = $tipsTrik->image ? asset('storage/image/' . $tipsTrik->image) : null;


        return response()->json([
            'message' => 'Tips dan Trik berhasil ditambahkan.',
            'data' => $tipsTrik,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $tipsTrik = TipsTriks::find($id);

        if (!$tipsTrik) {
            return response()->json(['message' => 'Tips dan Trik tidak ditemukan.'], 404);
        }

        return response()->json($tipsTrik, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'week_number' => 'sometimes|integer',
        ]);

        // Mengupdate Tips dan Trik
        $tipsTrik = TipsTriks::find($id);

        if (!$tipsTrik) {
            return response()->json(['message' => 'Tips dan Trik tidak ditemukan.'], 404);
        }

        $tipsTrik->update($validated);

        return response()->json([
            'message' => 'Tips dan Trik berhasil diperbarui.',
            'data' => $tipsTrik,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $tipsTrik = TipsTriks::find($id);

        if (!$tipsTrik) {
            return response()->json(['message' => 'Tips dan Trik tidak ditemukan.'], 404);
        }

        $tipsTrik->delete();

        return response()->json(['message' => 'Tips dan Trik berhasil dihapus.'], 200);
    }
}
