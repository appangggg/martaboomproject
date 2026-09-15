<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockOpnameItem extends Model
{
    public $timestamps = false;
    protected $fillable = ['stock_opname_id', 'ingredient_id', 'system_stock', 'actual_stock', 'difference', 'difference_cost', 'notes'];
    protected $casts = ['system_stock' => 'decimal:2', 'actual_stock' => 'decimal:2', 'difference' => 'decimal:2', 'difference_cost' => 'decimal:2'];

    public function stockOpname(): BelongsTo { return $this->belongsTo(StockOpname::class); }
    public function ingredient(): BelongsTo { return $this->belongsTo(Ingredient::class); }
}
