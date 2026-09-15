<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DiscrepancyAlert extends Model
{
    protected $fillable = [
        'branch_id', 'type', 'severity', 'title', 'description',
        'reference_id', 'reference_type', 'is_resolved',
        'resolved_by', 'resolved_at', 'resolution_notes',
    ];
    protected $casts = ['is_resolved' => 'boolean', 'resolved_at' => 'datetime'];

    public function branch(): BelongsTo { return $this->belongsTo(Branch::class); }
    public function resolvedByUser(): BelongsTo { return $this->belongsTo(User::class, 'resolved_by'); }
}
