<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Branch;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Branches
        $branchTebet = Branch::create([
            'code' => 'TBT',
            'name' => 'Cabang Tebet Barat',
            'address' => 'Jl. Tebet Barat Dalam Raya No. 123',
            'phone' => '081234567890',
        ]);

        $branchKemang = Branch::create([
            'code' => 'KMG',
            'name' => 'Cabang Kemang',
            'address' => 'Jl. Kemang Raya No. 45',
            'phone' => '081234567891',
        ]);

        // 2. Create Owner
        User::create([
            'employee_id' => 'OWN-001',
            'name' => 'Pak Hendra (Owner)',
            'email' => 'owner@masterbul.com',
            'password' => Hash::make('password'),
            'role' => 'owner',
        ]);

        // 3. Create Kasir
        User::create([
            'employee_id' => 'KSR-001',
            'name' => 'Budi Santoso',
            'pin' => Hash::make('123456'), // Default PIN
            'role' => 'kasir',
            'branch_id' => $branchTebet->id,
            'base_salary' => 3000000,
        ]);

        User::create([
            'employee_id' => 'KSR-002',
            'name' => 'Siti Kasir',
            'pin' => Hash::make('654321'), // Default PIN
            'role' => 'kasir',
            'branch_id' => $branchKemang->id,
            'base_salary' => 3000000,
        ]);

        // 4. Create Categories
        Category::create([
            'name' => 'Terang Bulan',
            'icon' => 'cake',
            'sort_order' => 1,
        ]);

        Category::create([
            'name' => 'Martabak Telur',
            'icon' => 'lunch_dining',
            'sort_order' => 2,
        ]);

        Category::create([
            'name' => 'Minuman',
            'icon' => 'local_cafe',
            'sort_order' => 3,
        ]);
    }
}
