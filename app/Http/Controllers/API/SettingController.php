<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\PosSetting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index(Request $request)
    {
        $branchId = $request->query('branch_id', 1);
        $settings = PosSetting::where('branch_id', $branchId)->get();
        return response()->json([
            'status' => 'success',
            'data' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'settings' => 'required|array'
        ]);

        foreach ($request->settings as $key => $value) {
            PosSetting::updateOrCreate(
                ['branch_id' => $request->branch_id, 'setting_key' => $key],
                ['setting_value' => is_array($value) ? json_encode($value) : $value]
            );
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Pengaturan berhasil diperbarui'
        ]);
    }
}
