<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Ingredient;
use Illuminate\Http\Request;

class IngredientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ingredients = Ingredient::orderBy('name')->get();
        return response()->json([
            'status' => 'success',
            'data' => $ingredients
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'unit' => 'required|string|max:50',
            'cost_per_unit' => 'required|numeric|min:0',
            'sku' => 'nullable|string|max:100|unique:ingredients',
            'supplier_name' => 'nullable|string|max:255',
            'min_stock_threshold' => 'nullable|numeric|min:0',
            'category' => 'nullable|string|max:100',
            'is_active' => 'boolean',
        ]);

        $ingredient = Ingredient::create($validated);

        return response()->json([
            'status' => 'success',
            'data' => $ingredient,
            'message' => 'Bahan baku berhasil ditambahkan.'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $ingredient = Ingredient::findOrFail($id);
        return response()->json([
            'status' => 'success',
            'data' => $ingredient
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $ingredient = Ingredient::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'unit' => 'required|string|max:50',
            'cost_per_unit' => 'required|numeric|min:0',
            'sku' => 'nullable|string|max:100|unique:ingredients,sku,' . $ingredient->id,
            'supplier_name' => 'nullable|string|max:255',
            'min_stock_threshold' => 'nullable|numeric|min:0',
            'category' => 'nullable|string|max:100',
            'is_active' => 'boolean',
        ]);

        $ingredient->update($validated);

        return response()->json([
            'status' => 'success',
            'data' => $ingredient,
            'message' => 'Bahan baku berhasil diperbarui.'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $ingredient = Ingredient::findOrFail($id);
        $ingredient->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Bahan baku berhasil dihapus.'
        ]);
    }
}
