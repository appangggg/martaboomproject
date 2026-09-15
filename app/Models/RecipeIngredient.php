<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecipeIngredient extends Model
{
    public $timestamps = false;
    protected $fillable = ['recipe_id', 'ingredient_id', 'sub_recipe_id', 'quantity', 'unit'];
    protected $casts = ['quantity' => 'decimal:4'];

    public function recipe(): BelongsTo { return $this->belongsTo(Recipe::class); }
    public function ingredient(): BelongsTo { return $this->belongsTo(Ingredient::class); }
    public function subRecipe(): BelongsTo { return $this->belongsTo(Recipe::class, 'sub_recipe_id'); }
}
