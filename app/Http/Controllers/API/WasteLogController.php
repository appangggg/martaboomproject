<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\WasteLog;
use Illuminate\Http\Request;

class WasteLogController extends Controller
{
    public function index(Request $request)
    {
        $query = WasteLog::with(['branch', 'user']); // Product/Ingredient relations might not exist directly if they are polymorphic or nullable, check model later

        if ($request->has('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }

        if ($request->has('date')) {
            $query->whereDate('recorded_at', $request->date);
        }

        return response()->json([
            'status' => 'success',
            'data' => $query->orderBy('recorded_at', 'desc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'user_id' => 'required|exists:users,id',
            'item_type' => 'required|string', // product / ingredient
            'item_id' => 'required|integer',
            'quantity' => 'required|numeric',
            'reason' => 'required|string',
            'cost_loss' => 'required|numeric',
        ]);

        $log = WasteLog::create(array_merge($request->all(), ['recorded_at' => now()]));

        return response()->json([
            'status' => 'success',
            'message' => 'Catatan pembuangan (waste) berhasil disimpan',
            'data' => $log
        ], 201);
    }
}
