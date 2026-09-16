<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\TransactionController;
use App\Http\Controllers\API\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// POS Endpoints
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/list', [ProductController::class, 'getProducts']);
Route::post('/transactions', [TransactionController::class, 'store']);
Route::get('/transactions/pending', [TransactionController::class, 'pending']);
Route::get('/kitchen/recipes', [\App\Http\Controllers\API\KitchenController::class, 'recipes']);
Route::get('/kitchen/inventory', [\App\Http\Controllers\API\KitchenController::class, 'inventory']);

// Admin Dashboard Endpoints
Route::get('/admin/dashboard', [DashboardController::class, 'getStats']);
Route::apiResource('/admin/branches', \App\Http\Controllers\BranchController::class);
Route::apiResource('/admin/products', \App\Http\Controllers\AdminProductController::class);
Route::apiResource('/admin/employees', \App\Http\Controllers\EmployeeController::class);
Route::get('/admin/transactions', [\App\Http\Controllers\AdminTransactionController::class, 'index']);
Route::get('/admin/transactions/{id}', [\App\Http\Controllers\AdminTransactionController::class, 'show']);

// New API Endpoints
Route::prefix('shift')->group(function() {
    Route::get('/current', [\App\Http\Controllers\API\ShiftController::class, 'current']);
    Route::post('/start', [\App\Http\Controllers\API\ShiftController::class, 'start']);
    Route::post('/{id}/end', [\App\Http\Controllers\API\ShiftController::class, 'end']);
});

Route::apiResource('petty-cash', \App\Http\Controllers\API\PettyCashController::class)->except(['update', 'show']);
Route::put('petty-cash/{id}/approve', [\App\Http\Controllers\API\PettyCashController::class, 'approve']);

Route::apiResource('production-logs', \App\Http\Controllers\API\ProductionLogController::class)->only(['index', 'store']);
Route::apiResource('waste-logs', \App\Http\Controllers\API\WasteLogController::class)->only(['index', 'store']);

Route::apiResource('stock-opnames', \App\Http\Controllers\API\StockOpnameController::class)->only(['index', 'store']);
Route::apiResource('payrolls', \App\Http\Controllers\API\PayrollController::class)->only(['index', 'store']);
Route::apiResource('attendances', \App\Http\Controllers\API\AttendanceController::class)->only(['index', 'store']);

Route::get('discrepancy-alerts', [\App\Http\Controllers\API\DiscrepancyAlertController::class, 'index']);
Route::put('discrepancy-alerts/{id}/resolve', [\App\Http\Controllers\API\DiscrepancyAlertController::class, 'resolve']);

Route::get('settings', [\App\Http\Controllers\API\SettingController::class, 'index']);
Route::post('settings', [\App\Http\Controllers\API\SettingController::class, 'update']);
