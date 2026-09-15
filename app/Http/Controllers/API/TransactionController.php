<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemModifier;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TransactionController extends Controller
{
    /**
     * Process a checkout/transaction from POS.
     */
    public function store(Request $request)
    {
        $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'user_id' => 'required|exists:users,id',
            'shift_id' => 'nullable|exists:shifts,id',
            'customer_name' => 'nullable|string',
            'subtotal' => 'required|numeric',
            'tax_amount' => 'required|numeric',
            'discount_amount' => 'required|numeric',
            'total' => 'required|numeric',
            'payment_method' => 'required|string',
            'payment_amount' => 'required|numeric',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric',
            'items.*.subtotal' => 'required|numeric',
        ]);

        try {
            DB::beginTransaction();

            // Generate order number
            $orderNumber = 'ORD-' . strtoupper(Str::random(8));
            $queueNumber = Order::whereDate('created_at', today())->count() + 1;

            // 1. Create Order
            $order = Order::create([
                'branch_id' => $request->branch_id,
                'user_id' => $request->user_id,
                'shift_id' => $request->shift_id,
                'order_number' => $orderNumber,
                'queue_number' => str_pad($queueNumber, 3, '0', STR_PAD_LEFT),
                'customer_name' => $request->customer_name ?? 'Guest',
                'subtotal' => $request->subtotal,
                'discount_amount' => $request->discount_amount,
                'discount_type' => $request->discount_amount > 0 ? 'manual' : null,
                'tax_amount' => $request->tax_amount,
                'total' => $request->total,
                'status' => 'paid',
                'completed_at' => now(),
                'notes' => $request->notes,
            ]);

            // 2. Create Items
            foreach ($request->items as $itemData) {
                $orderItem = OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $itemData['product_id'],
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $itemData['unit_price'],
                    'subtotal' => $itemData['subtotal'],
                    'notes' => $itemData['notes'] ?? null,
                ]);

                // 3. Create Modifiers if any
                if (!empty($itemData['modifiers'])) {
                    foreach ($itemData['modifiers'] as $modData) {
                        OrderItemModifier::create([
                            'order_item_id' => $orderItem->id,
                            'modifier_id' => $modData['modifier_id'],
                            'price' => $modData['price'],
                            'quantity' => $modData['quantity'] ?? 1,
                        ]);
                    }
                }
            }

            // 4. Create Payment
            Payment::create([
                'order_id' => $order->id,
                'method' => $request->payment_method,
                'amount' => $request->payment_amount,
                'change_amount' => max(0, $request->payment_amount - $request->total),
                'reference_number' => $request->payment_reference ?? null,
                'status' => 'completed',
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Transaction completed successfully',
                'data' => [
                    'order_number' => $order->order_number,
                    'queue_number' => $order->queue_number,
                    'total' => $order->total,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Transaction failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
