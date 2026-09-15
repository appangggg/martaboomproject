<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('petty_cash_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained('branches')->cascadeOnDelete();
            $table->foreignId('shift_id')->nullable()->constrained('shifts')->nullOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('type', ['expense', 'income'])->default('expense');
            $table->enum('category', ['operasional', 'bahan_baku', 'kebersihan', 'transport', 'maintenance', 'lainnya'])->default('lainnya');
            $table->decimal('amount', 15, 2);
            $table->text('description');
            $table->string('receipt_photo')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('approved_at')->nullable();
            $table->timestamps();
        });

        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained('branches')->cascadeOnDelete();
            $table->dateTime('clock_in');
            $table->dateTime('clock_out')->nullable();
            $table->string('clock_in_photo')->nullable();
            $table->string('clock_out_photo')->nullable();
            $table->enum('clock_in_method', ['pin', 'selfie'])->default('pin');
            $table->enum('status', ['present', 'late', 'absent', 'leave'])->default('present');
            $table->string('notes')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'clock_in']);
            $table->index(['branch_id', 'clock_in']);
        });

        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained('branches')->cascadeOnDelete();
            $table->date('period_start');
            $table->date('period_end');
            $table->decimal('base_salary', 15, 2);
            $table->decimal('total_commission', 15, 2)->default(0);
            $table->decimal('deductions', 15, 2)->default(0);
            $table->decimal('bonus', 15, 2)->default(0);
            $table->decimal('net_salary', 15, 2);
            $table->enum('status', ['draft', 'approved', 'paid'])->default('draft');
            $table->dateTime('paid_at')->nullable();
            $table->timestamps();
        });

        Schema::create('discrepancy_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained('branches')->cascadeOnDelete();
            $table->enum('type', ['cash_variance', 'stock_variance', 'void_anomaly', 'discount_anomaly']);
            $table->enum('severity', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->string('title');
            $table->text('description');
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->string('reference_type')->nullable();
            $table->boolean('is_resolved')->default(false);
            $table->foreignId('resolved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('resolved_at')->nullable();
            $table->text('resolution_notes')->nullable();
            $table->timestamps();
        });

        Schema::create('pos_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->unique()->constrained('branches')->cascadeOnDelete();
            $table->string('store_name');
            $table->text('receipt_header')->nullable();
            $table->text('receipt_footer')->nullable();
            $table->enum('printer_type', ['bluetooth', 'usb', 'network'])->default('bluetooth');
            $table->string('printer_address')->nullable();
            $table->string('kot_printer_address')->nullable();
            $table->enum('paper_size', ['58mm', '80mm'])->default('80mm');
            $table->boolean('auto_print_receipt')->default(true);
            $table->boolean('auto_print_kot')->default(true);
            $table->decimal('tax_rate', 5, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pos_settings');
        Schema::dropIfExists('discrepancy_alerts');
        Schema::dropIfExists('payrolls');
        Schema::dropIfExists('attendances');
        Schema::dropIfExists('petty_cash_entries');
    }
};
