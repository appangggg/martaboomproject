<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Branch extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'name', 'address', 'phone',
        'is_active', 'timezone', 'settings',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'settings' => 'array',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function shifts(): HasMany
    {
        return $this->hasMany(Shift::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_branch')
            ->withPivot('price_override', 'is_available');
    }

    public function ingredientStocks(): HasMany
    {
        return $this->hasMany(IngredientStock::class);
    }

    public function pettyCashEntries(): HasMany
    {
        return $this->hasMany(PettyCashEntry::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function posSettings(): HasOne
    {
        return $this->hasOne(PosSetting::class);
    }

    public function discrepancyAlerts(): HasMany
    {
        return $this->hasMany(DiscrepancyAlert::class);
    }
}
