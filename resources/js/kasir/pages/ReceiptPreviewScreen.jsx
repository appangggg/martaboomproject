import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PosHeader from '../components/layout/PosHeader';

export default function ReceiptPreviewScreen() {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('dual');
    const [isWaModalOpen, setIsWaModalOpen] = useState(false);
    const [waNumber, setWaNumber] = useState('81298765432');
    const [printStatus, setPrintStatus] = useState('');
    
    // Mock data based on HTML
    const mockOrder = {
        id: '042',
        orderId: 'ORD-20241023-042',
        type: 'Takeaway',
        time: '23/10/2024 19:42:15',
        cashier: 'Budi Santoso',
        total: 125400,
        tendered: 150000,
        change: 24600,
        subtotal: 114000,
        tax: 11400,
        items: [
            {
                qty: 1,
                name: 'Terang Bulan Red Velvet',
                price: 45000,
                notes: [
                    'Base: Red Velvet Adonan Istimewa',
                    'Topping: Keju Kraft Melimpah + SKM'
                ],
                kitchenNotes: [
                    'TOPPING: EKSTRA KEJU MELIMPAH',
                    'CATATAN: GULA SETENGAH SAJA! (LESS SUGAR)'
                ]
            },
            {
                qty: 1,
                name: 'Martabak Telur Spesial Sapi',
                price: 55000,
                notes: [
                    'Daging Cincang Sapi Rempah (3 Telur Bebek)',
                    'Tingkat Pedas: Sedang (Daun Bawang Fresh)'
                ],
                kitchenNotes: [
                    '3 TELUR BEBEK • PEDAS SEDANG',
                    'CATATAN: EXTRA KUAH CUKO & ACAR TIMUN'
                ]
            },
            {
                qty: 2,
                name: 'Es Teh Manis Jumbo',
                price: 14000,
                notes: [
                    '@ Rp 7.000 (Gula Pasir Asli Wangi Melati)'
                ],
                kitchenNotes: [
                    '[BAR MINUMAN] LESS SUGAR / DINGIN MAKSIMAL'
                ]
            }
        ]
    };

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID').format(number);

    const showNotification = (msg) => {
        setPrintStatus(msg);
        setTimeout(() => setPrintStatus(''), 3000);
    };

    const handlePrintSingle = (target) => {
        showNotification(`Mencetak ${target} ke Epson TM-T82...`);
    };

    const handlePrintBoth = () => {
        showNotification('Mencetak 2 Lembar (Struk + KOT Dapur)... Berhasil!');
    };

    const handleTestFeed = () => {
        showNotification('Uji feeder Epson TM-T82: Kertas terpotong rapi.');
    };

    const handleSendWa = () => {
        setIsWaModalOpen(false);
        showNotification(`E-Receipt berhasil dikirim via WhatsApp ke +62${waNumber}`);
    };

    return (
        <div className="bg-background font-body-md text-on-surface antialiased min-h-screen select-none">
            <PosHeader />
            
            <main className="w-full pt-20 bg-background pb-32">
                <div className="flex flex-col w-full">
                    {/* Interactive & Printing Container */}
                    <div className="w-full max-w-[1400px] mx-auto p-space-md lg:p-space-lg flex flex-col gap-space-md">
                        {/* Top Action & Hardware Diagnostic Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-2xl shadow-sm">
                            <div className="flex items-center gap-space-md">
                                <button onClick={() => navigate('/order')} className="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg transition-all active:scale-95 shadow-sm" type="button">
                                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                                    <span>Kembali ke Kasir</span>
                                </button>
                                <div className="hidden sm:flex flex-col">
                                    <span className="font-headline-md text-headline-md text-on-surface">Preview &amp; Cetak Tiket</span>
                                    <span className="font-label-sm text-label-sm text-on-surface-variant">Order ID: #{mockOrder.orderId} • Siap Disalurkan</span>
                                </div>
                            </div>
                            {/* Printer Diagnostic Card */}
                            <div className="flex items-center gap-space-md bg-surface-container-low px-space-md py-2 rounded-xl shadow-inner">
                                <div className="w-9 h-9 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary shadow-sm">
                                    <span className="material-symbols-outlined text-[22px]">print</span>
                                </div>
                                <div className="flex flex-col text-left">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                                        <span className="font-label-md text-label-md text-on-surface font-bold">Epson TM-T82 (Bluetooth)</span>
                                    </div>
                                    <span className="font-label-sm text-label-sm text-tertiary font-bold">Tersambung • Siap Cetak (Roll 80mm: 92%)</span>
                                </div>
                                <button onClick={handleTestFeed} className="p-2 rounded-full bg-surface hover:bg-surface-container text-on-surface-variant transition-colors active:scale-90 ml-1" title="Feed & Test Cut" type="button">
                                    <span className="material-symbols-outlined text-[18px]">sync</span>
                                </button>
                            </div>
                        </div>

                        {/* Mode Selector Tab */}
                        <div className="flex items-center justify-between bg-surface-container-low p-1.5 rounded-full shadow-inner max-w-xl mx-auto w-full">
                            <button onClick={() => setViewMode('dual')} className={`flex-1 py-2.5 px-space-md rounded-full font-label-lg text-label-lg transition-all text-center flex items-center justify-center gap-2 ${viewMode === 'dual' ? 'bg-primary-container text-on-primary shadow-sm font-bold' : 'text-on-surface-variant hover:text-on-surface font-semibold'}`} type="button">
                                <span className="material-symbols-outlined text-[18px]">splitscreen</span>
                                <span className="hidden sm:inline">Dual-View (Berdampingan)</span>
                                <span className="sm:hidden">Dual</span>
                            </button>
                            <button onClick={() => setViewMode('customer')} className={`flex-1 py-2.5 px-space-md rounded-full font-label-lg text-label-lg transition-all text-center flex items-center justify-center gap-2 ${viewMode === 'customer' ? 'bg-primary-container text-on-primary shadow-sm font-bold' : 'text-on-surface-variant hover:text-on-surface font-semibold'}`} type="button">
                                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                                <span className="hidden sm:inline">Struk Pelanggan</span>
                                <span className="sm:hidden">Struk</span>
                            </button>
                            <button onClick={() => setViewMode('kitchen')} className={`flex-1 py-2.5 px-space-md rounded-full font-label-lg text-label-lg transition-all text-center flex items-center justify-center gap-2 ${viewMode === 'kitchen' ? 'bg-primary-container text-on-primary shadow-sm font-bold' : 'text-on-surface-variant hover:text-on-surface font-semibold'}`} type="button">
                                <span className="material-symbols-outlined text-[18px]">skillet</span>
                                <span className="hidden sm:inline">Tiket Dapur (KOT)</span>
                                <span className="sm:hidden">KOT</span>
                            </button>
                        </div>

                        {/* DUAL PREVIEW THERMAL SHEETS CONTAINER */}
                        <div className={`grid grid-cols-1 ${viewMode === 'dual' ? 'lg:grid-cols-2' : ''} gap-space-lg items-start justify-center pb-space-lg`}>
                            
                            {/* LEFT: STRUK THERMAL PELANGGAN */}
                            {(viewMode === 'dual' || viewMode === 'customer') && (
                                <div className={`w-full flex flex-col items-center ${viewMode !== 'dual' ? 'mx-auto' : ''}`}>
                                    {/* Visual Badge */}
                                    <div className="w-full max-w-[400px] flex items-center justify-between px-space-sm mb-2">
                                        <div className="flex items-center gap-1.5 text-on-surface-variant font-label-md">
                                            <span className="material-symbols-outlined text-[18px] text-primary">receipt_long</span>
                                            <span className="font-bold">Struk Pelanggan (Format 80mm)</span>
                                        </div>
                                        <span className="bg-surface-container px-2.5 py-0.5 rounded-full font-label-sm text-on-surface-variant">Kertas Putih Standard</span>
                                    </div>
                                    
                                    {/* Thermal Paper Simulation Container */}
                                    <div className="w-full max-w-[400px] relative filter drop-shadow-[0_12px_24px_rgba(62,35,19,0.12)] transition-transform hover:-translate-y-0.5">
                                        {/* Torn Paper Zigzag Top Decoration */}
                                        <div className="w-full h-3 bg-surface-container-lowest" style={{clipPath: 'polygon(0% 100%, 2% 0%, 4% 100%, 6% 0%, 8% 100%, 10% 0%, 12% 100%, 14% 0%, 16% 100%, 18% 0%, 20% 100%, 22% 0%, 24% 100%, 26% 0%, 28% 100%, 30% 0%, 32% 100%, 34% 0%, 36% 100%, 38% 0%, 40% 100%, 42% 0%, 44% 100%, 46% 0%, 48% 100%, 50% 0%, 52% 100%, 54% 0%, 56% 100%, 58% 0%, 60% 100%, 62% 0%, 64% 100%, 66% 0%, 68% 100%, 70% 0%, 72% 100%, 74% 0%, 76% 100%, 78% 0%, 80% 100%, 82% 0%, 84% 100%, 86% 0%, 88% 100%, 90% 0%, 92% 100%, 94% 0%, 96% 100%, 98% 0%, 100% 100%)'}}></div>
                                        
                                        {/* Printable Thermal Body */}
                                        <div className="bg-surface-container-lowest px-6 py-5 text-on-surface flex flex-col font-mono text-[13px] leading-relaxed select-text">
                                            {/* Store Header */}
                                            <div className="flex flex-col items-center text-center pb-3">
                                                <img alt="Martaboom POS Brand Logo" className="h-10 w-auto object-contain grayscale contrast-150 mb-1" src="https://lh3.googleusercontent.com/aida/AEtjO1UQOtaXm8ZM52PSH8kPJRElEQ_Pfy3dgMMn-fyZ8_Rmt1Pl1XQb0uJaBCrQZaRKYTYCwM8uINgZNZxHiJ_oRP_bwkA6ii_s5uBI8Rxf2Ujl6GE-kQKJAyvJZs7j0LsKlUVro8V50X1Fy0oulYAUbtFov8LvgbbRP76m3-wUBu5JzvZ08fll8tLrYcPRliuBNaxOPrt0lXNe7IXrsZyqINLBqo_nan54NHiuG69MqmtTQPsUeHyi4aJUGrU" />
                                                <span className="font-bold tracking-tight text-[15px] font-headline-md uppercase">Martaboom Martabak &amp; Terang Bulan</span>
                                                <span className="text-[11px] text-on-surface-variant font-medium">Cabang Tebet Barat, Jakarta Selatan</span>
                                                <span className="text-[11px] text-on-surface-variant font-medium">WhatsApp Kasir: 0812-3456-7890</span>
                                            </div>
                                            
                                            {/* Receipt Divider Dot-Dash */}
                                            <div className="w-full text-center tracking-widest text-on-surface-variant/40 select-none overflow-hidden my-1">
                                                - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                                            </div>
                                            
                                            {/* Queue Box Hero */}
                                            <div className="bg-surface-container-low p-2.5 my-2 rounded-xl text-center flex flex-col items-center">
                                                <span className="font-label-sm uppercase tracking-wider text-on-surface-variant">Nomor Antrean Pelanggan</span>
                                                <span className="font-num-display text-[44px] leading-none text-on-surface font-extrabold tracking-tight my-1">#{mockOrder.id}</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="bg-primary text-on-primary font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Bawa Pulang ({mockOrder.type})</span>
                                                </div>
                                            </div>
                                            
                                            {/* Transaction Metadata */}
                                            <div className="text-[11px] text-on-surface-variant flex flex-col gap-0.5 my-1.5 pb-2">
                                                <div className="flex justify-between">
                                                    <span>Waktu: {mockOrder.time}</span>
                                                    <span>Reg: POS-01</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Kasir: {mockOrder.cashier}</span>
                                                    <span>Slip: TR-982104</span>
                                                </div>
                                            </div>
                                            
                                            {/* Divider */}
                                            <div className="w-full text-center tracking-widest text-on-surface-variant/40 select-none overflow-hidden my-1">
                                                ========================================
                                            </div>
                                            
                                            {/* Line Items */}
                                            <div className="flex flex-col gap-3 my-2">
                                                {mockOrder.items.map((item, idx) => (
                                                    <div key={idx} className="flex flex-col">
                                                        <div className="flex justify-between font-bold text-on-surface">
                                                            <span className="truncate pr-2">{item.qty}x {item.name}</span>
                                                            <span className="shrink-0 font-mono">{formatRupiah(item.price)}</span>
                                                        </div>
                                                        {item.notes.map((note, nIdx) => (
                                                            <div key={nIdx} className="text-[11px] text-on-surface-variant pl-3">
                                                                + {note}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {/* Divider */}
                                            <div className="w-full text-center tracking-widest text-on-surface-variant/40 select-none overflow-hidden my-1">
                                                ----------------------------------------
                                            </div>
                                            
                                            {/* Calculation Subtotal */}
                                            <div className="flex flex-col gap-1 text-[12px] my-1">
                                                <div className="flex justify-between">
                                                    <span className="text-on-surface-variant">Subtotal Pesanan</span>
                                                    <span className="font-mono">Rp {formatRupiah(mockOrder.subtotal)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-on-surface-variant">PB1 Resto (10%)</span>
                                                    <span className="font-mono">Rp {formatRupiah(mockOrder.tax)}</span>
                                                </div>
                                                <div className="flex justify-between font-extrabold text-[15px] pt-1.5 text-on-surface">
                                                    <span>TOTAL AKHIR</span>
                                                    <span className="font-mono text-primary-container">Rp {formatRupiah(mockOrder.total)}</span>
                                                </div>
                                            </div>
                                            
                                            {/* Payment Summary */}
                                            <div className="w-full text-center tracking-widest text-on-surface-variant/40 select-none overflow-hidden my-1">
                                                - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                                            </div>
                                            <div className="flex flex-col gap-1 text-[11px] my-1 bg-surface-container-low p-2 rounded-lg">
                                                <div className="flex justify-between font-semibold">
                                                    <span>TUNAI DITERIMA:</span>
                                                    <span className="font-mono">Rp {formatRupiah(mockOrder.tendered)}</span>
                                                </div>
                                                <div className="flex justify-between font-bold text-tertiary">
                                                    <span>KEMBALIAN:</span>
                                                    <span className="font-mono">Rp {formatRupiah(mockOrder.change)}</span>
                                                </div>
                                            </div>
                                            
                                            {/* QR Code Static Mini & Feedback Link */}
                                            <div className="flex flex-col items-center justify-center pt-4 pb-2 text-center">
                                                <div className="p-2 bg-surface-container-lowest rounded-md shadow-sm mb-1.5 flex items-center justify-center">
                                                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 100 100">
                                                        <rect fill="#2d1507" height="28" rx="2" width="28" x="10" y="10"></rect>
                                                        <rect fill="#ffffff" height="16" rx="1" width="16" x="16" y="16"></rect>
                                                        <rect fill="#2d1507" height="8" rx="1" width="8" x="20" y="20"></rect>
                                                        <rect fill="#2d1507" height="28" rx="2" width="28" x="62" y="10"></rect>
                                                        <rect fill="#ffffff" height="16" rx="1" width="16" x="68" y="16"></rect>
                                                        <rect fill="#2d1507" height="8" rx="1" width="8" x="72" y="20"></rect>
                                                        <rect fill="#2d1507" height="28" rx="2" width="28" x="10" y="62"></rect>
                                                        <rect fill="#ffffff" height="16" rx="1" width="16" x="16" y="68"></rect>
                                                        <rect fill="#2d1507" height="8" rx="1" width="8" x="20" y="72"></rect>
                                                        <rect fill="#2d1507" height="6" width="6" x="42" y="12"></rect>
                                                        <rect fill="#2d1507" height="6" width="6" x="52" y="18"></rect>
                                                        <rect fill="#2d1507" height="6" width="6" x="42" y="30"></rect>
                                                        <rect fill="#2d1507" height="6" width="6" x="50" y="30"></rect>
                                                        <rect fill="#2d1507" height="6" width="6" x="12" y="44"></rect>
                                                        <rect fill="#2d1507" height="6" width="6" x="24" y="44"></rect>
                                                        <rect fill="#2d1507" height="6" width="6" x="34" y="44"></rect>
                                                        <rect fill="#2d1507" height="6" width="12" x="44" y="44"></rect>
                                                        <rect fill="#2d1507" height="6" width="6" x="64" y="44"></rect>
                                                        <rect fill="#2d1507" height="6" width="14" x="76" y="44"></rect>
                                                        <rect fill="#2d1507" height="6" width="6" x="12" y="52"></rect>
                                                        <rect fill="#2d1507" height="8" width="8" x="30" y="52"></rect>
                                                        <rect fill="#2d1507" height="8" width="8" x="46" y="54"></rect>
                                                        <rect fill="#2d1507" height="6" width="6" x="60" y="52"></rect>
                                                        <rect fill="#2d1507" height="8" width="8" x="72" y="54"></rect>
                                                        <rect fill="#2d1507" height="6" width="6" x="42" y="68"></rect>
                                                        <rect fill="#2d1507" height="6" width="6" x="52" y="74"></rect>
                                                        <rect fill="#2d1507" height="6" width="8" x="42" y="82"></rect>
                                                        <rect fill="#2d1507" height="6" width="6" x="62" y="66"></rect>
                                                        <rect fill="#2d1507" height="8" width="8" x="74" y="68"></rect>
                                                        <rect fill="#2d1507" height="8" width="8" x="66" y="82"></rect>
                                                        <rect fill="#2d1507" height="8" width="10" x="80" y="82"></rect>
                                                    </svg>
                                                </div>
                                                <span className="font-bold text-[11px] text-on-surface">Scan untuk Promo &amp; Follow IG</span>
                                                <span className="text-[10px] text-on-surface-variant font-medium">@martaboom.id • Wi-Fi: Martaboom_Guest</span>
                                            </div>
                                            
                                            {/* Thermal Greeting Footer */}
                                            <div className="text-center pt-2 pb-1">
                                                <p className="font-label-md text-label-md font-bold italic text-on-surface">"Matur Nuwun! Martabak Hangat, Hati Senang."</p>
                                                <p className="text-[9px] text-on-surface-variant/70 mt-1 uppercase tracking-widest">*** SIMPAN STRUK SEBAGAI BUKTI AMBIL ***</p>
                                            </div>
                                        </div>
                                        {/* Torn Paper Zigzag Bottom Decoration */}
                                        <div className="w-full h-3 bg-surface-container-lowest" style={{clipPath: 'polygon(0% 0%, 2% 100%, 4% 0%, 6% 100%, 8% 0%, 10% 100%, 12% 0%, 14% 100%, 16% 0%, 18% 100%, 20% 0%, 22% 100%, 24% 0%, 26% 100%, 28% 0%, 30% 100%, 32% 0%, 34% 100%, 36% 0%, 38% 100%, 40% 0%, 42% 100%, 44% 0%, 46% 100%, 48% 0%, 50% 100%, 52% 0%, 54% 100%, 56% 0%, 58% 100%, 60% 0%, 62% 100%, 64% 0%, 66% 100%, 68% 0%, 70% 100%, 72% 0%, 74% 100%, 76% 0%, 78% 100%, 80% 0%, 82% 100%, 84% 0%, 86% 100%, 88% 0%, 90% 100%, 92% 0%, 94% 100%, 96% 0%, 98% 100%, 100% 0%)'}}></div>
                                    </div>
                                    
                                    {/* Single Print Action Button */}
                                    <button onClick={() => handlePrintSingle('Struk Pelanggan')} className="mt-4 w-full max-w-[400px] h-14 bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-lg rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95" type="button">
                                        <span className="material-symbols-outlined text-primary text-[22px]">print</span>
                                        <span>Cetak Struk Pelanggan</span>
                                    </button>
                                </div>
                            )}

                            {/* RIGHT: TIKET DAPUR / KOT KOKI */}
                            {(viewMode === 'dual' || viewMode === 'kitchen') && (
                                <div className={`w-full flex flex-col items-center ${viewMode !== 'dual' ? 'mx-auto' : ''}`}>
                                    {/* Visual Badge */}
                                    <div className="w-full max-w-[400px] flex items-center justify-between px-space-sm mb-2">
                                        <div className="flex items-center gap-1.5 text-on-surface font-label-md">
                                            <span className="material-symbols-outlined text-[18px] text-tertiary">skillet</span>
                                            <span className="font-bold">Tiket Dapur (KOT / Kitchen Ticket)</span>
                                        </div>
                                        <span className="bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded-full font-label-sm font-black">KHUSUS KOKI</span>
                                    </div>
                                    
                                    {/* Kitchen Thermal Paper Sheet */}
                                    <div className="w-full max-w-[400px] relative filter drop-shadow-[0_12px_24px_rgba(62,35,19,0.12)] transition-transform hover:-translate-y-0.5">
                                        {/* Torn Paper Zigzag Top Decoration */}
                                        <div className="w-full h-3 bg-surface-container-lowest" style={{clipPath: 'polygon(0% 100%, 2% 0%, 4% 100%, 6% 0%, 8% 100%, 10% 0%, 12% 100%, 14% 0%, 16% 100%, 18% 0%, 20% 100%, 22% 0%, 24% 100%, 26% 0%, 28% 100%, 30% 0%, 32% 100%, 34% 0%, 36% 100%, 38% 0%, 40% 100%, 42% 0%, 44% 100%, 46% 0%, 48% 100%, 50% 0%, 52% 100%, 54% 0%, 56% 100%, 58% 0%, 60% 100%, 62% 0%, 64% 100%, 66% 0%, 68% 100%, 70% 0%, 72% 100%, 74% 0%, 76% 100%, 78% 0%, 80% 100%, 82% 0%, 84% 100%, 86% 0%, 88% 100%, 90% 0%, 92% 100%, 94% 0%, 96% 100%, 98% 0%, 100% 100%)'}}></div>
                                        
                                        {/* High-Contrast Kitchen Thermal Body */}
                                        <div className="bg-surface-container-lowest px-6 py-6 text-on-surface flex flex-col font-mono select-text">
                                            {/* Inverted Bold KOT Header Box */}
                                            <div className="bg-inverse-surface text-inverse-on-surface p-4 rounded-xl text-center flex flex-col items-center">
                                                <span className="text-[14px] font-black tracking-widest uppercase">TIKET DAPUR UTAMA</span>
                                                <div className="flex items-center justify-center gap-2 my-1">
                                                    <span className="font-num-display text-[46px] leading-none font-black text-secondary-container tracking-tight">KOT #{mockOrder.id}</span>
                                                </div>
                                                <div className="flex items-center justify-between w-full pt-2 mt-1 text-[12px] font-bold">
                                                    <span>JAM: 19:42 WIB</span>
                                                    <span className="bg-primary-container text-on-primary px-2 py-0.5 rounded text-[11px] tracking-wider uppercase">TAKEAWAY</span>
                                                </div>
                                            </div>
                                            
                                            {/* Warning Notice for Kitchen */}
                                            <div className="bg-surface-container-high px-3 py-1.5 my-3 rounded-lg text-center font-sans">
                                                <span className="font-label-sm text-error font-extrabold tracking-wide uppercase flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined text-[15px]">priority_high</span>
                                                    Prioritas Antrean Ramai (Order ke-3)
                                                </span>
                                            </div>
                                            
                                            <div className="w-full text-center tracking-widest text-on-surface-variant/40 select-none overflow-hidden my-1">
                                                ========================================
                                            </div>
                                            
                                            {/* Kitchen Jumbo Items with Chef Checkboxes */}
                                            <div className="flex flex-col gap-5 my-2">
                                                {mockOrder.items.map((item, idx) => (
                                                    <div key={idx} className="flex items-start gap-3">
                                                        <ChefCheckbox />
                                                        <div className="flex flex-col w-full">
                                                            <span className="font-display-md text-[20px] leading-tight font-black text-on-surface tracking-tight uppercase">
                                                                {item.qty}x {item.name}
                                                            </span>
                                                            <div className="mt-1.5 pl-2 space-y-1">
                                                                {item.kitchenNotes.map((note, nIdx) => (
                                                                    <div key={nIdx} className={`${note.includes('CATATAN:') ? (note.includes('GULA') ? 'bg-error-container/40 text-on-error-container' : 'bg-secondary-fixed text-on-secondary-fixed') : 'flex items-center gap-1.5 text-[13px] font-bold text-on-surface'}`}>
                                                                        {note.includes('CATATAN:') ? (
                                                                            <div className="px-2 py-0.5 rounded font-black text-[12px] inline-block tracking-wide">
                                                                                {note}
                                                                            </div>
                                                                        ) : (
                                                                            <>
                                                                                {note.startsWith('[BAR') ? null : <span className="text-primary font-black">▶</span>}
                                                                                <span className={note.startsWith('[BAR') ? "text-[12px] font-bold text-tertiary" : ""}>{note}</span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {/* Divider */}
                                            <div className="w-full text-center tracking-widest text-on-surface-variant/40 select-none overflow-hidden my-2">
                                                ----------------------------------------
                                            </div>
                                            
                                            {/* Station Dispatch Footer */}
                                            <div className="flex items-center justify-between text-[11px] text-on-surface-variant font-sans pt-1">
                                                <span>Station: Griddle 1 + Martabak Pan</span>
                                                <span className="font-bold text-on-surface">Total: 3 Item Menu</span>
                                            </div>
                                            <div className="text-center font-bold text-[10px] text-on-surface-variant/60 uppercase tracking-widest pt-2">
                                                *** KERTAS KERJA DAPUR - TANPA TAGIHAN ***
                                            </div>
                                        </div>
                                        {/* Torn Paper Zigzag Bottom Decoration */}
                                        <div className="w-full h-3 bg-surface-container-lowest" style={{clipPath: 'polygon(0% 0%, 2% 100%, 4% 0%, 6% 100%, 8% 0%, 10% 100%, 12% 0%, 14% 100%, 16% 0%, 18% 100%, 20% 0%, 22% 100%, 24% 0%, 26% 100%, 28% 0%, 30% 100%, 32% 0%, 34% 100%, 36% 0%, 38% 100%, 40% 0%, 42% 100%, 44% 0%, 46% 100%, 48% 0%, 50% 100%, 52% 0%, 54% 100%, 56% 0%, 58% 100%, 60% 0%, 62% 100%, 64% 0%, 66% 100%, 68% 0%, 70% 100%, 72% 0%, 74% 100%, 76% 0%, 78% 100%, 80% 100%, 82% 0%, 84% 100%, 86% 0%, 88% 100%, 90% 0%, 92% 100%, 94% 0%, 96% 100%, 98% 0%, 100% 0%)'}}></div>
                                    </div>
                                    
                                    {/* Single Print Action Button */}
                                    <button onClick={() => handlePrintSingle('Tiket Dapur (KOT)')} className="mt-4 w-full max-w-[400px] h-14 bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-lg rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95" type="button">
                                        <span className="material-symbols-outlined text-tertiary text-[22px]">print</span>
                                        <span>Cetak Tiket KOT Dapur</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* PERSISTENT BOTTOM CONTROL DOCK */}
            <div className="fixed bottom-4 left-0 right-0 z-40 w-full max-w-[1280px] mx-auto bg-surface-container-lowest/95 backdrop-blur-md p-3 sm:p-4 rounded-3xl shadow-[0_12px_36px_-6px_rgba(70,42,25,0.18)]">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md">
                    {/* Quick Feedback Message / Status Toast */}
                    <div className={`hidden sm:flex items-center gap-2 px-space-md py-2 rounded-full bg-surface-container text-on-surface font-label-md transition-opacity duration-300 ${printStatus ? 'opacity-100 animate-bounce' : 'opacity-0'}`}>
                        <span className="material-symbols-outlined text-tertiary text-[20px]">check_circle</span>
                        <span>{printStatus || 'Menunggu print...'}</span>
                    </div>
                    
                    {/* Touch-First Massive Action Cluster */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-end gap-space-sm w-full sm:w-auto">
                        <button onClick={() => setIsWaModalOpen(true)} className="h-14 px-space-lg rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-lg flex items-center gap-2 transition-all active:scale-95 shadow-sm" type="button">
                            <span className="material-symbols-outlined text-tertiary text-[22px]">send</span>
                            <span>Kirim WhatsApp / E-Receipt</span>
                        </button>
                        
                        <button onClick={handlePrintBoth} className="h-[60px] px-space-xl rounded-full bg-primary-container text-on-primary font-headline-md text-[17px] flex items-center gap-space-sm shadow-[0_4px_16px_rgba(217,142,63,0.45)] hover:bg-primary transition-all active:scale-95" type="button">
                            <span className="material-symbols-outlined text-[24px]">receipt</span>
                            <span>Cetak Keduanya Sekaligus</span>
                        </button>
                        
                        <button onClick={() => navigate('/order')} className="h-14 px-space-lg rounded-full bg-tertiary hover:bg-tertiary-container text-on-tertiary font-label-lg flex items-center gap-2 transition-all active:scale-95 shadow-[0_4px_14px_rgba(73,103,41,0.3)]" type="button">
                            <span className="material-symbols-outlined text-[22px]">add_task</span>
                            <span>Selesai &amp; Pesanan Baru</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL: WHATSAPP / E-RECEIPT INPUT POPUP */}
            {isWaModalOpen && (
                <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-space-md">
                    <div className="w-full max-w-md bg-surface-container-lowest p-space-lg rounded-3xl shadow-[0_20px_40px_rgba(70,42,25,0.25)] flex flex-col gap-space-md animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[24px]">sms</span>
                                </div>
                                <div>
                                    <h3 className="font-headline-md text-headline-md text-on-surface">Kirim E-Receipt</h3>
                                    <p className="font-label-sm text-on-surface-variant">Kirim tautan struk resmi via WhatsApp</p>
                                </div>
                            </div>
                            <button onClick={() => setIsWaModalOpen(false)} className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface" type="button">
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>
                        <div className="flex flex-col gap-1.5 mt-1">
                            <label className="font-label-md text-label-md text-on-surface font-bold">Nomor Handphone Pelanggan:</label>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 font-bold text-on-surface-variant text-[15px]">+62</span>
                                <input 
                                    value={waNumber}
                                    onChange={(e) => setWaNumber(e.target.value)}
                                    className="w-full h-14 pl-14 pr-4 bg-surface-container-low rounded-2xl text-on-surface font-title-lg focus:outline-none focus:ring-2 focus:ring-primary-container" 
                                    placeholder="8xxxxxxxxxx" 
                                    type="tel" 
                                />
                            </div>
                        </div>
                        <div className="bg-surface-container p-3 rounded-xl text-[12px] text-on-surface-variant">
                            Tautan e-receipt digital memuat nomor antrean <strong>#{mockOrder.id}</strong> dan detail pembayaran Rp {formatRupiah(mockOrder.total)} dengan verifikasi QR code instan.
                        </div>
                        <div className="flex items-center gap-space-sm pt-2">
                            <button onClick={() => setIsWaModalOpen(false)} className="flex-1 h-12 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg" type="button">
                                Batal
                            </button>
                            <button onClick={handleSendWa} className="flex-1 h-12 rounded-full bg-tertiary text-on-tertiary font-label-lg flex items-center justify-center gap-1 shadow-md active:scale-95 transition-transform" type="button">
                                <span className="material-symbols-outlined text-[18px]">send</span>
                                <span>Kirim Sekarang</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ChefCheckbox() {
    const [isChecked, setIsChecked] = useState(false);
    return (
        <button 
            onClick={() => setIsChecked(!isChecked)} 
            className={`w-7 h-7 mt-0.5 rounded-lg flex items-center justify-center shrink-0 active:scale-90 transition-transform shadow-inner ${isChecked ? 'bg-tertiary-fixed' : 'bg-surface-container-low'}`} 
            type="button"
        >
            <span className={`material-symbols-outlined text-[20px] text-tertiary ${isChecked ? 'opacity-100' : 'opacity-0'}`}>check</span>
        </button>
    );
}
