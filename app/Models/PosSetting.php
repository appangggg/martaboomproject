<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PosSetting extends Model
{
    protected $fillable = [
        'branch_id', 'store_name', 'receipt_header', 'receipt_footer',
        'printer_type', 'printer_address', 'kot_printer_address',
        'paper_size', 'auto_print_receipt', 'auto_print_kot', 'tax_rate',
    ];
    protected $casts = ['auto_print_receipt' => 'boolean', 'auto_print_kot' => 'boolean', 'tax_rate' => 'decimal:2'];

    public function branch(): BelongsTo { return $this->belongsTo(Branch::class); }
}
