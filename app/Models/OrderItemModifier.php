<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItemModifier extends Model
{
    public $timestamps = false;
    protected $fillable = ['order_item_id', 'modifier_id', 'modifier_name', 'price_addition'];
    protected $casts = ['price_addition' => 'decimal:2'];

    public function orderItem(): BelongsTo { return $this->belongsTo(OrderItem::class); }
    public function modifier(): BelongsTo { return $this->belongsTo(Modifier::class); }
}
