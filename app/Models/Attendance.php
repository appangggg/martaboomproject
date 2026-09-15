<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    protected $fillable = [
        'user_id', 'branch_id', 'clock_in', 'clock_out',
        'clock_in_photo', 'clock_out_photo', 'clock_in_method', 'status', 'notes',
    ];
    protected $casts = ['clock_in' => 'datetime', 'clock_out' => 'datetime'];

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function branch(): BelongsTo { return $this->belongsTo(Branch::class); }
}
