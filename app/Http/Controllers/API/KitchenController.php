<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class KitchenController extends Controller
{
    public function recipes()
    {
        $recipes = [
            'tb-manis' => [
                'id' => 'tb-manis',
                'title' => 'Adonan Terang Bulan Manis',
                'unit' => 'Ember',
                'litersPerBatch' => 10,
                'yieldMultiplierMin' => 22,
                'yieldMultiplierMax' => 24,
                'yieldText' => 'loyang Terang Bulan Spesial',
                'ingredients' => [
                    'tepung' => ['amount' => 5.0, 'unit' => 'kg', 'name' => 'Tepung Terigu Cakra Kembar', 'stockLeft' => 52.0],
                    'gula' => ['amount' => 1.8, 'unit' => 'kg', 'name' => 'Gula Pasir Kristal Murni', 'stockLeft' => 21.6],
                    'telurCount' => 12,
                    'telurKg' => 0.7,
                    'telurName' => 'Telur Ayam Negeri Segar',
                    'telurStock' => 9.9,
                    'butter' => ['amount' => 0.6, 'unit' => 'kg', 'name' => 'Wijsman Butter & Margarin', 'stockLeft' => 7.2],
                    'ragi' => ['amount' => 90, 'unit' => 'gram', 'name' => 'Ragi Instan & Double Acting BP'],
                    'air' => ['amount' => 4.0, 'unit' => 'Liter', 'name' => 'Air Mineral RO Terfilter']
                ]
            ],
            'martabak-telur' => [
                'id' => 'martabak-telur',
                'title' => 'Adonan Martabak Telur Renyah',
                'unit' => 'Batch Kulit',
                'litersPerBatch' => 5,
                'yieldMultiplierMin' => 50,
                'yieldMultiplierMax' => 50,
                'yieldText' => 'bola adonan kulit renyah elastis',
                'ingredients' => [
                    'tepung' => ['amount' => 4.5, 'unit' => 'kg', 'name' => 'Tepung Terigu Segitiga Biru', 'stockLeft' => 38.0],
                    'gula' => ['amount' => 0.2, 'unit' => 'kg', 'name' => 'Gula Pasir Murni', 'stockLeft' => 20.0],
                    'telurCount' => 8,
                    'telurKg' => 0.5,
                    'telurName' => 'Telur Ayam Negeri Segar',
                    'telurStock' => 9.9,
                    'butter' => ['amount' => 1.2, 'unit' => 'kg', 'name' => 'Minyak Goreng & Minyak Samin', 'stockLeft' => 12.0],
                    'ragi' => ['amount' => 40, 'unit' => 'gram', 'name' => 'Garam Dapur & Penyedap'],
                    'air' => ['amount' => 2.2, 'unit' => 'Liter', 'name' => 'Air Mineral Hangat']
                ]
            ]
        ];

        return response()->json([
            'status' => 'success',
            'data' => $recipes
        ]);
    }
}
