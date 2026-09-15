<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Get all categories and their products with modifiers.
     * This is useful for building the POS menu.
     */
    public function index(Request $request)
    {
        $categories = Category::with(['products' => function ($query) {
            $query->where('is_active', true)
                  ->orderBy('sort_order')
                  ->with(['modifierGroups.modifiers']);
        }])->orderBy('sort_order')->get();

        return response()->json([
            'status' => 'success',
            'data' => $categories
        ]);
    }

    /**
     * Get products directly without grouping by category.
     */
    public function getProducts(Request $request)
    {
        $products = Product::where('is_active', true)
            ->with(['category', 'modifierGroups.modifiers'])
            ->orderBy('sort_order')
            ->get();
            
        return response()->json([
            'status' => 'success',
            'data' => $products
        ]);
    }

    /**
     * Store a new product.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'base_price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'description' => 'nullable|string',
            'type' => 'required|in:main,addon,variant'
        ]);

        $product = Product::create($validated);

        return response()->json([
            'status' => 'success',
            'data' => $product,
            'message' => 'Product created successfully'
        ], 201);
    }

    /**
     * Update an existing product.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'category_id' => 'sometimes|required|exists:categories,id',
            'base_price' => 'sometimes|required|numeric|min:0',
            'is_active' => 'boolean',
            'description' => 'nullable|string',
            'type' => 'sometimes|required|in:main,addon,variant'
        ]);

        $product->update($validated);

        return response()->json([
            'status' => 'success',
            'data' => $product,
            'message' => 'Product updated successfully'
        ]);
    }

    /**
     * Delete a product.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Product deleted successfully'
        ]);
    }
}
