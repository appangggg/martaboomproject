<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class AdminProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with(['category', 'modifierGroups.modifiers'])->orderBy('sort_order')->get();
        return response()->json([
            'status' => 'success',
            'data' => $products
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'base_price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'description' => 'nullable|string',
            'type' => 'required|in:main,addon,variant',
            'sort_order' => 'integer',
            'image_url' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('image_url')) {
            $path = $request->file('image_url')->store('products', 'public');
            $validated['image_url'] = $path;
        }

        $product = Product::create($validated);

        return response()->json([
            'status' => 'success',
            'data' => $product,
            'message' => 'Product created successfully'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::with(['category', 'modifierGroups.modifiers'])->findOrFail($id);
        return response()->json([
            'status' => 'success',
            'data' => $product
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'category_id' => 'sometimes|required|exists:categories,id',
            'base_price' => 'sometimes|required|numeric|min:0',
            'is_active' => 'boolean',
            'description' => 'nullable|string',
            'type' => 'sometimes|required|in:main,addon,variant',
            'sort_order' => 'integer',
            'image_url' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('image_url')) {
            // Optionally delete old image if exists
            if ($product->image_url && \Illuminate\Support\Facades\Storage::disk('public')->exists($product->image_url)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($product->image_url);
            }
            $path = $request->file('image_url')->store('products', 'public');
            $validated['image_url'] = $path;
        }

        $product->update($validated);

        return response()->json([
            'status' => 'success',
            'data' => $product,
            'message' => 'Product updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Product deleted successfully'
        ]);
    }
}
