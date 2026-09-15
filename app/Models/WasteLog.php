<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WasteLog extends Model
{
    protected $fillable = [
        'branch_id', 'ingredient_id', 'user_id', 'quantity', 'unit',
        'reason', 'description', 'estimated_cost', 'logged_at',
    ];
    protected $casts = ['quantity' => 'decimal:2', 'estimated_cost' => 'decimal:2', 'logged_at' => 'datetime'];

    public function branch(): BelongsTo { return $this->belongsTo(Branch::class); }
    public function ingredient(): BelongsTo { return $this->belongsTo(Ingredient::class); }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
}
