<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IngredientStock extends Model
{
    public $timestamps = false;
    protected $fillable = ['ingredient_id', 'branch_id', 'current_stock', 'last_restock_at', 'last_restock_qty', 'updated_at'];
    protected $casts = ['current_stock' => 'decimal:2', 'last_restock_at' => 'datetime', 'last_restock_qty' => 'decimal:2', 'updated_at' => 'datetime'];
    protected $dates = ['updated_at'];

    public function ingredient(): BelongsTo { return $this->belongsTo(Ingredient::class); }
    public function branch(): BelongsTo { return $this->belongsTo(Branch::class); }
}
