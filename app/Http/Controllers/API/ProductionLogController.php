<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ProductionLog;
use Illuminate\Http\Request;

class ProductionLogController extends Controller
{
    public function index(Request $request)
    {
        $query = ProductionLog::with(['recipe', 'user']);

        if ($request->has('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }

        if ($request->has('date')) {
            $query->whereDate('produced_at', $request->date);
        }

        return response()->json([
            'status' => 'success',
            'data' => $query->orderBy('produced_at', 'desc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'recipe_id' => 'required|exists:recipes,id',
            'user_id' => 'required|exists:users,id',
            'batch_quantity' => 'required|numeric',
            'actual_yield' => 'required|numeric',
            'expected_yield' => 'required|numeric',
            'notes' => 'nullable|string'
        ]);

        $log = ProductionLog::create(array_merge($request->all(), ['produced_at' => now()]));

        return response()->json([
            'status' => 'success',
            'message' => 'Catatan produksi berhasil disimpan',
            'data' => $log
        ], 201);
    }
}
