<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\StockOpname;
use App\Models\WasteLog;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get statistics for the Admin Dashboard.
     */
    public function getStats(Request $request)
    {
        $today = Carbon::today();
        $yesterday = Carbon::yesterday();
        $branchId = $request->get('branch_id');

        $query = Order::where('status', 'paid');
        if ($branchId) {
            $query->where('branch_id', $branchId);
        }

        // Today's Sales
        $todaySales = (clone $query)->whereDate('created_at', $today)->sum('total');
        // Yesterday's Sales
        $yesterdaySales = (clone $query)->whereDate('created_at', $yesterday)->sum('total');
        
        // Sales Trend
        $salesTrend = 0;
        if ($yesterdaySales > 0) {
            $salesTrend = (($todaySales - $yesterdaySales) / $yesterdaySales) * 100;
        }

        // Transactions count
        $todayTransactions = (clone $query)->whereDate('created_at', $today)->count();
        $yesterdayTransactions = (clone $query)->whereDate('created_at', $yesterday)->count();

        // Transaction Trend
        $transactionTrend = 0;
        if ($yesterdayTransactions > 0) {
            $transactionTrend = (($todayTransactions - $yesterdayTransactions) / $yesterdayTransactions) * 100;
        }

        // Waste Value
        $wasteQuery = WasteLog::query();
        if ($branchId) {
            $wasteQuery->where('branch_id', $branchId);
        }
        $todayWaste = (clone $wasteQuery)->whereDate('created_at', $today)->sum('cost_value');

        // Recent Orders
        $recentOrders = (clone $query)
            ->with(['branch', 'user'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'sales' => [
                    'today' => $todaySales,
                    'trend' => round($salesTrend, 1),
                ],
                'transactions' => [
                    'today' => $todayTransactions,
                    'trend' => round($transactionTrend, 1),
                ],
                'waste' => [
                    'today' => $todayWaste,
                ],
                'recent_orders' => $recentOrders,
            ]
        ]);
    }
}
