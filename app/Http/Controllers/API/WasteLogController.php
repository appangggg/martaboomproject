<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\WasteLog;
use App\Models\Product;
use Illuminate\Http\Request;

class WasteLogController extends Controller
{
    public function index(Request $request)
    {
        $query = WasteLog::with(['branch', 'user', 'ingredient']);

        if ($request->has('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }

        if ($request->has('date')) {
            $query->whereDate('logged_at', $request->date);
        }

        $logs = $query->orderBy('logged_at', 'desc')->get();

        // Hitung total loss hari ini untuk summary
        $todayLoss = WasteLog::when($request->has('branch_id'), function ($q) use ($request) {
                $q->where('branch_id', $request->branch_id);
            })
            ->whereDate('logged_at', now())
            ->sum('estimated_cost');

        return response()->json([
            'status'      => 'success',
            'data'        => $logs,
            'today_total' => $todayLoss,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'user_id'   => 'required|exists:users,id',
            'item_id'   => 'required|integer',
            'quantity'  => 'required|numeric|min:0.01',
            'unit'      => 'required|string',
            'reason'    => 'required|string',
            'estimated_cost' => 'required|numeric',
        ]);

        $log = WasteLog::create([
            'branch_id'      => $request->branch_id,
            'user_id'        => $request->user_id,
            'ingredient_id'  => $request->item_id,
            'quantity'       => $request->quantity,
            'unit'           => $request->unit,
            'reason'         => 'other',
            'description'    => $request->reason,
            'estimated_cost' => $request->estimated_cost,
            'logged_at'      => now(),
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Catatan pembuangan (waste) berhasil disimpan',
            'data'    => $log->load(['branch', 'user']),
        ], 201);
    }
}
