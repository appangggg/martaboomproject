<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\PettyCashEntry;
use Illuminate\Http\Request;

class PettyCashController extends Controller
{
    public function index(Request $request)
    {
        $query = PettyCashEntry::with(['user', 'approvedByUser']);

        if ($request->has('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }

        if ($request->has('shift_id')) {
            $query->where('shift_id', $request->shift_id);
        }

        if ($request->has('date')) {
            $query->whereDate('created_at', $request->date);
        }

        return response()->json([
            'status' => 'success',
            'data' => $query->orderBy('created_at', 'desc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'user_id' => 'required|exists:users,id',
            'shift_id' => 'nullable|exists:shifts,id',
            'type' => 'required|in:in,out',
            'category' => 'required|string',
            'amount' => 'required|numeric',
            'description' => 'required|string',
        ]);

        $entry = PettyCashEntry::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Entri kas kecil berhasil disimpan',
            'data' => $entry
        ], 201);
    }

    public function approve(Request $request, $id)
    {
        $request->validate([
            'approved_by' => 'required|exists:users,id'
        ]);

        $entry = PettyCashEntry::findOrFail($id);
        $entry->update([
            'approved_by' => $request->approved_by,
            'approved_at' => now()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Entri kas kecil berhasil disetujui',
            'data' => $entry
        ]);
    }

    public function destroy($id)
    {
        $entry = PettyCashEntry::findOrFail($id);
        $entry->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Entri kas kecil berhasil dihapus'
        ]);
    }
}
