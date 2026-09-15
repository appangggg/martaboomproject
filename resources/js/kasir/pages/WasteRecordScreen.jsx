import React, { useState, useEffect } from 'react';
import PosHeader from '../components/layout/PosHeader';

export default function WasteRecordScreen() {
    const [quantity, setQuantity] = useState(1);
    const basePrice = 18500;
    const [activeReason, setActiveReason] = useState(1);
    const [activeItem, setActiveItem] = useState(1);
    const [activeNote, setActiveNote] = useState(1);
    const [customNote, setCustomNote] = useState("Api kompor griddle 1 terlalu panas mendadak");
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [history, setHistory] = useState([]);

    const loadHistory = async () => {
        try {
            const response = await window.apiClient.get('/waste-logs?branch_id=1');
            if (response.status === 'success') {
                setHistory(response.data);
            }
        } catch (error) {
            console.error('Error loading waste logs:', error);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    const reasons = [
        { id: 1, title: 'Martabak Gosong / Rusak Masak', icon: 'local_fire_department' },
        { id: 2, title: 'Adonan Basi / Lewat Masa Simpan', icon: 'hourglass_disabled' },
        { id: 3, title: 'Telur Bebek / Ayam Pecah', icon: 'egg' },
        { id: 4, title: 'Kulit Martabak Robek', icon: 'content_cut' },
        { id: 5, title: 'Bahan Jatuh / Tumpah', icon: 'water_drop' },
        { id: 6, title: 'Lain-lain / Komplain Tamu', icon: 'sentiment_dissatisfied' },
    ];

    const items = [
        { id: 1, name: 'Terang Bulan Klasik (1 Loyang)' },
        { id: 2, name: 'Martabak Telur Spesial (1 Porsi)' },
        { id: 3, name: 'Adonan Mentah (1 Ember/Liter)' },
        { id: 4, name: 'Telur Bebek (3 Butir)' },
    ];

    const quickNotes = [
        { id: 1, text: 'Api kompor kebesaran' },
        { id: 2, text: 'Wajan terlalu panas' },
        { id: 3, text: 'Pesanan salah topping' },
        { id: 4, text: 'Ditinggal angkat telepon' },
    ];

    const handleMinus = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handlePlus = () => {
        setQuantity(quantity + 1);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const selectedReason = reasons.find(r => r.id === activeReason);
            const selectedItem = items.find(i => i.id === activeItem);

            const response = await window.apiClient.post('/waste-logs', {
                branch_id: 1,
                user_id: 1,
                item_name: selectedItem ? selectedItem.name : 'Unknown Item',
                quantity: quantity,
                loss_amount: quantity * basePrice,
                reason: selectedReason ? selectedReason.title : 'Unknown Reason',
                notes: customNote
            });

            if (response.status === 'success') {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 1500);
                loadHistory();
                setQuantity(1);
                setCustomNote("");
            } else {
                alert(response.message);
            }
        } catch (error) {
            alert('Gagal mencatat waste: ' + (error.response?.data?.message || 'Error jaringan.'));
        } finally {
            setIsSaving(false);
        }
    };

    const totalLoss = quantity * basePrice;
    const formattedLoss = `Rp ${totalLoss.toLocaleString('id-ID')}`;

    return (
        <div className="bg-background font-body-md text-on-surface antialiased min-h-screen select-none">
            <PosHeader />
            
            <main className="w-full pt-20 bg-background pb-10">
                <div className="flex flex-col w-full">
                    <div className="w-full px-space-md lg:px-space-lg py-space-md max-w-[1440px] mx-auto">
                        
                        {/* Breadcrumb & Shift Status Strip */}
                        <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md bg-surface-container-low px-space-md py-2.5 rounded-lg shadow-sm">
                            <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
                                <span className="material-symbols-outlined text-[18px] text-primary">inventory_2</span>
                                <span>Manajemen Dapur</span>
                                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                                <span className="font-bold text-on-surface">Pencatatan Waste &amp; Kerusakan (HPP Kontrol)</span>
                            </div>
                            <div className="flex items-center gap-space-sm">
                                <span className="inline-flex items-center gap-1.5 font-label-sm text-label-sm text-tertiary bg-tertiary-fixed px-space-sm py-1 rounded-full font-bold">
                                    <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                                    Shift 2 (Sore - Malam)
                                </span>
                                <span className="text-on-surface-variant font-label-sm text-label-sm font-semibold">Toleransi HPP: <strong className="text-on-surface font-bold">Maks. 1.5%</strong></span>
                            </div>
                        </div>

                        {/* Main 2-Column POS Landscape Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
                            
                            {/* KOLOM KIRI (Form Input Cepat Waste) - Span 7 */}
                            <section className="lg:col-span-7 flex flex-col gap-space-md">
                                {/* Form Header Card */}
                                <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-md">
                                    <div className="flex items-start justify-between gap-space-sm">
                                        <div>
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold uppercase tracking-wider mb-1.5">
                                                <span className="material-symbols-outlined text-[16px]">report_problem</span>
                                                Input Akuntabilitas Bahan
                                            </div>
                                            <h1 className="font-headline-lg text-headline-lg text-on-surface font-black tracking-tight leading-snug">
                                                Pencatatan Waste &amp; Kerusakan Produk
                                            </h1>
                                            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                                                Catat bahan atau adonan yang rusak, basi, gosong, atau tumpah untuk kontrol HPP.
                                            </p>
                                        </div>
                                        <div className="hidden sm:flex flex-col items-end shrink-0 bg-surface-container px-3 py-2 rounded-DEFAULT text-right">
                                            <span className="font-label-sm text-label-sm text-on-surface-variant">Station Griddle</span>
                                            <span className="font-title-md text-title-md text-primary font-bold">Dapur Tebet #01</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Langkah 1: Kategori / Alasan Cepat */}
                                <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-md">
                                    <div className="flex items-center justify-between mb-space-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-label-sm text-label-sm flex items-center justify-center font-bold">1</span>
                                            <h2 className="font-title-lg text-title-lg text-on-surface font-bold">Pilih Alasan / Kategori Kerusakan</h2>
                                        </div>
                                        <span className="font-label-sm text-label-sm text-on-surface-variant">Wajib 1 pilihan</span>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                        {reasons.map((r) => {
                                            const isActive = activeReason === r.id;
                                            return (
                                                <button 
                                                    key={r.id}
                                                    onClick={() => setActiveReason(r.id)}
                                                    className={`flex flex-col items-start justify-between p-3.5 rounded-DEFAULT min-h-[96px] text-left transition-all duration-150 active:scale-95 shadow-sm ${isActive ? 'bg-error-container text-on-error-container ring-2 ring-error' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'}`}
                                                    type="button"
                                                >
                                                    <div className="flex items-center justify-between w-full">
                                                        <span className={`material-symbols-outlined text-[26px] ${isActive ? 'text-error' : 'text-primary'}`}>{r.icon}</span>
                                                        {isActive && <span className="material-symbols-outlined text-[20px] text-error">check_circle</span>}
                                                    </div>
                                                    <span className="font-title-md text-title-md font-bold leading-tight mt-2">{r.title}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Langkah 2: Pilih Bahan atau Menu */}
                                <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-md">
                                    <div className="flex items-center justify-between mb-space-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-label-sm text-label-sm flex items-center justify-center font-bold">2</span>
                                            <h2 className="font-title-lg text-title-lg text-on-surface font-bold">Pilih Bahan atau Menu Jadi</h2>
                                        </div>
                                        <span className="font-label-sm text-label-sm text-primary font-bold cursor-pointer hover:underline flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px]">search</span> Cari Katalog
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-space-sm">
                                        {items.map(i => {
                                            const isActive = activeItem === i.id;
                                            return (
                                                <button 
                                                    key={i.id}
                                                    onClick={() => setActiveItem(i.id)}
                                                    className={`h-11 px-4 rounded-full font-label-lg text-label-lg flex items-center gap-2 transition-all shadow-sm active:scale-95 ${isActive ? 'bg-primary-container text-on-primary font-bold' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'}`}
                                                    type="button"
                                                >
                                                    <span className={`material-symbols-outlined text-[18px] ${isActive ? '' : 'text-outline'}`}>{isActive ? 'radio_button_checked' : 'radio_button_unchecked'}</span>
                                                    {i.name}
                                                </button>
                                            )
                                        })}
                                    </div>
                                    <div className="relative w-full">
                                        <input className="w-full h-12 bg-surface-container-low rounded-DEFAULT px-4 pl-11 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:shadow-md transition-all" placeholder="Atau ketik nama bahan / kode batch adonan..." type="text"/>
                                        <span className="material-symbols-outlined absolute left-3.5 top-3 text-outline text-[20px]">edit_note</span>
                                    </div>
                                </div>

                                {/* Langkah 3: Stepper Kuantitas & Estimasi */}
                                <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-md">
                                    <div className="flex items-center gap-2 mb-space-sm">
                                        <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-label-sm text-label-sm flex items-center justify-center font-bold">3</span>
                                        <h2 className="font-title-lg text-title-lg text-on-surface font-bold">Kuantitas &amp; Estimasi Nilai Kerugian HPP</h2>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-space-md items-center">
                                        <div className="sm:col-span-7 bg-surface-container-low p-2 rounded-lg flex items-center justify-between shadow-inner">
                                            <button onClick={handleMinus} className="w-14 h-14 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center shadow-md active:scale-90 transition-transform text-title-lg font-black hover:bg-surface-container-high" type="button">
                                                <span className="material-symbols-outlined text-[24px]">remove</span>
                                            </button>
                                            <div className="flex flex-col items-center justify-center px-4">
                                                <div className="flex items-baseline gap-1">
                                                    <span className="font-num-keypad text-num-keypad text-on-surface font-extrabold tabular-nums">{quantity}</span>
                                                    <span className="font-title-md text-title-md text-on-surface-variant font-bold">Loyang</span>
                                                </div>
                                                <span className="font-label-sm text-label-sm text-outline">Ukuran Reguler (Loyang 24cm)</span>
                                            </div>
                                            <button onClick={handlePlus} className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md active:scale-90 transition-transform text-title-lg font-black hover:bg-primary-container" type="button">
                                                <span className="material-symbols-outlined text-[24px]">add</span>
                                            </button>
                                        </div>
                                        <div className="sm:col-span-5 bg-error-container p-3.5 rounded-lg flex flex-col justify-center">
                                            <span className="font-label-sm text-label-sm text-on-error-container font-semibold uppercase tracking-wider flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px]">calculate</span>
                                                Nilai Beban HPP Bahan
                                            </span>
                                            <div className="flex items-baseline gap-1 mt-1">
                                                <span className="font-headline-lg text-headline-lg text-error font-black tracking-tight">{formattedLoss}</span>
                                            </div>
                                            <span className="font-label-sm text-label-sm text-on-error-container/80 mt-0.5">Otomatis dihitung dari BOM sistem</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Langkah 4: Bukti Fisik */}
                                <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-md">
                                    <div className="flex items-center justify-between mb-space-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-label-sm text-label-sm flex items-center justify-center font-bold">4</span>
                                            <h2 className="font-title-lg text-title-lg text-on-surface font-bold">Bukti Fisik &amp; Catatan Singkat</h2>
                                        </div>
                                        <span className="font-label-sm text-label-sm text-tertiary font-bold bg-tertiary-fixed px-2 py-0.5 rounded-full">Kamera iPad Ready</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-space-sm items-center">
                                        <div className="sm:col-span-4 relative group cursor-pointer overflow-hidden rounded-DEFAULT bg-surface-container-high aspect-[4/3] flex items-center justify-center shadow-inner">
                                            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAFfUNWqkuQ_0TxTyFCxuceQg2yogCDM7txjliC2hshP9W0j_1Yqpcnn6x23pdcHcTRdD_X7PTobhsYDf4KJyTg99sSoFdMxh1J3k8XJ3KrOPPsytjUk-umubnETFsMtTy0VeuiHs_cKesbhRAt5TBQfRlBs41Mk-iLP94TjFNitHP8WUZ4tVQYiID-PCf7Ogo9_jgxgiPCdBbAg2vVCSP_5q1ELhcbFtVpCEd7K3n8ZBYdzK-Ip8b" alt="Waste" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent flex flex-col justify-end p-2">
                                                <div className="inline-flex items-center gap-1 bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold w-fit shadow-sm">
                                                    <span className="material-symbols-outlined text-[14px] text-tertiary">check_circle</span>
                                                    Foto Terlampir (1)
                                                </div>
                                            </div>
                                            <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-surface-container-lowest/90 flex items-center justify-center text-on-surface shadow-md">
                                                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                                            </div>
                                        </div>
                                        <div className="sm:col-span-8 flex flex-col gap-2">
                                            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Pilih Catatan Cepat Kejadian:</span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {quickNotes.map(n => {
                                                    const isActive = activeNote === n.id;
                                                    return (
                                                        <button 
                                                            key={n.id}
                                                            onClick={() => {
                                                                setActiveNote(n.id);
                                                                setCustomNote(n.text);
                                                            }}
                                                            className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm transition-transform active:scale-95 shadow-sm ${isActive ? 'bg-secondary-fixed text-on-secondary-fixed font-bold' : 'bg-surface-container-low text-on-surface font-medium hover:bg-surface-container'}`}
                                                            type="button"
                                                        >
                                                            {n.text}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                            <input 
                                                value={customNote}
                                                onChange={(e) => setCustomNote(e.target.value)}
                                                className="w-full h-11 bg-surface-container-low rounded-DEFAULT px-3.5 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest shadow-sm" 
                                                placeholder="Tambahkan catatan khusus untuk supervisor..." 
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Tombol Simpan */}
                                <div className="pt-1">
                                    <button 
                                        onClick={handleSave}
                                        disabled={isSaving || saveSuccess}
                                        className={`w-full h-16 rounded-full flex items-center justify-between px-space-lg shadow-xl active:scale-[0.98] transition-all group ${isSaving || saveSuccess ? 'opacity-90 bg-error text-on-error' : 'bg-error text-on-error hover:bg-on-error-container'}`} 
                                        type="button"
                                    >
                                        {isSaving ? (
                                            <div className="flex items-center gap-space-sm mx-auto">
                                                <span className="material-symbols-outlined text-[28px] animate-spin">refresh</span>
                                                <span className="font-title-md text-title-md font-bold">Menyimpan ke Log HPP...</span>
                                            </div>
                                        ) : saveSuccess ? (
                                            <div className="flex items-center gap-space-sm mx-auto text-on-error">
                                                <span className="material-symbols-outlined text-[28px]">task_alt</span>
                                                <span className="font-title-md text-title-md font-bold">Log Waste Berhasil Dicatat!</span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-space-sm">
                                                    <div className="w-10 h-10 rounded-full bg-on-error/20 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-[24px]">delete_sweep</span>
                                                    </div>
                                                    <div className="flex flex-col text-left">
                                                        <span className="font-label-lg text-label-lg font-black tracking-wider uppercase">SIMPAN REKAP WASTE</span>
                                                        <span className="font-label-sm text-label-sm text-on-error/80">Kirim log ke database shift &amp; update persediaan bahan</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-title-lg text-title-lg font-black bg-on-error/15 px-3 py-1 rounded-full">{formattedLoss}</span>
                                                    <span className="material-symbols-outlined text-[22px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                                </div>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </section>

                            {/* KOLOM KANAN (Ringkasan Total) - Span 5 */}
                            <section className="lg:col-span-5 flex flex-col gap-space-md">
                                {/* Kartu Metrik Waste */}
                                <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-md">
                                    <div className="flex items-center justify-between pb-space-sm">
                                        <div>
                                            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Ringkasan Hari Ini</span>
                                            <h3 className="font-title-lg text-title-lg text-on-surface font-black">Total Biaya Kerusakan (Waste)</h3>
                                        </div>
                                        <span className="inline-flex items-center gap-1 bg-error-container text-on-error-container px-2.5 py-1 rounded-full font-label-md text-label-md font-extrabold shadow-sm">
                                            <span className="w-2 h-2 rounded-full bg-error"></span>
                                            3 Kejadian
                                        </span>
                                    </div>
                                    <div className="bg-surface-container-low rounded-lg p-4 my-space-xs flex items-baseline justify-between shadow-inner">
                                        <div>
                                            <span className="font-label-sm text-label-sm text-on-surface-variant block font-medium">Beban HPP Terbuang</span>
                                            <span className="font-num-display text-num-display text-error font-black tracking-tight leading-none">Rp 46.500</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-label-sm text-label-sm text-on-surface-variant block">Status Rasio</span>
                                            <span className="font-title-md text-title-md text-tertiary font-black">0.8% Omzet</span>
                                        </div>
                                    </div>
                                    <div className="mt-space-sm pt-2">
                                        <div className="flex items-center justify-between text-label-sm font-label-sm mb-1.5">
                                            <span className="text-on-surface-variant font-bold">Toleransi Waste Gerai:</span>
                                            <span className="text-tertiary font-black">0.8% / Batas Aman 1.5%</span>
                                        </div>
                                        <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden p-0.5">
                                            <div className="h-full bg-tertiary-container rounded-full transition-all duration-500" style={{width: '53%'}}></div>
                                        </div>
                                        <div className="flex justify-between items-center text-label-sm font-label-sm text-outline mt-1">
                                            <span>0% (Sempurna)</span>
                                            <span>1.0% (Waspada)</span>
                                            <span>1.5% (Maksimal)</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mt-space-sm pt-space-sm">
                                        <div className="bg-surface-container px-2.5 py-1 rounded-DEFAULT font-label-sm text-label-sm text-on-surface font-semibold flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-error"></span>
                                            1 Martabak Gosong
                                        </div>
                                        <div className="bg-surface-container px-2.5 py-1 rounded-DEFAULT font-label-sm text-label-sm text-on-surface font-semibold flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
                                            2 Telur Bebek Pecah
                                        </div>
                                        <div className="bg-surface-container px-2.5 py-1 rounded-DEFAULT font-label-sm text-label-sm text-on-surface font-semibold flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                                            0.5L Kuah Tumpah
                                        </div>
                                    </div>
                                </div>

                                {/* Daftar Log Waste */}
                                <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-md flex flex-col flex-1">
                                    <div className="flex items-center justify-between mb-space-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[20px] text-primary">history</span>
                                            <h3 className="font-title-md text-title-md text-on-surface font-bold">Log Masuk Hari Ini</h3>
                                        </div>
                                        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Auto-Sync Server</span>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[380px] pr-1">
                                        {history.length > 0 ? history.map((log) => (
                                            <div key={log.id} className="p-3 bg-surface-container-low rounded-DEFAULT flex items-start gap-3 shadow-sm hover:bg-surface-container transition-colors">
                                                <div className="w-14 h-14 rounded-DEFAULT bg-secondary-fixed flex items-center justify-center shrink-0 text-on-secondary-fixed shadow-inner">
                                                    <span className="material-symbols-outlined text-[26px]">delete</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-baseline justify-between gap-1">
                                                        <h4 className="font-title-md text-title-md text-on-surface font-bold truncate">{log.item_name}</h4>
                                                        <span className="font-label-lg text-label-lg text-error font-extrabold shrink-0">Rp {parseInt(log.loss_amount).toLocaleString('id-ID')}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-label-sm font-label-sm text-on-surface-variant mt-0.5">
                                                        <span className="font-semibold text-on-surface">{log.quantity} Unit</span>
                                                        <span>•</span>
                                                        <span>{new Date(log.created_at).toLocaleTimeString('id-ID', { hour12: false })} WIB</span>
                                                        <span>•</span>
                                                        <span className="bg-surface-container px-1.5 py-0.2 rounded font-medium">{log.user?.name || 'Sistem'}</span>
                                                    </div>
                                                    <p className="font-body-md text-body-md text-outline truncate mt-1">
                                                        Alasan: {log.reason} {log.notes && `(${log.notes})`}
                                                    </p>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="p-4 text-center text-on-surface-variant">Belum ada riwayat waste hari ini.</div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-auto pt-space-md">
                                        <button className="h-12 rounded-full bg-surface-container-low text-on-surface font-label-lg text-label-lg font-bold flex items-center justify-center gap-1.5 hover:bg-surface-container active:scale-95 transition-all shadow-sm" type="button">
                                            <span className="material-symbols-outlined text-[18px]">print</span>
                                            Cetak Rekap
                                        </button>
                                        <button className="h-12 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-lg text-label-lg font-bold flex items-center justify-center gap-1.5 hover:bg-secondary-fixed-dim active:scale-95 transition-all shadow-sm" type="button">
                                            <span className="material-symbols-outlined text-[18px]">send</span>
                                            Ekspor ke Spv
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
