<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\StockOpname;
use Illuminate\Http\Request;

class StockOpnameController extends Controller
{
    public function index(Request $request)
    {
        $query = StockOpname::with(['branch', 'user']);

        if ($request->has('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }

        return response()->json([
            'status' => 'success',
            'data' => $query->orderBy('opname_date', 'desc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'user_id' => 'required|exists:users,id',
            'status' => 'required|string',
            'items' => 'required|array',
        ]);

        $opname = StockOpname::create([
            'branch_id' => $request->branch_id,
            'user_id' => $request->user_id,
            'opname_date' => now(),
            'status' => $request->status,
            'notes' => $request->notes,
        ]);

        foreach ($request->items as $item) {
            $opname->items()->create([
                'ingredient_id' => $item['ingredient_id'],
                'system_qty' => $item['system_qty'],
                'actual_qty' => $item['actual_qty'],
                'difference' => $item['actual_qty'] - $item['system_qty'],
                'notes' => $item['notes'] ?? null,
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Stock opname berhasil disimpan',
            'data' => $opname->load('items')
        ], 201);
    }
}
