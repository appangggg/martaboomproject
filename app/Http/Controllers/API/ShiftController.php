<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Shift;
use Illuminate\Http\Request;

class ShiftController extends Controller
{
    public function current(Request $request)
    {
        $branchId = $request->query('branch_id', 1);
        $userId = $request->query('user_id', 1);

        $shift = Shift::where('branch_id', $branchId)
            ->where('user_id', $userId)
            ->where('status', 'open')
            ->first();

        return response()->json([
            'status' => 'success',
            'data' => $shift
        ]);
    }

    public function start(Request $request)
    {
        $request->validate([
            'branch_id' => 'nullable|integer',
            'user_id'   => 'required|integer',
            'shift_type' => 'required|string',
            'opening_cash' => 'required|numeric'
        ]);

        $branchId = $request->branch_id ?: 1;
        $userId   = $request->user_id;

        // Check if there is already an open shift for this user and branch
        $active = Shift::where('branch_id', $branchId)
            ->where('user_id', $userId)
            ->where('status', 'open')
            ->first();

        if ($active) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Anda sudah memiliki shift yang aktif.'
            ], 400);
        }

        $shift = Shift::create([
            'branch_id'    => $branchId,
            'user_id'      => $userId,
            'shift_type'   => $request->shift_type,
            'opening_cash' => $request->opening_cash,
            'status'       => 'open',
            'opened_at'    => now(),
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Shift berhasil dimulai',
            'data'    => $shift
        ]);
    }

    public function end(Request $request, $id)
    {
        $request->validate([
            'closing_cash' => 'required|numeric'
        ]);

        $shift = Shift::findOrFail($id);

        if ($shift->status !== 'open') {
            return response()->json([
                'status' => 'error',
                'message' => 'Shift ini sudah ditutup.'
            ], 400);
        }

        $expectedCash = $request->input('expected_cash', $shift->opening_cash); 
        $closingCash = $request->closing_cash;
        $difference = $closingCash - $expectedCash;

        $shift->update([
            'closing_cash' => $closingCash,
            'expected_cash' => $expectedCash,
            'cash_difference' => $difference,
            'status' => 'closed',
            'closed_at' => now(),
            'notes' => $request->notes
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Shift berhasil diakhiri',
            'data' => $shift
        ]);
    }
}
