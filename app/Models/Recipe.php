<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Recipe extends Model
{
    use HasFactory;
    protected $fillable = [
        'product_id', 'name', 'type', 'yield_quantity', 'yield_unit',
        'hpp_per_unit', 'selling_price', 'margin_percentage', 'is_active',
    ];
    protected $casts = [
        'is_active' => 'boolean', 'yield_quantity' => 'decimal:2',
        'hpp_per_unit' => 'decimal:2', 'selling_price' => 'decimal:2', 'margin_percentage' => 'decimal:2',
    ];

    public function product(): BelongsTo { return $this->belongsTo(Product::class); }
    public function recipeIngredients(): HasMany { return $this->hasMany(RecipeIngredient::class); }
    public function productionLogs(): HasMany { return $this->hasMany(ProductionLog::class); }

    public function recalculateHpp(): void
    {
        $totalCost = 0;
        foreach ($this->recipeIngredients as $ri) {
            if ($ri->ingredient_id) {
                $totalCost += $ri->ingredient->cost_per_unit * $ri->quantity;
            } elseif ($ri->sub_recipe_id) {
                $totalCost += $ri->subRecipe->hpp_per_unit * $ri->quantity;
            }
        }
        $this->hpp_per_unit = $this->yield_quantity > 0 ? $totalCost / $this->yield_quantity : 0;
        if ($this->selling_price > 0) {
            $this->margin_percentage = (($this->selling_price - $this->hpp_per_unit) / $this->selling_price) * 100;
        }
        $this->save();
    }
}
