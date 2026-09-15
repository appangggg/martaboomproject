<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payroll extends Model
{
    protected $fillable = [
        'user_id', 'branch_id', 'period_start', 'period_end',
        'base_salary', 'total_commission', 'deductions', 'bonus',
        'net_salary', 'status', 'paid_at',
    ];
    protected $casts = [
        'period_start' => 'date', 'period_end' => 'date', 'paid_at' => 'datetime',
        'base_salary' => 'decimal:2', 'total_commission' => 'decimal:2',
        'deductions' => 'decimal:2', 'bonus' => 'decimal:2', 'net_salary' => 'decimal:2',
    ];

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function branch(): BelongsTo { return $this->belongsTo(Branch::class); }
}
