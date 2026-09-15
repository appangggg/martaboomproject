<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ingredient extends Model
{
    use HasFactory;
    protected $fillable = [
        'name', 'sku', 'unit', 'cost_per_unit', 'supplier_name',
        'min_stock_threshold', 'category', 'is_active',
    ];
    protected $casts = ['is_active' => 'boolean', 'cost_per_unit' => 'decimal:2', 'min_stock_threshold' => 'decimal:2'];

    public function stocks(): HasMany { return $this->hasMany(IngredientStock::class); }
    public function recipeIngredients(): HasMany { return $this->hasMany(RecipeIngredient::class); }
    public function wasteLogs(): HasMany { return $this->hasMany(WasteLog::class); }
}
