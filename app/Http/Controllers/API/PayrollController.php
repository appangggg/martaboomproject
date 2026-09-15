<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Payroll;
use Illuminate\Http\Request;

class PayrollController extends Controller
{
    public function index(Request $request)
    {
        $query = Payroll::with(['user', 'branch']);

        return response()->json([
            'status' => 'success',
            'data' => $query->orderBy('period_end', 'desc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'branch_id' => 'required|exists:branches,id',
            'period_start' => 'required|date',
            'period_end' => 'required|date',
            'base_salary' => 'required|numeric',
            'commission' => 'required|numeric',
            'deductions' => 'required|numeric',
            'net_salary' => 'required|numeric',
            'status' => 'required|string',
        ]);

        $payroll = Payroll::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Data penggajian berhasil disimpan',
            'data' => $payroll
        ], 201);
    }
}
