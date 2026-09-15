import React, { useState, useEffect } from 'react';
import PosHeader from '../components/layout/PosHeader';

const recipes = {
    'tb-manis': {
        title: 'Adonan Terang Bulan Manis',
        unit: 'Ember',
        litersPerBatch: 10,
        yieldRange: (batch) => `Menghasilkan ± ${batch * 22} - ${batch * 24} loyang Terang Bulan Spesial`,
        ingredients: {
            tepung: { amount: 5.0, unit: 'kg', name: 'Tepung Terigu Cakra Kembar', stockLeft: 52.0 },
            gula: { amount: 1.8, unit: 'kg', name: 'Gula Pasir Kristal Murni', stockLeft: 21.6 },
            telurCount: 12,
            telurKg: 0.7,
            telurName: 'Telur Ayam Negeri Segar',
            telurStock: 9.9,
            butter: { amount: 0.6, unit: 'kg', name: 'Wijsman Butter & Margarin', stockLeft: 7.2 },
            ragi: { amount: 90, unit: 'gram', name: 'Ragi Instan & Double Acting BP' },
            air: { amount: 4.0, unit: 'Liter', name: 'Air Mineral RO Terfilter' }
        }
    },
    'martabak-telur': {
        title: 'Adonan Martabak Telur Renyah',
        unit: 'Batch Kulit',
        litersPerBatch: 5,
        yieldRange: (batch) => `Menghasilkan ± ${batch * 50} bola adonan kulit renyah elastis`,
        ingredients: {
            tepung: { amount: 4.5, unit: 'kg', name: 'Tepung Terigu Segitiga Biru', stockLeft: 38.0 },
            gula: { amount: 0.2, unit: 'kg', name: 'Gula Pasir Murni', stockLeft: 20.0 },
            telurCount: 8,
            telurKg: 0.5,
            telurName: 'Telur Ayam Negeri Segar',
            telurStock: 9.9,
            butter: { amount: 1.2, unit: 'kg', name: 'Minyak Goreng & Minyak Samin', stockLeft: 12.0 },
            ragi: { amount: 40, unit: 'gram', name: 'Garam Dapur & Penyedap' },
            air: { amount: 2.2, unit: 'Liter', name: 'Air Mineral Hangat' }
        }
    },
    'pandan-suji': {
        title: 'Adonan Pandan Suji Asli',
        unit: 'Ember 5L',
        litersPerBatch: 5,
        yieldRange: (batch) => `Menghasilkan ± ${batch * 11} - ${batch * 12} loyang Pandan Terang Bulan`,
        ingredients: {
            tepung: { amount: 2.5, unit: 'kg', name: 'Tepung Terigu Protein Sedang', stockLeft: 30.0 },
            gula: { amount: 0.9, unit: 'kg', name: 'Gula Pasir Halus', stockLeft: 18.0 },
            telurCount: 6,
            telurKg: 0.35,
            telurName: 'Telur Ayam Negeri Segar',
            telurStock: 9.9,
            butter: { amount: 0.3, unit: 'kg', name: 'Mentega Wijsman Blend', stockLeft: 6.0 },
            ragi: { amount: 45, unit: 'gram', name: 'Ragi & Ekstrak Suji Hijau Asli' },
            air: { amount: 2.0, unit: 'Liter', name: 'Perasan Jus Daun Pandan Suji' }
        }
    },
    'red-velvet': {
        title: 'Adonan Red Velvet Gourmet',
        unit: 'Ember 5L',
        litersPerBatch: 5,
        yieldRange: (batch) => `Menghasilkan ± ${batch * 11} - ${batch * 12} loyang Red Velvet Gourmet`,
        ingredients: {
            tepung: { amount: 2.5, unit: 'kg', name: 'Tepung Terigu & Kakao Red', stockLeft: 28.0 },
            gula: { amount: 1.0, unit: 'kg', name: 'Gula Pasir & Vanilla Bean', stockLeft: 16.0 },
            telurCount: 6,
            telurKg: 0.35,
            telurName: 'Telur Ayam Negeri Segar',
            telurStock: 9.9,
            butter: { amount: 0.4, unit: 'kg', name: 'Pure French Butter Blend', stockLeft: 5.5 },
            ragi: { amount: 50, unit: 'gram', name: 'Red Velvet Beet Extract & Buttermilk' },
            air: { amount: 2.0, unit: 'Liter', name: 'Susu Cair Pasteurisasi' }
        }
    }
};

export default function KitchenProductionScreen() {
    const [activeRecipeKey, setActiveRecipeKey] = useState('tb-manis');
    const [currentBatch, setCurrentBatch] = useState(2);
    const [toastMessage, setToastMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [history, setHistory] = useState([]);

    const loadHistory = async () => {
        try {
            const response = await window.apiClient.get('/production-logs?branch_id=1');
            if (response.status === 'success') {
                setHistory(response.data);
            }
        } catch (error) {
            console.error('Error loading history:', error);
        }
    };

    React.useEffect(() => {
        loadHistory();
    }, []);

    const recipe = recipes[activeRecipeKey];
    const totalLiters = currentBatch * recipe.litersPerBatch;

    const adjustBatch = (delta) => {
        const next = currentBatch + delta;
        if (next >= 1 && next <= 10) {
            setCurrentBatch(next);
        }
    };

    const confirmBatchProduction = async () => {
        setIsProcessing(true);
        try {
            const response = await window.apiClient.post('/production-logs', {
                branch_id: 1, // Default branch
                recipe_id: 1, // Simulate recipe ID based on selected recipe
                user_id: 1, // Default user
                batch_quantity: currentBatch,
                actual_yield: currentBatch * 22,
                expected_yield: currentBatch * 24,
                notes: `Produced ${recipe.title}`
            });

            if (response.status === 'success') {
                setToastMessage(`Sukses mencatat ${currentBatch} ${recipe.unit} (${recipe.title}). Stok gudang otomatis dikurangi.`);
                setTimeout(() => setToastMessage(''), 3800);
                loadHistory();
            } else {
                alert(response.message);
            }
        } catch (error) {
            alert('Gagal mencatat produksi: ' + (error.response?.data?.message || 'Error jaringan.'));
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-background font-body-md text-on-surface antialiased min-h-screen select-none">
            <PosHeader />
            
            <main className="w-full pt-20 bg-background pb-10">
                <div className="flex flex-col w-full">
                    <div className="w-full max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
                        
                        {/* Top Status Bar & Context Header */}
                        <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-inner">
                                    <span className="material-symbols-outlined text-[32px]">blender</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-label-sm text-label-sm uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-extrabold">Stasiun Adonan</span>
                                        <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-bold">Shift Sore • 17:15 WIB</span>
                                    </div>
                                    <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-0.5">Produksi Sub-Resep Dapur (Batch Mixing)</h1>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2.5 rounded-2xl">
                                    <div className="w-3 h-3 rounded-full bg-tertiary animate-pulse"></div>
                                    <div className="flex flex-col text-left">
                                        <span className="font-label-sm text-label-sm text-on-surface-variant">Koki Penanggung Jawab</span>
                                        <span className="font-title-md text-title-md text-on-surface font-bold">Siti Aminah (Koki Utama)</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2.5 rounded-2xl">
                                    <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
                                    <span className="font-title-md text-title-md text-on-surface font-semibold">Mixer Standar 01</span>
                                </div>
                            </div>
                        </div>

                        {/* Main 2-Column POS Tablet Workstation Layout */}
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                            
                            {/* LEFT COLUMN: Formulir Batch Produksi (7 Cols on xl) */}
                            <div className="xl:col-span-7 flex flex-col gap-6">
                                
                                {/* 1. Master Sub-Resep Selection Grid */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-6 rounded-full bg-primary-container"></span>
                                            <h2 className="font-title-lg text-title-lg text-on-surface font-extrabold tracking-tight">1. Pilih Master Sub-Resep</h2>
                                        </div>
                                        <span className="font-label-md text-label-md text-on-surface-variant">4 Resep Tersedia</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        {/* Card 1: Terang Bulan */}
                                        <button onClick={() => setActiveRecipeKey('tb-manis')} className={`text-left p-4 rounded-2xl transition-all duration-150 relative flex flex-col justify-between min-h-[148px] shadow-sm ${activeRecipeKey === 'tb-manis' ? 'bg-surface-container-low translate-y-0.5' : 'bg-surface-container-lowest hover:bg-surface-container-low'}`} style={activeRecipeKey === 'tb-manis' ? { boxShadow: '0 0 0 3px #d98e3f' } : {}} type="button">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center shrink-0">
                                                    <span className="material-symbols-outlined text-on-secondary-fixed text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>cake</span>
                                                </div>
                                                <span className="font-label-sm text-label-sm bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full font-extrabold flex items-center gap-1 shadow-sm">
                                                    <span className="material-symbols-outlined text-[14px]">star</span> Paling Sering
                                                </span>
                                            </div>
                                            <div className="mt-3">
                                                <h3 className="font-title-md text-title-md text-on-surface font-extrabold leading-snug">Adonan Terang Bulan Manis</h3>
                                                <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">Ember Standar 10 Liter (Kental Gurih)</p>
                                            </div>
                                            <div className="mt-2 flex items-center justify-between font-label-sm text-label-sm">
                                                <span className={`${activeRecipeKey === 'tb-manis' ? 'text-primary' : 'text-on-surface-variant'} font-bold`}>Standard Yield: ~22-24 loyang</span>
                                                <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                                            </div>
                                        </button>

                                        {/* Card 2: Martabak Telur */}
                                        <button onClick={() => setActiveRecipeKey('martabak-telur')} className={`text-left p-4 rounded-2xl transition-all duration-150 relative flex flex-col justify-between min-h-[148px] shadow-sm ${activeRecipeKey === 'martabak-telur' ? 'bg-surface-container-low translate-y-0.5' : 'bg-surface-container-lowest hover:bg-surface-container-low'}`} style={activeRecipeKey === 'martabak-telur' ? { boxShadow: '0 0 0 3px #d98e3f' } : {}} type="button">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
                                                    <span className="material-symbols-outlined text-primary text-[28px]">lunch_dining</span>
                                                </div>
                                                <span className="font-label-sm text-label-sm bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full font-bold">Gurih Asin</span>
                                            </div>
                                            <div className="mt-3">
                                                <h3 className="font-title-md text-title-md text-on-surface font-extrabold leading-snug">Adonan Martabak Telur</h3>
                                                <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">50 Porsi Bola Kulit Renyah Elastis</p>
                                            </div>
                                            <div className="mt-2 flex items-center justify-between font-label-sm text-label-sm">
                                                <span className={`${activeRecipeKey === 'martabak-telur' ? 'text-primary' : 'text-on-surface-variant'} font-bold`}>Standard Yield: 50 bola</span>
                                                <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                                            </div>
                                        </button>

                                        {/* Card 3: Pandan Suji Asli */}
                                        <button onClick={() => setActiveRecipeKey('pandan-suji')} className={`text-left p-4 rounded-2xl transition-all duration-150 relative flex flex-col justify-between min-h-[148px] shadow-sm ${activeRecipeKey === 'pandan-suji' ? 'bg-surface-container-low translate-y-0.5' : 'bg-surface-container-lowest hover:bg-surface-container-low'}`} style={activeRecipeKey === 'pandan-suji' ? { boxShadow: '0 0 0 3px #d98e3f' } : {}} type="button">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center shrink-0">
                                                    <span className="material-symbols-outlined text-on-tertiary-fixed text-[28px]">eco</span>
                                                </div>
                                                <span className="font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-fixed-variant px-2 py-0.5 rounded-full font-bold">Wangi Alami</span>
                                            </div>
                                            <div className="mt-3">
                                                <h3 className="font-title-md text-title-md text-on-surface font-extrabold leading-snug">Adonan Pandan Suji Asli</h3>
                                                <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">Ember Kompak 5 Liter (Ekstrak Suji)</p>
                                            </div>
                                            <div className="mt-2 flex items-center justify-between font-label-sm text-label-sm">
                                                <span className={`${activeRecipeKey === 'pandan-suji' ? 'text-primary' : 'text-on-surface-variant'} font-bold`}>Standard Yield: ~11-12 loyang</span>
                                                <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                                            </div>
                                        </button>

                                        {/* Card 4: Red Velvet Gourmet */}
                                        <button onClick={() => setActiveRecipeKey('red-velvet')} className={`text-left p-4 rounded-2xl transition-all duration-150 relative flex flex-col justify-between min-h-[148px] shadow-sm ${activeRecipeKey === 'red-velvet' ? 'bg-surface-container-low translate-y-0.5' : 'bg-surface-container-lowest hover:bg-surface-container-low'}`} style={activeRecipeKey === 'red-velvet' ? { boxShadow: '0 0 0 3px #d98e3f' } : {}} type="button">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="w-12 h-12 rounded-xl bg-surface-variant flex items-center justify-center shrink-0">
                                                    <span className="material-symbols-outlined text-error text-[28px]">cookie</span>
                                                </div>
                                                <span className="font-label-sm text-label-sm bg-error-container text-on-error-container px-2 py-0.5 rounded-full font-bold">Gourmet</span>
                                            </div>
                                            <div className="mt-3">
                                                <h3 className="font-title-md text-title-md text-on-surface font-extrabold leading-snug">Adonan Red Velvet Gourmet</h3>
                                                <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">Ember Kompak 5 Liter (Bit &amp; Cokelat)</p>
                                            </div>
                                            <div className="mt-2 flex items-center justify-between font-label-sm text-label-sm">
                                                <span className={`${activeRecipeKey === 'red-velvet' ? 'text-primary' : 'text-on-surface-variant'} font-bold`}>Standard Yield: ~11-12 loyang</span>
                                                <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* 2. Pengatur Jumlah Batch Produksi (Stepper Touch Raksasa) */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col gap-5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-6 rounded-full bg-primary-container"></span>
                                            <h2 className="font-title-lg text-title-lg text-on-surface font-extrabold tracking-tight">2. Tentukan Volume Batch</h2>
                                        </div>
                                        <span className="font-label-md text-label-md bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full font-bold">1 Ember = 10 Liter</span>
                                    </div>
                                    
                                    {/* Quick Selector Preset Pills */}
                                    <div className="grid grid-cols-3 gap-3">
                                        {[1, 2, 3].map(n => (
                                            <button key={n} onClick={() => setCurrentBatch(n)} className={`min-h-[56px] rounded-2xl font-title-md text-title-md flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm ${currentBatch === n ? 'bg-primary text-on-primary font-extrabold shadow-md' : 'bg-surface-container-low text-on-surface font-bold'}`} type="button">
                                                <span>{n} Ember</span>
                                                <span className={`font-label-sm text-label-sm font-semibold ${currentBatch === n ? 'text-primary-fixed' : 'text-on-surface-variant'}`}>({n}x)</span>
                                            </button>
                                        ))}
                                    </div>
                                    
                                    {/* Giant Touch Stepper */}
                                    <div className="bg-surface-container-low p-4 rounded-2xl flex items-center justify-between gap-4">
                                        <button onClick={() => adjustBatch(-1)} className="w-18 h-18 sm:w-20 sm:h-20 min-w-[72px] rounded-2xl bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-md active:translate-y-0.5 active:shadow-sm flex items-center justify-center transition-all select-none" type="button">
                                            <span className="material-symbols-outlined text-[36px] font-black">remove</span>
                                        </button>
                                        <div className="flex flex-col items-center justify-center flex-1 py-1">
                                            <div className="flex items-baseline gap-2">
                                                <span className="font-num-display text-num-display text-primary font-black tracking-tight">{currentBatch}</span>
                                                <span className="font-headline-md text-headline-md text-on-surface font-extrabold">Ember</span>
                                            </div>
                                            <span className="font-title-md text-title-md text-on-surface-variant font-semibold">Total Volume: {totalLiters} Liter Adonan</span>
                                        </div>
                                        <button onClick={() => adjustBatch(1)} className="w-18 h-18 sm:w-20 sm:h-20 min-w-[72px] rounded-2xl bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed shadow-md active:translate-y-0.5 active:shadow-sm flex items-center justify-center transition-all select-none" type="button">
                                            <span className="material-symbols-outlined text-[36px] font-black">add</span>
                                        </button>
                                    </div>

                                    {/* Real-Time Output Estimation Badge */}
                                    <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed-variant">
                                        <div className="w-10 h-10 rounded-xl bg-tertiary text-on-tertiary flex items-center justify-center shrink-0 shadow-sm">
                                            <span className="material-symbols-outlined text-[24px]">local_fire_department</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-label-sm text-label-sm uppercase font-extrabold tracking-wide">Estimasi Output Loyang Masak</span>
                                            <span className="font-title-md text-title-md font-black">{recipe.yieldRange(currentBatch)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Catatan Operasional Koki & Stasiun */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-6 rounded-full bg-primary-container"></span>
                                        <h2 className="font-title-lg text-title-lg text-on-surface font-extrabold tracking-tight">3. Parameter Kualitas &amp; Simpan</h2>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-surface-container-low p-4 rounded-2xl flex flex-col gap-1.5">
                                            <span className="font-label-sm text-label-sm text-on-surface-variant font-bold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[16px]">schedule</span> Masa Simpan Aman (Shelf Life)
                                            </span>
                                            <span className="font-title-md text-title-md text-on-surface font-bold">Hari Ini + 18 Jam</span>
                                            <span className="font-label-sm text-label-sm text-tertiary font-semibold flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">check_circle</span> Suhu Ruang Dapur AC (24-26°C)
                                            </span>
                                        </div>
                                        <div className="bg-surface-container-low p-4 rounded-2xl flex flex-col gap-1.5">
                                            <span className="font-label-sm text-label-sm text-on-surface-variant font-bold flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[16px]">speed</span> Waktu Fermentasi / Istirahat
                                            </span>
                                            <span className="font-title-md text-title-md text-on-surface font-bold">45 Menit (Resting Phase)</span>
                                            <span className="font-label-sm text-label-sm text-secondary font-semibold">Siap dipanggang pukul 18:00 WIB</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Tombol Utama Konfirmasi Produksi (Sticky Heft Touch) */}
                                <button disabled={isProcessing} onClick={confirmBatchProduction} className={`w-full min-h-[64px] py-4 px-6 rounded-full bg-primary-container hover:bg-primary text-on-primary flex items-center justify-between gap-4 shadow-[0_8px_20px_rgba(217,142,63,0.35)] active:translate-y-1 transition-all select-none ${isProcessing ? 'opacity-50 cursor-wait' : ''}`} type="button">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-surface-container-lowest/20 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[24px]">done_all</span>
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className="font-title-lg text-title-lg font-black tracking-tight leading-tight">{isProcessing ? 'MEMPROSES...' : 'KONFIRMASI PRODUKSI & POTONG STOK'}</span>
                                            <span className="font-label-sm text-label-sm text-primary-fixed font-semibold">Otomatis mutasi inventaris gudang cabang</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-on-primary/20 px-4 py-2 rounded-full shrink-0">
                                        <span className="material-symbols-outlined text-[20px]">scale</span>
                                        <span className="font-label-lg text-label-lg font-extrabold tracking-wide">{currentBatch} {recipe.unit} ({totalLiters}L)</span>
                                    </div>
                                </button>
                            </div>

                            {/* RIGHT COLUMN: Kalkulasi Bahan Baku Terpotong & Log Produksi (5 Cols on xl) */}
                            <div className="xl:col-span-5 flex flex-col gap-6">
                                {/* Card: Kalkulator Pemotongan Stok Bahan Otomatis */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col gap-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-[22px]">inventory_2</span>
                                                <h2 className="font-title-lg text-title-lg text-on-surface font-extrabold tracking-tight">Kalkulasi Pemotongan Bahan</h2>
                                            </div>
                                            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                                                Kebutuhan bahan untuk <strong className="text-on-surface font-bold">{currentBatch} {recipe.unit} ({totalLiters}L)</strong>:
                                            </p>
                                        </div>
                                        <span className="font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-fixed px-2.5 py-1 rounded-full font-bold shrink-0">
                                            Semua Cukup
                                        </span>
                                    </div>

                                    {/* Interactive Ingredient List with Dynamic Quantities */}
                                    <div className="flex flex-col gap-2.5">
                                        {/* Tepung */}
                                        <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs">
                                                    <span className="material-symbols-outlined text-[22px]">grain</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-title-md text-title-md text-on-surface font-bold leading-tight">{recipe.ingredients.tepung.name}</span>
                                                    <span className="font-label-sm text-label-sm text-on-surface-variant">Sisa stok gudang: {recipe.ingredients.tepung.stockLeft.toFixed(1)} kg</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end shrink-0">
                                                <span className="font-title-lg text-title-lg text-primary font-black">{(recipe.ingredients.tepung.amount * currentBatch).toFixed(1)} kg</span>
                                                <span className="font-label-sm text-label-sm text-tertiary font-bold flex items-center gap-0.5">
                                                    <span className="material-symbols-outlined text-[13px]">check_circle</span> Sisa {(recipe.ingredients.tepung.stockLeft - recipe.ingredients.tepung.amount * currentBatch).toFixed(1)} kg
                                                </span>
                                            </div>
                                        </div>

                                        {/* Gula */}
                                        <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-secondary shadow-xs">
                                                    <span className="material-symbols-outlined text-[22px]">scatter_plot</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-title-md text-title-md text-on-surface font-bold leading-tight">{recipe.ingredients.gula.name}</span>
                                                    <span className="font-label-sm text-label-sm text-on-surface-variant">Sisa stok gudang: {recipe.ingredients.gula.stockLeft.toFixed(1)} kg</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end shrink-0">
                                                <span className="font-title-lg text-title-lg text-primary font-black">{(recipe.ingredients.gula.amount * currentBatch).toFixed(1)} kg</span>
                                                <span className="font-label-sm text-label-sm text-tertiary font-bold flex items-center gap-0.5">
                                                    <span className="material-symbols-outlined text-[13px]">check_circle</span> Sisa {(recipe.ingredients.gula.stockLeft - recipe.ingredients.gula.amount * currentBatch).toFixed(1)} kg
                                                </span>
                                            </div>
                                        </div>

                                        {/* Telur */}
                                        <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-secondary shadow-xs">
                                                    <span className="material-symbols-outlined text-[22px]">egg</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-title-md text-title-md text-on-surface font-bold leading-tight">{recipe.ingredients.telurName}</span>
                                                    <span className="font-label-sm text-label-sm text-on-surface-variant">Sisa stok gudang: {recipe.ingredients.telurStock.toFixed(1)} kg</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end shrink-0">
                                                <span className="font-title-lg text-title-lg text-primary font-black">{recipe.ingredients.telurCount * currentBatch} Butir ({(recipe.ingredients.telurKg * currentBatch).toFixed(1)} kg)</span>
                                                <span className="font-label-sm text-label-sm text-tertiary font-bold flex items-center gap-0.5">
                                                    <span className="material-symbols-outlined text-[13px]">check_circle</span> Sisa {(recipe.ingredients.telurStock - recipe.ingredients.telurKg * currentBatch).toFixed(1)} kg
                                                </span>
                                            </div>
                                        </div>

                                        {/* Butter */}
                                        <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs">
                                                    <span className="material-symbols-outlined text-[22px]">lunch_dining</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-title-md text-title-md text-on-surface font-bold leading-tight">{recipe.ingredients.butter.name}</span>
                                                    <span className="font-label-sm text-label-sm text-on-surface-variant">Sisa stok gudang: {recipe.ingredients.butter.stockLeft.toFixed(1)} kg</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end shrink-0">
                                                <span className="font-title-lg text-title-lg text-primary font-black">{(recipe.ingredients.butter.amount * currentBatch).toFixed(1)} kg</span>
                                                <span className="font-label-sm text-label-sm text-tertiary font-bold flex items-center gap-0.5">
                                                    <span className="material-symbols-outlined text-[13px]">check_circle</span> Sisa {(recipe.ingredients.butter.stockLeft - recipe.ingredients.butter.amount * currentBatch).toFixed(1)} kg
                                                </span>
                                            </div>
                                        </div>

                                        {/* Ragi */}
                                        <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-on-surface-variant shadow-xs">
                                                    <span className="material-symbols-outlined text-[22px]">science</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-title-md text-title-md text-on-surface font-bold leading-tight">{recipe.ingredients.ragi.name}</span>
                                                    <span className="font-label-sm text-label-sm text-on-surface-variant">Sisa stok kemasan aman</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end shrink-0">
                                                <span className="font-title-lg text-title-lg text-primary font-black">{recipe.ingredients.ragi.amount * currentBatch} gram</span>
                                                <span className="font-label-sm text-label-sm text-tertiary font-bold flex items-center gap-0.5">
                                                    <span className="material-symbols-outlined text-[13px]">check_circle</span> Aman
                                                </span>
                                            </div>
                                        </div>

                                        {/* Air */}
                                        <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs">
                                                    <span className="material-symbols-outlined text-[22px]">water_drop</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-title-md text-title-md text-on-surface font-bold leading-tight">{recipe.ingredients.air.name}</span>
                                                    <span className="font-label-sm text-label-sm text-on-surface-variant">Sisa cadangan: 4 Galon</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end shrink-0">
                                                <span className="font-title-lg text-title-lg text-primary font-black">{(recipe.ingredients.air.amount * currentBatch).toFixed(1)} Liter</span>
                                                <span className="font-label-sm text-label-sm text-tertiary font-bold flex items-center gap-0.5">
                                                    <span className="material-symbols-outlined text-[13px]">check_circle</span> Cukup
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Soft Informational Warning Box */}
                                    <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface-container text-on-surface-variant">
                                        <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">info</span>
                                        <p className="font-body-md text-body-md leading-snug">
                                            Semua bahan di atas akan langsung mengurangi angka inventaris stok cabang secara <strong className="text-on-surface font-bold">real-time</strong> begitu koki menekan tombol konfirmasi produksi.
                                        </p>
                                    </div>
                                </div>

                                {/* Card: Riwayat Batch Produksi Hari Ini */}
                                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-tertiary text-[22px]">history</span>
                                            <h2 className="font-title-lg text-title-lg text-on-surface font-extrabold tracking-tight">Riwayat Batch Hari Ini</h2>
                                        </div>
                                        <span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant px-2.5 py-1 rounded-full font-bold">{history.length} Batch Selesai</span>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {history.length > 0 ? history.map((log, index) => (
                                            <div key={log.id} className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed font-num-keypad text-title-lg font-black flex items-center justify-center shrink-0">
                                                        #{String(history.length - index).padStart(2, '0')}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-title-md text-title-md text-on-surface font-bold leading-tight">Batch Produksi ID {log.id}</span>
                                                        <span className="font-label-sm text-label-sm text-on-surface-variant">{log.batch_quantity} Batch • {new Date(log.produced_at).toLocaleTimeString('id-ID', { hour12: false })} WIB • {log.user?.name || 'Sistem'}</span>
                                                    </div>
                                                </div>
                                                <span className="font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full font-extrabold flex items-center gap-1 shrink-0">
                                                    <span className="material-symbols-outlined text-[14px]">check</span> Sukses
                                                </span>
                                            </div>
                                        )) : (
                                            <div className="p-4 text-center text-on-surface-variant">Belum ada riwayat batch hari ini.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Confirmation Modal / Toast Popover */}
                        {toastMessage && (
                            <div className="fixed bottom-6 right-6 max-w-md bg-inverse-surface text-inverse-on-surface p-5 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-5 fade-in duration-300 z-50">
                                <div className="w-12 h-12 rounded-xl bg-tertiary text-on-tertiary flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[28px]">check_circle</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-title-md text-title-md font-bold text-inverse-on-surface">Batch Produksi Berhasil Dicatat!</span>
                                    <span className="font-body-md text-body-md text-inverse-on-surface/80">{toastMessage}</span>
                                </div>
                            </div>
                        )}
                        
                    </div>
                </div>
            </main>
        </div>
    );
}
