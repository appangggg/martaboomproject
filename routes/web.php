<?php

use Illuminate\Support\Facades\Route;

// Subdomain routing (untuk server production / Laragon dengan wildcard subdomain)
$domain = env('APP_DOMAIN', 'terbul.test');

Route::domain('kasir.' . $domain)->group(function () {
    Route::get('{any?}', function () {
        return view('kasir');
    })->where('any', '.*');
});

Route::domain('admin.' . $domain)->group(function () {
    Route::get('{any?}', function () {
        return view('admin');
    })->where('any', '.*');
});

// Path routing (Untuk mempermudah testing di localhost:8000)
Route::prefix('kasir')->group(function () {
    Route::get('{any?}', function () {
        return view('kasir');
    })->where('any', '.*');
});

Route::prefix('admin')->group(function () {
    Route::get('{any?}', function () {
        return view('admin');
    })->where('any', '.*');
});

Route::get('/', function () {
    return view('kasir');
});
