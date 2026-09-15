<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'category_id', 'name', 'sku', 'description', 'base_price',
        'image_url', 'is_active', 'sort_order', 'kitchen_station',
    ];
    protected $casts = ['is_active' => 'boolean', 'base_price' => 'decimal:2'];

    public function category(): BelongsTo { return $this->belongsTo(Category::class); }
    public function branches(): BelongsToMany {
        return $this->belongsToMany(Branch::class, 'product_branch')->withPivot('price_override', 'is_available');
    }
    public function modifierGroups(): HasMany { return $this->hasMany(ModifierGroup::class); }
    public function recipe(): HasOne { return $this->hasOne(Recipe::class); }
}
