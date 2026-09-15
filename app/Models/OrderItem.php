<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id', 'product_id', 'product_name', 'quantity',
        'unit_price', 'modifier_total', 'subtotal', 'notes',
        'kot_printed', 'kot_station',
    ];
    protected $casts = [
        'unit_price' => 'decimal:2', 'modifier_total' => 'decimal:2',
        'subtotal' => 'decimal:2', 'kot_printed' => 'boolean',
    ];

    public function order(): BelongsTo { return $this->belongsTo(Order::class); }
    public function product(): BelongsTo { return $this->belongsTo(Product::class); }
    public function modifiers(): HasMany { return $this->hasMany(OrderItemModifier::class); }
}
