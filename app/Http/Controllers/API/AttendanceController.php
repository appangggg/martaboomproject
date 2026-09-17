<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Shift;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
            'data'   => $query->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id'  => 'required|exists:users,id',
            'pin'      => 'required|string',
            'type'     => 'required|in:clock_in,clock_out,break_start,break_end',
            'shift_id' => 'nullable|exists:shifts,id',
        ]);

        // 1. Verifikasi PIN
        $user = User::findOrFail($request->user_id);
        $pinValid = ($user->pin === $request->pin)
            || (strlen((string)$user->pin) > 6 && Hash::check($request->pin, $user->pin));

        if (!$pinValid) {
            return response()->json([
                'status'  => 'error',
                'message' => 'PIN salah. Silakan coba lagi.',
            ], 401);
        }

        // 2. Tentukan shift_id — ambil dari request atau cari shift aktif
        $shiftId = $request->shift_id;
        if (!$shiftId) {
            $activeShift = Shift::where('user_id', $request->user_id)
                ->where('status', 'open')
                ->first();
            $shiftId = $activeShift?->id;
        }

        if (!$shiftId) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Tidak ada shift aktif. Buka shift terlebih dahulu.',
            ], 422);
        }

        // 3. Simpan attendance
        $data = [
            'user_id'  => $request->user_id,
            'shift_id' => $shiftId,
            'notes'    => $request->type,
        ];

        if ($request->type === 'clock_in') {
            $data['clock_in_time'] = Carbon::now();
        } elseif ($request->type === 'clock_out') {
            $data['clock_out_time'] = Carbon::now();
        }

        $attendance = Attendance::create($data);

        return response()->json([
            'status'  => 'success',
            'message' => 'Absensi berhasil dicatat',
            'data'    => $attendance->load(['user', 'shift']),
        ], 201);
    }
}
