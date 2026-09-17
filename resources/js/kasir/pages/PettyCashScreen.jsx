import React, { useState, useEffect } from 'react';
import PosHeader from '../components/layout/PosHeader';
import apiClient from '../utils/apiClient';

export default function PettyCashScreen() {
    const [nominal, setNominal] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('gas');
    const [description, setDescription] = useState('');
    const [history, setHistory] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [cashier, setCashier] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('pos_cashier');
        if (saved) setCashier(JSON.parse(saved));
    }, []);

    const categories = [
        { id: 'gas', icon: 'propane_tank', title: 'Gas Elpiji 3kg', subtitle: 'Bahan Bakar' },
        { id: 'bensin', icon: 'two_wheeler', title: 'Bensin & Kurir', subtitle: 'Transport' },
        { id: 'es_batu', icon: 'ac_unit', title: 'Es Kristal Bal', subtitle: 'Minuman' },
        { id: 'darurat', icon: 'storefront', title: 'Bahan Darurat', subtitle: 'Telur / Mentega' },
        { id: 'kebersihan', icon: 'cleaning_services', title: 'Kresek & Sabun', subtitle: 'Perlengkapan' },
        { id: 'lainnya', icon: 'more_horiz', title: 'Lain-lain', subtitle: 'Operasional' }
    ];

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID').format(number);

    const loadHistory = async () => {
        try {
            const res = await apiClient.get('/petty-cash?branch_id=1');
            if (res.status === 'success') {
                setHistory(Array.isArray(res.data) ? res.data : (res.data.data || []));
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    const handleAddShortcut = (amount) => {
        setNominal(prev => Math.min(prev + amount, 500000));
    };

    const handleClear = () => {
        setNominal(0);
    };

    const handleSubmit = async () => {
        if (nominal <= 0) {
            alert('Nominal harus lebih besar dari 0');
            return;
        }
        if (!description) {
            alert('Keterangan tidak boleh kosong');
            return;
        }

        setIsProcessing(true);
        try {
            const payload = {
                branch_id: cashier ? cashier.branch_id : 1,
                user_id: cashier ? cashier.id : 1,
                type: 'out',
                category: selectedCategory,
                amount: nominal,
                description: description
            };
            const response = await apiClient.post('/petty-cash', payload);
            
            if (response.status === 'success') {
                alert(`Pengeluaran Kas Kecil Rp ${formatRupiah(nominal)} berhasil disimpan! Laci kas terbuka.`);
                setNominal(0);
                setDescription('');
                loadHistory();
            } else {
                alert(response.message);
            }
        } catch (error) {
            alert('Gagal menyimpan kas kecil. ' + (error.response?.data?.message || 'Error jaringan.'));
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-background font-body-md text-on-surface antialiased min-h-screen select-none">
            <PosHeader />
            
            <main className="w-full pt-20 bg-background pb-10">
                <div className="flex flex-col w-full">
                    <div className="w-full px-space-md py-space-sm max-w-[1400px] mx-auto">
                        
                        {/* Top Sticky Operational Strip / Shift Summary */}
                        <div className="w-full bg-surface-container-low rounded-lg p-space-md mb-space-md shadow-[0_4px_16px_-2px_rgba(70,42,25,0.06)] flex flex-wrap items-center justify-between gap-space-sm">
                            <div className="flex items-center gap-space-md">
                                <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-space-xs">
                                        <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Shift 1 • Sore-Malam</span>
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                                        <span className="font-label-sm text-label-sm text-tertiary font-bold">Laci Kas Aktif</span>
                                    </div>
                                    <h1 className="font-headline-md text-headline-md text-on-surface font-extrabold tracking-tight">Kas Kecil &amp; Petty Cash Outlet</h1>
                                </div>
                            </div>
                            <div className="flex items-center gap-space-md">
                                <div className="bg-surface rounded-base px-space-md py-2 shadow-sm text-right">
                                    <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold block">Sisa Kas Fisik Laci</span>
                                    <span className="font-title-lg text-title-lg text-primary font-black">Rp 1.450.000</span>
                                </div>
                                <div className="bg-surface-variant/40 rounded-base px-space-md py-2 shadow-sm text-right">
                                    <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold block">Modal Awal Kas</span>
                                    <span className="font-title-lg text-title-lg text-on-surface font-black">Rp 1.585.000</span>
                                </div>
                            </div>
                        </div>

                        {/* Main Two-Column Split (iPad Landscape 50/50 Layout) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
                            
                            {/* LEFT COLUMN: Form Input Pengeluaran Baru */}
                            <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-space-md bg-surface-container-lowest rounded-lg p-space-lg shadow-[0_4px_16px_-2px_rgba(70,42,25,0.06)]">
                                
                                {/* Header & Quick Balance Info */}
                                <div className="flex items-center justify-between pb-space-xs">
                                    <div>
                                        <div className="flex items-center gap-1.5 text-primary">
                                            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                                            <span className="font-label-sm text-label-sm uppercase tracking-wider font-extrabold">Formulir Kas Keluar</span>
                                        </div>
                                        <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Catat Pengeluaran Baru</h2>
                                    </div>
                                    <span className="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-3 py-1 rounded-full font-bold">
                                        Otomatis Potong Laci
                                    </span>
                                </div>

                                {/* CAMERA CAPTURE / VIEWFINDER AREA */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface-variant font-bold flex items-center justify-between">
                                        <span>Foto Nota / Bon Fisik (Wajib)</span>
                                        <span className="text-tertiary font-bold flex items-center gap-1 font-label-sm text-label-sm">
                                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                            Nota Terlampir (1)
                                        </span>
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                                        {/* Shutter Button / Live Viewfinder trigger */}
                                        <button className="sm:col-span-2 group relative overflow-hidden h-36 rounded-base bg-surface-container-low hover:bg-surface-container transition-all duration-150 flex flex-col items-center justify-center gap-2 active:scale-[0.98] shadow-sm text-on-surface" type="button">
                                            <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-[26px]">photo_camera</span>
                                            </div>
                                            <div className="text-center px-space-sm">
                                                <span className="font-label-md text-label-md font-bold text-on-surface block">Ambil Foto Kuitansi / Bon</span>
                                                <span className="font-label-sm text-label-sm text-on-surface-variant">Kamera iPad aktif • Ketuk untuk jepret</span>
                                            </div>
                                            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-surface/90 px-2 py-0.5 rounded-full font-label-sm text-label-sm text-on-surface-variant">
                                                <span className="material-symbols-outlined text-[14px]">autorenew</span> Ganti Kamera
                                            </div>
                                        </button>
                                        
                                        {/* Active Photo Preview Thumbnail with Timestamp overlay */}
                                        <div className="relative h-36 rounded-base overflow-hidden bg-surface-container shadow-sm group">
                                            <img alt="preview" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvTZlAqXsnEVU8T_IAOptKHWRWvWvMdTDv08q75_xPP8HCVutiS3QRsJ_2xUFtdyJ-dKLnUEuY5LJTPxeAgbo7SgliDyoagVu2Fwh0AL8BntiHbhVYwMrHehSGwOdLzjaISzSP0QggPUQc-uUBTiI1cT_WjHqVGvBUdDsoPMqLWYyHAbcucz3VN2V3YWwnq88grpD6tkb9wPkMVv8mMTVBBbYxdwgz5BXI2WERuss3eTAWTkmNl1Ay" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 flex flex-col justify-between p-2">
                                                <div className="flex justify-between items-start">
                                                    <span className="bg-tertiary text-on-tertiary font-label-sm text-label-sm px-1.5 py-0.5 rounded font-bold">TERVERIFIKASI</span>
                                                    <button className="w-6 h-6 rounded-full bg-error text-on-error flex items-center justify-center shadow" title="Hapus foto" type="button">
                                                        <span className="material-symbols-outlined text-[14px]">close</span>
                                                    </button>
                                                </div>
                                                <div className="text-left">
                                                    <span className="text-white font-label-sm text-label-sm font-bold block truncate">Bon-Gas-3kg.jpg</span>
                                                    <span className="text-white/80 font-label-sm text-label-sm">1.8 MB • Hari Ini</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* NOMINAL INPUT & QUICK SHORTCUT CHIPS */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface-variant font-bold flex items-center justify-between">
                                        <span>Nominal Pengeluaran</span>
                                        <span className="text-primary font-bold font-label-sm text-label-sm">Maks Rp 500.000 / transaksi</span>
                                    </label>
                                    <div className="relative rounded-base bg-surface-container px-space-md py-space-sm flex items-center justify-between shadow-inner">
                                        <span className="font-headline-lg text-headline-lg text-primary font-extrabold tracking-tight">Rp</span>
                                        <input 
                                            value={formatRupiah(nominal)}
                                            readOnly 
                                            className="w-full bg-transparent font-num-display text-num-display text-on-surface font-extrabold text-right focus:outline-none tracking-tight pl-2" 
                                            type="text" 
                                        />
                                        <button onClick={handleClear} className="ml-2 w-9 h-9 rounded-full bg-surface-container-high hover:bg-surface-variant text-on-surface-variant flex items-center justify-center active:scale-95 transition-all shrink-0" title="Bersihkan Angka" type="button">
                                            <span className="material-symbols-outlined text-[18px]">backspace</span>
                                        </button>
                                    </div>
                                    
                                    {/* Fast Denomination Chips */}
                                    <div className="grid grid-cols-4 gap-space-xs pt-1">
                                        {[10000, 20000, 50000, 100000].map(amount => (
                                            <button 
                                                key={amount} 
                                                onClick={() => handleAddShortcut(amount)}
                                                className={`h-11 rounded-full font-label-lg text-label-lg font-bold flex items-center justify-center active:scale-95 shadow-sm transition-all ${amount === 50000 ? 'bg-secondary-fixed text-on-secondary-fixed font-black' : 'bg-surface-container-low hover:bg-surface-container text-on-surface'}`} 
                                                type="button"
                                            >
                                                +{amount / 1000}rb
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* CATEGORY SELECTION */}
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-md text-label-md text-on-surface-variant font-bold">Kategori Kebutuhan Operasional</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-xs">
                                        {categories.map(cat => {
                                            const isSelected = selectedCategory === cat.id;
                                            return (
                                                <button 
                                                    key={cat.id}
                                                    onClick={() => setSelectedCategory(cat.id)}
                                                    className={`h-14 px-3 rounded-base flex items-center gap-2 text-left active:scale-95 transition-all ${isSelected ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'}`} 
                                                    type="button"
                                                >
                                                    <span className={`material-symbols-outlined text-[22px] shrink-0 ${!isSelected && 'text-primary'}`} style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}>{cat.icon}</span>
                                                    <div className="flex flex-col truncate">
                                                        <span className="font-label-md text-label-md font-bold truncate leading-tight">{cat.title}</span>
                                                        <span className={`font-label-sm text-label-sm truncate leading-tight ${isSelected ? 'opacity-90' : 'text-on-surface-variant'}`}>{cat.subtitle}</span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* NOTES / REMARKS FIELD */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface-variant font-bold flex items-center justify-between">
                                        <span>Keterangan Detail</span>
                                        <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">Kebutuhan spesifik</span>
                                    </label>
                                    <div className="relative bg-surface-container rounded-base p-space-sm focus-within:bg-surface-container-high transition-colors">
                                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-transparent font-body-lg text-body-lg text-on-surface focus:outline-none resize-none" placeholder="Tuliskan alasan pembelian..." rows="2"></textarea>
                                    </div>
                                </div>

                                {/* PRIMARY SUBMIT ACTION BUTTON */}
                                <button disabled={isProcessing} onClick={handleSubmit} className={`w-full h-16 rounded-full bg-primary-container hover:brightness-105 active:scale-[0.99] text-on-primary shadow-[0_8px_20px_-4px_rgba(217,142,63,0.45)] flex items-center justify-between px-space-lg transition-all ${isProcessing ? 'opacity-50 cursor-wait' : ''}`} type="button">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>outbox</span>
                                        <span className="font-title-lg text-title-lg font-extrabold tracking-wide">{isProcessing ? 'MENYIMPAN...' : 'Simpan Kas Keluar'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-black/10 px-space-md py-1.5 rounded-full">
                                        <span className="font-label-sm text-label-sm uppercase font-bold text-white/90">Buka Laci:</span>
                                        <span className="font-title-lg text-title-lg font-black text-white">Rp {formatRupiah(nominal)}</span>
                                    </div>
                                </button>
                            </div>

                            {/* RIGHT COLUMN: Riwayat Pengeluaran Hari Ini & Audit Trail */}
                            <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-space-md">
                                {/* Summary Metric Card */}
                                <div className="bg-surface-container rounded-lg p-space-md shadow-[0_4px_16px_-2px_rgba(70,42,25,0.06)] flex items-center justify-between">
                                    <div>
                                        <span className="font-label-md text-label-md text-on-surface-variant font-bold block">Total Pengeluaran Hari Ini</span>
                                        <div className="flex items-baseline gap-2 mt-0.5">
                                            <span className="font-headline-lg text-headline-lg text-on-surface font-black">Rp {formatRupiah(history.reduce((sum, item) => sum + parseFloat(item.amount), 0))}</span>
                                            <span className="font-label-sm text-label-sm text-on-surface-variant font-bold bg-surface px-2 py-0.5 rounded-full shadow-sm">{history.length} Transaksi</span>
                                        </div>
                                    </div>
                                    <div className="w-14 h-14 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shadow-sm">
                                        <span className="material-symbols-outlined text-[30px]">receipt</span>
                                    </div>
                                </div>

                                {/* History Card List Container */}
                                <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-[0_4px_16px_-2px_rgba(70,42,25,0.06)] flex flex-col gap-space-sm">
                                    <div className="flex items-center justify-between pb-space-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="font-title-md text-title-md font-bold text-on-surface">Daftar Pengeluaran Hari Ini</span>
                                            <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">Shift Berjalan</span>
                                        </div>
                                        <button className="font-label-sm text-label-sm text-primary hover:underline font-bold flex items-center gap-1" type="button">
                                            <span className="material-symbols-outlined text-[16px]">refresh</span> Muat Ulang
                                        </button>
                                    </div>

                                    {history.map((item) => (
                                        <div key={item.id} className="bg-surface-container-low hover:bg-surface-container transition-all rounded-base p-space-sm flex flex-col gap-2 shadow-sm">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-start gap-space-xs">
                                                    <div className="w-10 h-10 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0 mt-0.5">
                                                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                            {categories.find(c => c.id === item.category)?.icon || 'receipt'}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-title-md text-title-md font-bold text-on-surface leading-snug">{item.category}</span>
                                                        <span className="font-body-md text-body-md text-on-surface-variant">{item.description}</span>
                                                    </div>
                                                </div>
                                                <span className="font-title-lg text-title-lg font-black text-on-surface shrink-0">Rp {formatRupiah(item.amount)}</span>
                                            </div>
                                            <div className="flex items-center justify-between pt-1 text-on-surface-variant font-label-sm text-label-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-surface px-2 py-0.5 rounded-full font-bold text-on-surface flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[14px]">schedule</span> {new Date(item.created_at).toLocaleTimeString('id-ID', { hour12: false })} WIB
                                                    </span>
                                                    <span>Kasir: <strong className="text-on-surface">{item.user?.name || 'Sistem'}</strong></span>
                                                </div>
                                                <button className="inline-flex items-center gap-1.5 bg-surface-container-high hover:bg-surface-variant px-2.5 py-1 rounded-full text-on-surface font-bold active:scale-95 transition-all" type="button">
                                                    <span className="material-symbols-outlined text-[15px] text-tertiary">image</span>
                                                    <span>Lihat Bon</span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {history.length === 0 && (
                                        <div className="p-4 text-center text-on-surface-variant">Belum ada pengeluaran hari ini.</div>
                                    )}

                                    {/* Bottom Action Buttons: Print Report & Void Expense */}
                                    <div className="grid grid-cols-2 gap-space-xs pt-space-xs">
                                        <button className="h-12 rounded-full bg-surface-container-low hover:bg-error-container text-error font-label-md text-label-md font-bold flex items-center justify-center gap-2 active:scale-95 transition-all" type="button">
                                            <span className="material-symbols-outlined text-[18px]">cancel</span>
                                            <span>Koreksi / Void Bon</span>
                                        </button>
                                        <button className="h-12 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm" type="button">
                                            <span className="material-symbols-outlined text-[18px] text-primary">print</span>
                                            <span>Cetak Rekap Kas Kecil</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Auditing Notice Pill / SOP Reminder */}
                                <div className="bg-secondary-fixed/40 rounded-base p-space-sm flex items-center gap-space-sm">
                                    <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
                                        <span className="material-symbols-outlined text-[18px]">shield</span>
                                    </div>
                                    <p className="font-label-sm text-label-sm text-on-surface leading-tight">
                                        <strong>Aturan Kasir Martaboom:</strong> Setiap pengeluaran di atas Rp 20.000 wajib menyertakan foto nota fisik bercap dan akan dicocokkan saat timbang kas akhir shift.
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
