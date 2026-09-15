<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\DiscrepancyAlert;
use Illuminate\Http\Request;

class DiscrepancyAlertController extends Controller
{
    public function index(Request $request)
    {
        $query = DiscrepancyAlert::with(['branch', 'user', 'resolvedByUser']);

        return response()->json([
            'status' => 'success',
            'data' => $query->orderBy('created_at', 'desc')->get()
        ]);
    }

    public function resolve(Request $request, $id)
    {
        $request->validate([
            'resolved_by' => 'required|exists:users,id',
            'resolution_notes' => 'required|string',
        ]);

        $alert = DiscrepancyAlert::findOrFail($id);
        $alert->update([
            'status' => 'resolved',
            'resolved_by' => $request->resolved_by,
            'resolved_at' => now(),
            'resolution_notes' => $request->resolution_notes,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Peringatan selisih berhasil diselesaikan',
            'data' => $alert
        ]);
    }
}
