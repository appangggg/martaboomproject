<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ModifierGroup extends Model
{
    use HasFactory;
    protected $fillable = ['product_id', 'name', 'selection_type', 'is_required', 'min_select', 'max_select', 'sort_order'];
    protected $casts = ['is_required' => 'boolean'];

    public function product(): BelongsTo { return $this->belongsTo(Product::class); }
    public function modifiers(): HasMany { return $this->hasMany(Modifier::class)->orderBy('sort_order'); }
}
