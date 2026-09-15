<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PettyCashEntry extends Model
{
    protected $fillable = [
        'branch_id', 'shift_id', 'user_id', 'type', 'category',
        'amount', 'description', 'receipt_photo', 'approved_by', 'approved_at',
    ];
    protected $casts = ['amount' => 'decimal:2', 'approved_at' => 'datetime'];

    public function branch(): BelongsTo { return $this->belongsTo(Branch::class); }
    public function shift(): BelongsTo { return $this->belongsTo(Shift::class); }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function approvedByUser(): BelongsTo { return $this->belongsTo(User::class, 'approved_by'); }
}
