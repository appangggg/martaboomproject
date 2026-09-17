import React, { useState, useEffect } from 'react';
import PosHeader from '../components/layout/PosHeader';

const REASONS = [
    { id: 1, title: 'Gosong / Rusak Masak', icon: 'local_fire_department' },
    { id: 2, title: 'Adonan Basi / Kedaluwarsa', icon: 'hourglass_disabled' },
    { id: 3, title: 'Telur / Bahan Pecah', icon: 'egg' },
    { id: 4, title: 'Kulit / Adonan Robek', icon: 'content_cut' },
    { id: 5, title: 'Bahan Jatuh / Tumpah', icon: 'water_drop' },
    { id: 6, title: 'Lain-lain / Komplain', icon: 'sentiment_dissatisfied' },
];

export default function WasteRecordScreen() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedReason, setSelectedReason] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [history, setHistory] = useState([]);
    const [todayTotal, setTodayTotal] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [branch, setBranch] = useState(null);
    const [cashier, setCashier] = useState(null);
    const [shift, setShift] = useState(null);

    useEffect(() => {
        // Load context from localStorage
        try {
            const b = localStorage.getItem('pos_branch');
            const c = localStorage.getItem('pos_cashier');
            if (b) setBranch(JSON.parse(b));
            if (c) setCashier(JSON.parse(c));
        } catch (_) {}
    }, []);

    useEffect(() => {
        if (branch || cashier) {
            loadProducts();
            loadHistory();
            loadShift();
        }
    }, [branch, cashier]);

    const loadProducts = async () => {
        try {
            const res = await window.apiClient.get('/products/list');
            if (res.status === 'success') {
                setProducts(res.data);
                if (res.data.length > 0) setSelectedProduct(res.data[0]);
            }
        } catch (err) {
            console.error('Error loading products:', err);
        }
    };

    const loadHistory = async () => {
        try {
            const branchId = branch?.id || 1;
            const res = await window.apiClient.get(`/waste-logs?branch_id=${branchId}`);
            if (res.status === 'success') {
                setHistory(res.data);
                setTodayTotal(res.today_total || 0);
            }
        } catch (err) {
            console.error('Error loading waste logs:', err);
        }
    };

    const loadShift = async () => {
        try {
            const userId = cashier?.id || 1;
            const branchId = branch?.id || 1;
            const res = await window.apiClient.get(`/shift/current?user_id=${userId}&branch_id=${branchId}`);
            if (res.status === 'success') setShift(res.data);
        } catch (_) {}
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const costLoss = selectedProduct ? (selectedProduct.base_price || selectedProduct.price || 0) * quantity : 0;

    const handleSave = async () => {
        if (!selectedProduct) { alert('Pilih produk terlebih dahulu.'); return; }
        if (!selectedReason) { alert('Pilih alasan kerusakan.'); return; }

        setIsSaving(true);
        try {
            const branchId = branch?.id || 1;
            const userId = cashier?.id || 1;

            const res = await window.apiClient.post('/waste-logs', {
                branch_id: branchId,
                user_id: userId,
                item_type: 'product',
                item_id: selectedProduct.id,
                item_name: selectedProduct.name,
                quantity: quantity,
                reason: REASONS.find(r => r.id === selectedReason)?.title || 'Tidak diketahui',
                notes: notes,
                cost_loss: costLoss, // server akan hitung ulang jika 0
            });

            if (res.status === 'success') {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 2000);
                setQuantity(1);
                setNotes('');
                setSelectedReason(null);
                loadHistory();
            } else {
                alert(res.message || 'Gagal menyimpan.');
            }
        } catch (err) {
            alert('Gagal mencatat waste: ' + (err?.data?.message || 'Error jaringan.'));
        } finally {
            setIsSaving(false);
        }
    };

    const branchName = branch?.name || 'Cabang';
    const shiftLabel = shift ? shift.shift_type : 'Belum Ada Shift';

    return (
        <div className="bg-background font-body-md text-on-surface antialiased min-h-screen select-none">
            <PosHeader />

            <main className="w-full pt-20 pb-10">
                <div className="w-full max-w-[1440px] mx-auto p-space-md lg:p-space-lg">

                    {/* Breadcrumb */}
                    <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md bg-surface-container-low px-space-md py-2.5 rounded-xl shadow-sm">
                        <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
                            <span className="material-symbols-outlined text-[18px] text-primary">inventory_2</span>
                            <span>Dapur</span>
                            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                            <span className="font-bold text-on-surface">Pencatatan Waste & Kerusakan</span>
                        </div>
                        <div className="flex items-center gap-space-sm">
                            <span className="inline-flex items-center gap-1.5 font-label-sm text-label-sm text-tertiary bg-tertiary-fixed px-space-sm py-1 rounded-full font-bold capitalize">
                                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                                {shiftLabel}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">

                        {/* KIRI: Form Input */}
                        <section className="lg:col-span-7 flex flex-col gap-space-md">

                            {/* Form Header */}
                            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm">
                                <div className="flex items-start justify-between gap-space-sm">
                                    <div>
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold uppercase tracking-wider mb-2">
                                            <span className="material-symbols-outlined text-[16px]">report_problem</span>
                                            Catat Waste
                                        </div>
                                        <h1 className="font-headline-md text-headline-md text-on-surface font-black leading-tight">
                                            Waste &amp; Kerusakan Produk
                                        </h1>
                                        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                                            Catat bahan atau produk yang rusak, basi, atau tumpah.
                                        </p>
                                    </div>
                                    <div className="hidden sm:flex flex-col items-end shrink-0 bg-surface-container px-3 py-2 rounded-xl text-right">
                                        <span className="font-label-sm text-label-sm text-on-surface-variant">Cabang</span>
                                        <span className="font-title-sm text-title-sm text-primary font-bold">{branchName}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Langkah 1: Pilih Alasan */}
                            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-label-sm text-label-sm flex items-center justify-center font-bold">1</span>
                                    <h2 className="font-title-md text-title-md text-on-surface font-bold">Pilih Alasan Kerusakan</h2>
                                    <span className="ml-auto font-label-sm text-label-sm text-on-surface-variant">Wajib dipilih</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {REASONS.map(r => {
                                        const isActive = selectedReason === r.id;
                                        return (
                                            <button
                                                key={r.id}
                                                onClick={() => setSelectedReason(r.id)}
                                                className={`flex flex-col items-start p-3 rounded-xl min-h-[80px] text-left transition-all active:scale-95 shadow-sm ${isActive ? 'bg-error-container text-on-error-container ring-2 ring-error' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'}`}
                                                type="button"
                                            >
                                                <div className="flex items-center justify-between w-full mb-1.5">
                                                    <span className={`material-symbols-outlined text-[24px] ${isActive ? 'text-error' : 'text-primary'}`}>{r.icon}</span>
                                                    {isActive && <span className="material-symbols-outlined text-[18px] text-error" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                                                </div>
                                                <span className="font-label-md text-label-md font-bold leading-tight">{r.title}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Langkah 2: Pilih Produk */}
                            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-label-sm text-label-sm flex items-center justify-center font-bold">2</span>
                                    <h2 className="font-title-md text-title-md text-on-surface font-bold">Pilih Produk / Bahan</h2>
                                </div>

                                {/* Search */}
                                <div className="relative mb-3">
                                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">search</span>
                                    <input
                                        type="text"
                                        placeholder="Cari produk..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container placeholder:text-on-surface-variant/60"
                                    />
                                </div>

                                {/* Product List */}
                                <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                                    {filteredProducts.length === 0 && (
                                        <p className="text-center text-on-surface-variant py-4 font-body-md text-body-md">Tidak ada produk ditemukan.</p>
                                    )}
                                    {filteredProducts.map(p => {
                                        const isActive = selectedProduct?.id === p.id;
                                        const price = p.base_price || p.price || 0;
                                        return (
                                            <button
                                                key={p.id}
                                                onClick={() => { setSelectedProduct(p); setSearchQuery(''); }}
                                                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${isActive ? 'bg-primary-container ring-2 ring-primary' : 'bg-surface-container-low hover:bg-surface-container'}`}
                                                type="button"
                                            >
                                                <span className="font-label-md text-label-md text-on-surface font-semibold">{p.name}</span>
                                                <span className={`font-label-sm text-label-sm font-bold ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                                                    Rp {price.toLocaleString('id-ID')}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Langkah 3: Jumlah */}
                            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-label-sm text-label-sm flex items-center justify-center font-bold">3</span>
                                    <h2 className="font-title-md text-title-md text-on-surface font-bold">Jumlah &amp; Estimasi Kerugian</h2>
                                </div>

                                <div className="flex items-center gap-4 mb-4">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-12 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high font-bold text-2xl flex items-center justify-center shadow-sm transition" type="button">−</button>
                                    <div className="flex-1 text-center">
                                        <span className="font-headline-lg text-headline-lg text-on-surface font-black">{quantity}</span>
                                        <span className="font-body-md text-body-md text-on-surface-variant ml-2">unit/loyang</span>
                                    </div>
                                    <button onClick={() => setQuantity(q => q + 1)} className="w-12 h-12 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high font-bold text-2xl flex items-center justify-center shadow-sm transition" type="button">+</button>
                                </div>

                                {/* Cost Summary */}
                                {selectedProduct && (
                                    <div className="bg-error-container/30 rounded-xl p-3 flex items-center justify-between">
                                        <div>
                                            <p className="font-label-sm text-label-sm text-on-surface-variant">{selectedProduct.name} × {quantity}</p>
                                            <p className="font-label-sm text-label-sm text-on-surface-variant">
                                                Harga: Rp {(selectedProduct.base_price || selectedProduct.price || 0).toLocaleString('id-ID')} / unit
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-label-sm text-label-sm text-on-surface-variant">Est. Kerugian HPP</p>
                                            <p className="font-headline-sm text-headline-sm text-error font-black">Rp {costLoss.toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Langkah 4: Catatan */}
                            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="w-6 h-6 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center font-bold">4</span>
                                    <h2 className="font-title-md text-title-md text-on-surface font-bold">Catatan (Opsional)</h2>
                                </div>
                                <textarea
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    placeholder="Contoh: Api kompor terlalu besar, produk gosong sebelum matang..."
                                    className="w-full p-3 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container resize-none placeholder:text-on-surface-variant/60"
                                    rows={3}
                                />
                            </div>

                            {/* Submit */}
                            <button
                                onClick={handleSave}
                                disabled={isSaving || !selectedProduct || !selectedReason}
                                className={`w-full h-16 rounded-2xl font-title-lg text-title-lg font-black flex items-center justify-center gap-3 shadow-lg transition-all active:translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed ${saveSuccess ? 'bg-tertiary text-on-tertiary' : 'bg-error text-on-error hover:opacity-90'}`}
                                type="button"
                            >
                                {isSaving ? (
                                    <><span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span> Menyimpan...</>
                                ) : saveSuccess ? (
                                    <><span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Tersimpan!</>
                                ) : (
                                    <><span className="material-symbols-outlined text-[24px]">save</span> Simpan Catatan Waste</>
                                )}
                            </button>
                        </section>

                        {/* KANAN: Ringkasan & History */}
                        <section className="lg:col-span-5 flex flex-col gap-space-md">

                            {/* Summary Card */}
                            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="font-title-md text-title-md text-on-surface font-bold">Ringkasan Hari Ini</h2>
                                    <span className="px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
                                        {history.length} Kejadian
                                    </span>
                                </div>
                                <div className="bg-error-container/20 rounded-xl p-4 text-center mb-3">
                                    <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Total Kerugian Waste</p>
                                    <p className="font-headline-lg text-headline-lg text-error font-black">Rp {todayTotal.toLocaleString('id-ID')}</p>
                                </div>
                            </div>

                            {/* History Log */}
                            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="font-title-md text-title-md text-on-surface font-bold">Log Hari Ini</h2>
                                    <button onClick={loadHistory} className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high flex items-center justify-center" type="button">
                                        <span className="material-symbols-outlined text-[18px]">refresh</span>
                                    </button>
                                </div>

                                <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
                                    {history.length > 0 ? history.map(log => (
                                        <div key={log.id} className="flex items-start justify-between p-3 rounded-xl bg-surface-container-low gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-label-md text-label-md text-on-surface font-bold truncate">{log.item_name || 'Item Tidak Diketahui'}</p>
                                                <p className="font-label-sm text-label-sm text-on-surface-variant">{log.reason}</p>
                                                <p className="font-label-sm text-label-sm text-on-surface-variant">
                                                    {new Date(log.recorded_at || log.created_at).toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit' })} • {log.user?.name || 'Kasir'}
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="font-label-sm text-label-sm text-on-surface-variant">×{log.quantity}</p>
                                                <p className="font-label-md text-label-md text-error font-bold">
                                                    −Rp {Number(log.cost_loss).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="py-8 text-center text-on-surface-variant">
                                            <span className="material-symbols-outlined text-[40px] block opacity-40 mb-2">check_circle</span>
                                            <p className="font-body-md text-body-md">Tidak ada catatan waste hari ini.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
