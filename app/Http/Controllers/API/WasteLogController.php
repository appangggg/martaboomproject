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
        $query = WasteLog::with(['branch', 'user']);

        if ($request->has('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }

        if ($request->has('date')) {
            $query->whereDate('recorded_at', $request->date);
        }

        $logs = $query->orderBy('recorded_at', 'desc')->get();

        // Hitung total loss hari ini untuk summary
        $todayLoss = WasteLog::when($request->has('branch_id'), function ($q) use ($request) {
                $q->where('branch_id', $request->branch_id);
            })
            ->whereDate('recorded_at', now())
            ->sum('cost_loss');

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
            'item_type' => 'required|string',      // 'product' atau 'ingredient'
            'item_id'   => 'required|integer',
            'item_name' => 'nullable|string',       // nama item untuk display
            'quantity'  => 'required|numeric|min:0.01',
            'reason'    => 'required|string',
            'notes'     => 'nullable|string',
        ]);

        // Hitung cost_loss otomatis dari harga produk jika item_type = product
        $costLoss = $request->input('cost_loss', 0);
        if ($request->item_type === 'product' && $costLoss == 0) {
            $product = Product::find($request->item_id);
            if ($product) {
                $costLoss = $product->base_price * $request->quantity;
            }
        }

        $log = WasteLog::create([
            'branch_id'   => $request->branch_id,
            'user_id'     => $request->user_id,
            'item_type'   => $request->item_type,
            'item_id'     => $request->item_id,
            'quantity'    => $request->quantity,
            'reason'      => $request->reason,
            'notes'       => $request->notes ?? '',
            'cost_loss'   => $costLoss,
            'recorded_at' => now(),
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Catatan pembuangan (waste) berhasil disimpan',
            'data'    => $log->load(['branch', 'user']),
        ], 201);
    }
}
