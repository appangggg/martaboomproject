<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ingredients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('sku', 30)->nullable()->unique();
            $table->string('unit', 20);
            $table->decimal('cost_per_unit', 15, 2);
            $table->string('supplier_name')->nullable();
            $table->decimal('min_stock_threshold', 15, 2)->default(0);
            $table->enum('category', ['bahan_kering', 'bahan_basah', 'topping', 'kemasan', 'lainnya'])->default('lainnya');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('ingredient_stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ingredient_id')->constrained('ingredients')->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained('branches')->cascadeOnDelete();
            $table->decimal('current_stock', 15, 2)->default(0);
            $table->dateTime('last_restock_at')->nullable();
            $table->decimal('last_restock_qty', 15, 2)->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->unique(['ingredient_id', 'branch_id']);
        });

        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->string('name');
            $table->enum('type', ['product', 'sub_recipe'])->default('product');
            $table->decimal('yield_quantity', 10, 2)->default(1);
            $table->string('yield_unit', 30)->default('porsi');
            $table->decimal('hpp_per_unit', 15, 2)->default(0);
            $table->decimal('selling_price', 15, 2)->default(0);
            $table->decimal('margin_percentage', 5, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('recipe_ingredients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recipe_id')->constrained('recipes')->cascadeOnDelete();
            $table->foreignId('ingredient_id')->nullable()->constrained('ingredients')->nullOnDelete();
            $table->foreignId('sub_recipe_id')->nullable()->constrained('recipes')->nullOnDelete();
            $table->decimal('quantity', 15, 4);
            $table->string('unit', 20);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recipe_ingredients');
        Schema::dropIfExists('recipes');
        Schema::dropIfExists('ingredient_stocks');
        Schema::dropIfExists('ingredients');
    }
};
