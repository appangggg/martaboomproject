<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Attendance::with(['user', 'shift']);

        if ($request->has('branch_id')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('branch_id', $request->branch_id);
            });
        }

        // Get today's attendance
        $query->whereDate('created_at', Carbon::today());

        return response()->json([
            'status' => 'success',
            'data' => $query->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'shift_id' => 'required|exists:shifts,id',
            'type' => 'required|in:clock_in,clock_out,break_start,break_end',
        ]);

        $attendance = Attendance::create([
            'user_id' => $request->user_id,
            'shift_id' => $request->shift_id,
            $request->type === 'clock_in' ? 'clock_in_time' : ($request->type === 'clock_out' ? 'clock_out_time' : 'notes') => Carbon::now(),
            'notes' => $request->type
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Attendance logged successfully',
            'data' => $attendance
        ], 201);
    }
}
