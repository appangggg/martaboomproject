<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductionLog extends Model
{
    protected $fillable = [
        'branch_id', 'recipe_id', 'user_id', 'batch_quantity',
        'actual_yield', 'expected_yield', 'produced_at', 'notes',
    ];
    protected $casts = [
        'batch_quantity' => 'decimal:2', 'actual_yield' => 'decimal:2',
        'expected_yield' => 'decimal:2', 'produced_at' => 'datetime',
    ];

    public function branch(): BelongsTo { return $this->belongsTo(Branch::class); }
    public function recipe(): BelongsTo { return $this->belongsTo(Recipe::class); }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
}
