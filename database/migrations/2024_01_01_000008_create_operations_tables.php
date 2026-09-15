<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('production_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained('branches')->cascadeOnDelete();
            $table->foreignId('recipe_id')->constrained('recipes')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('batch_quantity', 10, 2);
            $table->decimal('actual_yield', 10, 2)->nullable();
            $table->decimal('expected_yield', 10, 2);
            $table->dateTime('produced_at');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('waste_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained('branches')->cascadeOnDelete();
            $table->foreignId('ingredient_id')->constrained('ingredients')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('quantity', 15, 2);
            $table->string('unit', 20);
            $table->enum('reason', ['expired', 'damaged', 'production_loss', 'spilled', 'other'])->default('other');
            $table->text('description')->nullable();
            $table->decimal('estimated_cost', 15, 2)->default(0);
            $table->dateTime('logged_at');
            $table->timestamps();
        });

        Schema::create('stock_opnames', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained('branches')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('status', ['in_progress', 'completed', 'approved'])->default('in_progress');
            $table->dateTime('started_at');
            $table->dateTime('completed_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('stock_opname_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_opname_id')->constrained('stock_opnames')->cascadeOnDelete();
            $table->foreignId('ingredient_id')->constrained('ingredients')->cascadeOnDelete();
            $table->decimal('system_stock', 15, 2);
            $table->decimal('actual_stock', 15, 2);
            $table->decimal('difference', 15, 2);
            $table->decimal('difference_cost', 15, 2)->default(0);
            $table->string('notes')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_opname_items');
        Schema::dropIfExists('stock_opnames');
        Schema::dropIfExists('waste_logs');
        Schema::dropIfExists('production_logs');
    }
};
