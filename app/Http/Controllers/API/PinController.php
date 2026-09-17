<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PinController extends Controller
{
    /**
     * Verify a user's PIN. Used by the POS login and attendance screens.
     * Returns {valid: true} if PIN matches, {valid: false} otherwise.
     * PIN is never exposed in the response.
     */
    public function verify(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'pin'     => 'required|string|min:4|max:6',
        ]);

        $user = User::findOrFail($request->user_id);

        // PIN is stored as plain text or hashed (support both)
        $valid = ($user->pin === $request->pin)
            || (strlen($user->pin) > 6 && Hash::check($request->pin, $user->pin));

        return response()->json([
            'status' => 'success',
            'valid'  => $valid,
            'user'   => $valid ? [
                'id'         => $user->id,
                'name'       => $user->name,
                'role'       => $user->role,
                'employee_id'=> $user->employee_id,
                'branch_id'  => $user->branch_id,
            ] : null,
        ]);
    }

    /**
     * Set / reset a user's PIN. Called from the admin panel.
     */
    public function resetPin(Request $request, $id)
    {
        $request->validate([
            'pin' => 'required|string|size:6|regex:/^\d{6}$/',
        ]);

        $user = User::findOrFail($id);
        $user->pin = $request->pin; // stored as plain text so POS can compare directly
        $user->save();

        return response()->json([
            'status'  => 'success',
            'message' => 'PIN berhasil diperbarui untuk ' . $user->name,
        ]);
    }

    /**
     * Clear / revoke a user's PIN.
     */
    public function clearPin($id)
    {
        $user = User::findOrFail($id);
        $user->pin = null;
        $user->save();

        return response()->json([
            'status'  => 'success',
            'message' => 'PIN berhasil dihapus untuk ' . $user->name,
        ]);
    }
}
