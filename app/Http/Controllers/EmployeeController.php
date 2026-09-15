<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::with('branch')->orderBy('name');
        
        if ($request->has('branch_id') && $request->branch_id != '') {
            $query->where('branch_id', $request->branch_id);
        }
        
        if ($request->has('role') && $request->role != '') {
            $query->where('role', $request->role);
        }
        
        if ($request->has('search') && $request->search != '') {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('employee_id', 'like', '%' . $request->search . '%');
        }

        $employees = $query->paginate(20);

        return response()->json([
            'status' => 'success',
            'data' => $employees
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string',
            'branch_id' => 'nullable|exists:branches,id',
            'phone' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $validated['password'] = Hash::make($validated['password']);
        
        // Generate a random employee ID if not provided
        if (!isset($validated['employee_id'])) {
            $validated['employee_id'] = 'EMP-' . strtoupper(substr(uniqid(), -6));
        }

        $employee = User::create($validated);

        return response()->json([
            'status' => 'success',
            'data' => $employee
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $employee = User::with('branch')->findOrFail($id);
        return response()->json([
            'status' => 'success',
            'data' => $employee
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $employee = User::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'string|max:255',
            'email' => 'string|email|max:255|unique:users,email,'.$id,
            'role' => 'string',
            'branch_id' => 'nullable|exists:branches,id',
            'phone' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        if ($request->filled('password')) {
            $validated['password'] = Hash::make($request->password);
        }

        $employee->update($validated);

        return response()->json([
            'status' => 'success',
            'data' => $employee
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $employee = User::findOrFail($id);
        $employee->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Employee deleted successfully'
        ]);
    }
}
