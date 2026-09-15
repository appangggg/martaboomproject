<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;
    protected $fillable = [
        'branch_id', 'shift_id', 'user_id', 'order_number', 'queue_number',
        'customer_name', 'subtotal', 'discount_amount', 'discount_type',
        'tax_amount', 'total', 'status', 'held_at', 'held_reason',
        'completed_at', 'voided_at', 'voided_by', 'void_reason', 'notes',
    ];
    protected $casts = [
        'subtotal' => 'decimal:2', 'discount_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2', 'total' => 'decimal:2',
        'held_at' => 'datetime', 'completed_at' => 'datetime', 'voided_at' => 'datetime',
    ];

    public function branch(): BelongsTo { return $this->belongsTo(Branch::class); }
    public function shift(): BelongsTo { return $this->belongsTo(Shift::class); }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function voidedByUser(): BelongsTo { return $this->belongsTo(User::class, 'voided_by'); }
    public function items(): HasMany { return $this->hasMany(OrderItem::class); }
    public function payments(): HasMany { return $this->hasMany(Payment::class); }
}
