<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Modifier extends Model
{
    use HasFactory;
    protected $fillable = ['modifier_group_id', 'name', 'price_addition', 'is_default', 'sort_order'];
    protected $casts = ['is_default' => 'boolean', 'price_addition' => 'decimal:2'];

    public function modifierGroup(): BelongsTo { return $this->belongsTo(ModifierGroup::class); }
}
