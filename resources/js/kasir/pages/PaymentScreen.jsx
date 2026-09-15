import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PosHeader from '../components/layout/PosHeader';
import apiClient from '../utils/apiClient';

export default function PaymentScreen() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Fallback if accessed directly without cart
    const state = location.state || { cartItems: [], subtotal: 0, tax: 0, total: 0 };
    const { cartItems, subtotal, tax, total: totalDue } = state;

    const [currentTime, setCurrentTime] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('tunai');
    const [tenderedAmount, setTenderedAmount] = useState(totalDue);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const d = new Date();
            setCurrentTime(d.toLocaleTimeString('id-ID', { hour12: false }) + ' WIB');
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID').format(number);

    const change = tenderedAmount - totalDue;

    const handleDigitClick = (digit) => {
        let str = tenderedAmount.toString();
        if (str === '0' || str === '150000') {
            str = digit;
        } else {
            str += digit;
        }
        if (str.length > 9) return;
        setTenderedAmount(parseInt(str, 10) || 0);
    };

    const handleClearInput = () => {
        setTenderedAmount(0);
    };

    const handleQuickCash = (amount) => {
        setTenderedAmount(amount);
    };

    const handleSwitchMethod = (method) => {
        setPaymentMethod(method);
        if (method !== 'tunai' && method !== 'qris') {
            setTenderedAmount(totalDue);
        }
    };

    const handleProcessPayment = async () => {
        if (paymentMethod === 'tunai' && tenderedAmount < totalDue) {
            alert(`Jumlah uang yang diterima kurang dari total tagihan (Rp ${formatRupiah(totalDue)})!`);
            return;
        }
        
        setIsProcessing(true);
        
        try {
            const payload = {
                branch_id: 1, // default branch for now
                user_id: 1, // default user for now
                subtotal: subtotal,
                tax_amount: tax,
                discount_amount: 0,
                total: totalDue,
                payment_method: paymentMethod,
                payment_amount: tenderedAmount,
                items: cartItems.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    unit_price: item.price,
                    subtotal: item.price * item.quantity
                }))
            };

            const response = await apiClient.post('/transactions', payload);
            
            if (response.status === 'success') {
                const kembalian = formatRupiah(tenderedAmount - totalDue);
                alert(`TRANSAKSI BERHASIL!\n\nNomor Antrean: ${response.data.queue_number}\nTotal Tagihan: Rp ${formatRupiah(totalDue)}\nUang Diterima: Rp ${formatRupiah(tenderedAmount)}\nKembalian: Rp ${kembalian}\n\nStruk Tercetak & Laci Kasir Terbuka.`);
                // Return to order screen
                navigate('/order');
            } else {
                alert('Gagal memproses transaksi: ' + response.message);
            }
        } catch (error) {
            alert('Terjadi kesalahan jaringan/server saat memproses transaksi.');
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-background font-body-md text-on-surface antialiased min-h-screen select-none">
            <PosHeader />
            
            <main className="w-full pt-20 bg-background">
                <div className="flex flex-col w-full">
                    <div className="w-full max-w-[1600px] mx-auto p-space-md lg:p-space-lg flex flex-col gap-space-md">
                        {/* Header Bar Modul Pembayaran */}
                        <div className="flex items-center justify-between bg-surface-container-low px-space-lg py-space-sm rounded-lg shadow-sm">
                            <div className="flex items-center gap-space-sm">
                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-on-primary shadow-sm">
                                    <span className="material-symbols-outlined text-[22px]">point_of_sale</span>
                                </span>
                                <div>
                                    <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">Modul Pembayaran Kasir</span>
                                    <h1 className="font-headline-md text-headline-md text-on-surface font-extrabold leading-none">Penyelesaian Transaksi Tablet</h1>
                                </div>
                            </div>
                            <div className="flex items-center gap-space-md">
                                <div className="flex items-center gap-space-xs bg-surface-container-highest px-space-md py-1.5 rounded-full">
                                    <span className="material-symbols-outlined text-tertiary text-[18px]">verified_user</span>
                                    <span className="font-label-md text-label-md text-on-surface font-semibold">Integrasi EDC &amp; QRIS Aktif</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-label-md">
                                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                                    <span>{currentTime}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
                            {/* KOLOM KIRI (38% ~ 5-col pada 12-grid system) */}
                            <section className="lg:col-span-5 flex flex-col gap-space-md bg-surface-container-lowest p-space-lg rounded-lg shadow-md">
                                <div className="flex items-start justify-between bg-surface-container-low p-space-md rounded-DEFAULT">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-secondary-fixed text-on-secondary-fixed font-title-lg text-title-lg px-2.5 py-0.5 rounded-full font-black">#042</span>
                                            <span className="bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">Takeaway</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-2 text-on-surface-variant font-label-md text-label-md">
                                            <span className="material-symbols-outlined text-[16px]">badge</span>
                                            <span>Kasir: <strong>Budi Santoso</strong></span>
                                            <span className="text-outline-variant">•</span>
                                            <span>Pos 01</span>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-1 px-space-sm py-1.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md transition-all active:scale-95 shadow-sm" type="button">
                                        <span className="material-symbols-outlined text-[18px]">edit_note</span>
                                        <span>Ubah</span>
                                    </button>
                                </div>

                                <div className="flex flex-col gap-space-sm divide-y-0">
                                    <div className="flex items-center justify-between pb-1">
                                        <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Rincian Menu ({cartItems.length} Item)</span>
                                        <span className="font-label-sm text-label-sm text-primary font-bold">Dapur: Sedang Dibuat</span>
                                    </div>
                                    
                                    {cartItems.map((item, index) => (
                                        <div key={index} className="flex items-start justify-between bg-surface-container-low p-space-md rounded-DEFAULT">
                                            <div className="flex gap-space-sm">
                                                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary-fixed text-on-primary-fixed font-title-md text-title-md font-extrabold shrink-0 mt-0.5">{item.quantity}</span>
                                                <div className="flex flex-col">
                                                    <h2 className="font-title-md text-title-md text-on-surface font-bold leading-snug">{item.name}</h2>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <span className="inline-block w-2 h-2 rounded-full bg-primary-container"></span>
                                                        <p className="font-label-sm text-label-sm text-on-surface-variant font-medium">{item.modifiers || 'Standar'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="font-title-md text-title-md text-on-surface font-extrabold tabular-nums">Rp {formatRupiah(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-surface-container-low p-space-md rounded-DEFAULT flex flex-col gap-2 mt-1">
                                    <div className="flex justify-between items-center text-on-surface-variant font-label-md text-label-md">
                                        <span>Subtotal Tagihan</span>
                                        <span className="font-title-md text-title-md text-on-surface font-bold tabular-nums">Rp {formatRupiah(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-on-surface-variant font-label-md text-label-md">
                                        <span className="flex items-center gap-1">
                                            <span>PB1 Restoran (10%)</span>
                                            <span className="material-symbols-outlined text-[14px] text-outline" title="Pajak Daerah Resmi">info</span>
                                        </span>
                                        <span className="font-title-md text-title-md text-on-surface font-bold tabular-nums">Rp {formatRupiah(tax)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-on-surface-variant font-label-md text-label-md">
                                        <span>Diskon Promo Tebet Mantap</span>
                                        <span className="font-title-md text-title-md text-tertiary font-bold tabular-nums">- Rp 0</span>
                                    </div>
                                </div>

                                {/* Box TOTAL TAGIHAN GIGANTIS */}
                                <div className="relative overflow-hidden bg-primary-fixed rounded-lg p-space-lg shadow-md flex flex-col justify-between">
                                    <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-primary-container/20 pointer-events-none"></div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-label-lg text-label-lg uppercase tracking-wider text-on-primary-fixed-variant font-black">Total Bersih Pembayaran</span>
                                        <span className="bg-primary text-on-primary font-label-sm text-label-sm px-2.5 py-1 rounded-full font-extrabold uppercase">3 Menu</span>
                                    </div>
                                    <div className="mt-2">
                                        <div className="font-num-display text-num-display text-on-primary-fixed font-black tracking-tight leading-none tabular-nums">
                                            Rp {formatRupiah(totalDue)}
                                        </div>
                                        <p className="font-label-sm text-label-sm text-on-primary-fixed-variant mt-2 font-medium">Sudah Termasuk PB1 10% &amp; Packaging Foodgrade</p>
                                    </div>
                                </div>

                                <button onClick={() => navigate('/order')} className="w-full h-14 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm" type="button">
                                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                                    <span>Kembali ke Kasir / Tambah Pesanan</span>
                                </button>
                            </section>

                            {/* KOLOM KANAN (62% ~ 7-col pada 12-grid system) */}
                            <section className="lg:col-span-7 flex flex-col gap-space-md">
                                {/* Segmented Tab Metode Pembayaran */}
                                <div className="grid grid-cols-4 gap-2 bg-surface-container-low p-2 rounded-lg shadow-sm">
                                    {['tunai', 'qris', 'debit', 'transfer'].map(method => (
                                        <button 
                                            key={method}
                                            onClick={() => handleSwitchMethod(method)} 
                                            className={`h-14 rounded-full flex items-center justify-center gap-2 font-label-lg text-label-lg font-bold transition-all active:scale-95 ${paymentMethod === method ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`} 
                                            type="button"
                                        >
                                            <span className="material-symbols-outlined text-[22px]">
                                                {method === 'tunai' && 'payments'}
                                                {method === 'qris' && 'qr_code_scanner'}
                                                {method === 'debit' && 'credit_card'}
                                                {method === 'transfer' && 'account_balance'}
                                            </span>
                                            <span className="capitalize">{method === 'tunai' ? 'Tunai' : method === 'qris' ? 'QRIS' : method === 'debit' ? 'Debit / EDC' : 'Transfer'}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Panel Kasir Tunai Ergonomis */}
                                {paymentMethod !== 'qris' && (
                                    <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-md flex flex-col gap-space-md">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                                            {/* Display Uang Diterima */}
                                            <div className="bg-surface-container-low p-space-md rounded-DEFAULT flex flex-col justify-between shadow-inner">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-label-md text-label-md text-on-surface-variant font-bold uppercase tracking-wider">Uang Diterima Kasir</span>
                                                    <span className="material-symbols-outlined text-primary text-[20px]">attach_money</span>
                                                </div>
                                                <div className="mt-2 flex items-baseline gap-1">
                                                    <span className="font-title-lg text-title-lg text-on-surface-variant font-bold">Rp</span>
                                                    <span className="font-num-keypad text-num-keypad text-on-surface font-extrabold tracking-tight tabular-nums">
                                                        {formatRupiah(tenderedAmount)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between mt-2 pt-2 bg-surface-container/50 px-2 py-1 rounded">
                                                    <span className="font-label-sm text-label-sm text-on-surface-variant">Tagihan: Rp {formatRupiah(totalDue)}</span>
                                                    <button onClick={handleClearInput} className="font-label-sm text-label-sm text-error font-bold flex items-center gap-0.5 hover:underline" type="button">
                                                        <span className="material-symbols-outlined text-[14px]">backspace</span> Reset
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* Display KEMBALIAN OTOMATIS JUMBO */}
                                            <div className={`p-space-md rounded-lg flex flex-col justify-between shadow-sm ${change >= 0 ? 'bg-[#E8F5E9]' : 'bg-error-container'}`}>
                                                <div className="flex items-center justify-between">
                                                    <span className={`font-label-md text-label-md font-black uppercase tracking-wider flex items-center gap-1 ${change >= 0 ? 'text-[#2E7D32]' : 'text-on-error-container'}`}>
                                                        <span className="material-symbols-outlined text-[18px]">change_circle</span>
                                                        Kembalian Pelanggan
                                                    </span>
                                                    {change >= 0 ? (
                                                        <span className="bg-[#C8E6C9] text-[#1B5E20] font-label-sm text-label-sm px-2 py-0.5 rounded-full font-black">CUKUP</span>
                                                    ) : (
                                                        <span className="bg-error text-on-error font-label-sm text-label-sm px-2 py-0.5 rounded-full font-black">KURANG</span>
                                                    )}
                                                </div>
                                                <div className="mt-2">
                                                    <div className={`font-num-display text-num-display font-black tracking-tight tabular-nums leading-none ${change >= 0 ? 'text-[#1B5E20]' : 'text-error'}`}>
                                                        {change >= 0 ? `Rp ${formatRupiah(change)}` : `- Rp ${formatRupiah(Math.abs(change))}`}
                                                    </div>
                                                </div>
                                                <div className={`mt-2 font-label-sm text-label-sm font-semibold flex items-center gap-1 ${change >= 0 ? 'text-[#2E7D32]' : 'text-on-error-container'}`}>
                                                    <span className="material-symbols-outlined text-[16px]">{change >= 0 ? 'check_circle' : 'error'}</span>
                                                    {change >= 0 ? 'Pastikan uang kembalian dicek bersama pelanggan' : 'Uang dibayarkan masih kurang dari tagihan'}
                                                </div>
                                            </div>
                                        </div>

                                        {paymentMethod === 'tunai' && (
                                            <>
                                                {/* Chip Pecahan Cepat */}
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Pecahan Cepat (Sentuh Satu Kali)</span>
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                                        <button onClick={() => handleQuickCash(totalDue)} className="h-14 px-3 rounded-DEFAULT bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim transition-all active:scale-95 flex flex-col items-center justify-center shadow-sm font-label-md text-label-md font-black" type="button">
                                                            <span className="text-[11px] uppercase tracking-wider text-on-secondary-fixed-variant leading-none font-bold">Uang Pas</span>
                                                            <span className="tabular-nums mt-0.5">Rp {formatRupiah(totalDue)}</span>
                                                        </button>
                                                        <button onClick={() => handleQuickCash(130000)} className="h-14 px-3 rounded-DEFAULT bg-surface-container hover:bg-surface-container-high text-on-surface transition-all active:scale-95 flex flex-col items-center justify-center shadow-sm font-label-md text-label-md font-bold" type="button">
                                                            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant leading-none">Pecahan</span>
                                                            <span className="tabular-nums font-black mt-0.5">Rp 130.000</span>
                                                        </button>
                                                        <button onClick={() => handleQuickCash(150000)} className="h-14 px-3 rounded-DEFAULT bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed-dim transition-all active:scale-95 flex flex-col items-center justify-center shadow-sm font-label-md text-label-md font-black" type="button">
                                                            <span className="text-[11px] uppercase tracking-wider text-on-primary-fixed-variant leading-none font-bold">Rekomendasi</span>
                                                            <span className="tabular-nums mt-0.5">Rp 150.000</span>
                                                        </button>
                                                        <button onClick={() => handleQuickCash(200000)} className="h-14 px-3 rounded-DEFAULT bg-surface-container hover:bg-surface-container-high text-on-surface transition-all active:scale-95 flex flex-col items-center justify-center shadow-sm font-label-md text-label-md font-bold" type="button">
                                                            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant leading-none">Pecahan 2x</span>
                                                            <span className="tabular-nums font-black mt-0.5">Rp 200.000</span>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Layout Sentuh & Numpad Ergonomis */}
                                                <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md items-center">
                                                    {/* Numpad 3x4 (7-col) */}
                                                    <div className="md:col-span-8 grid grid-cols-3 gap-2 bg-surface-container-low p-space-sm rounded-DEFAULT shadow-inner">
                                                        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                                                            <button key={num} onClick={() => handleDigitClick(num)} className="h-16 rounded-DEFAULT bg-surface-container-lowest text-on-surface font-num-keypad text-num-keypad flex items-center justify-center shadow-sm hover:bg-surface-container-high transition-transform active:scale-95 active:translate-y-0.5" type="button">{num}</button>
                                                        ))}
                                                        <button onClick={handleClearInput} className="h-16 rounded-DEFAULT bg-error-container text-on-error-container font-title-lg text-title-lg flex items-center justify-center shadow-sm hover:opacity-90 transition-transform active:scale-95 active:translate-y-0.5 font-bold" type="button">C</button>
                                                        <button onClick={() => handleDigitClick('0')} className="h-16 rounded-DEFAULT bg-surface-container-lowest text-on-surface font-num-keypad text-num-keypad flex items-center justify-center shadow-sm hover:bg-surface-container-high transition-transform active:scale-95 active:translate-y-0.5" type="button">0</button>
                                                        <button onClick={() => handleDigitClick('000')} className="h-16 rounded-DEFAULT bg-secondary-container text-on-secondary-container font-title-lg text-title-lg flex items-center justify-center shadow-sm hover:opacity-90 transition-transform active:scale-95 active:translate-y-0.5 font-black tracking-tight" type="button">000</button>
                                                    </div>

                                                    {/* Side Card QRIS Quick Preview */}
                                                    <div className="md:col-span-4 flex flex-col h-full justify-between bg-surface-container-low p-space-md rounded-DEFAULT gap-space-sm">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Shortcut Digital</span>
                                                            <span className="inline-flex w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                                                        </div>
                                                        <div className="bg-surface-container-lowest p-space-sm rounded-DEFAULT flex flex-col items-center text-center shadow-sm">
                                                            <span className="material-symbols-outlined text-[44px] text-primary">qr_code_2</span>
                                                            <span className="font-title-md text-title-md font-bold text-on-surface mt-1">QRIS Dinamis</span>
                                                            <p className="font-label-sm text-label-sm text-on-surface-variant leading-tight mt-1">ShopeePay, GoPay, BCA, Mandiri &amp; Dana Siap</p>
                                                            <button onClick={() => handleSwitchMethod('qris')} className="mt-2.5 w-full py-1.5 px-space-xs rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-bold hover:bg-primary hover:text-on-primary transition-colors" type="button">
                                                                Tampilkan QR Layar
                                                            </button>
                                                        </div>
                                                        <div className="bg-surface-container-high p-2 rounded-DEFAULT flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-primary text-[18px]">print</span>
                                                            <span className="font-label-sm text-label-sm text-on-surface font-medium">Printer Kasir: <strong>Ready (Auto-Cut)</strong></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Panel Alternatif: QRIS Showcase */}
                                {paymentMethod === 'qris' && (
                                    <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-md flex flex-col items-center text-center gap-space-md">
                                        <div className="w-16 h-16 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                                            <span className="material-symbols-outlined text-[36px]">qr_code_2</span>
                                        </div>
                                        <div>
                                            <h3 className="font-headline-md text-headline-md text-on-surface font-black">Scan QRIS Martaboom #042</h3>
                                            <p className="font-body-md text-body-md text-on-surface-variant">Arahkan kamera pelanggan ke layar tablet ini atau cetak kode bayar</p>
                                        </div>
                                        <div className="p-6 bg-surface-container-low rounded-lg shadow-inner flex flex-col items-center">
                                            <div className="w-56 h-56 bg-surface-container-lowest p-3 rounded-DEFAULT flex items-center justify-center shadow-md">
                                                <svg className="w-full h-full text-on-surface" viewBox="0 0 100 100">
                                                    <rect fill="#ffffff" height="100" width="100"></rect>
                                                    <rect fill="currentColor" height="25" width="25" x="10" y="10"></rect>
                                                    <rect fill="#ffffff" height="15" width="15" x="15" y="15"></rect>
                                                    <rect fill="currentColor" height="9" width="9" x="18" y="18"></rect>
                                                    <rect fill="currentColor" height="25" width="25" x="65" y="10"></rect>
                                                    <rect fill="#ffffff" height="15" width="15" x="70" y="15"></rect>
                                                    <rect fill="currentColor" height="9" width="9" x="73" y="18"></rect>
                                                    <rect fill="currentColor" height="25" width="25" x="10" y="65"></rect>
                                                    <rect fill="#ffffff" height="15" width="15" x="15" y="70"></rect>
                                                    <rect fill="currentColor" height="9" width="9" x="18" y="73"></rect>
                                                    <rect fill="currentColor" height="12" width="6" x="42" y="15"></rect>
                                                    <rect fill="currentColor" height="8" width="6" x="52" y="20"></rect>
                                                    <rect fill="currentColor" height="12" width="12" x="45" y="45"></rect>
                                                    <rect fill="currentColor" height="18" width="8" x="65" y="55"></rect>
                                                    <rect fill="currentColor" height="8" width="12" x="78" y="65"></rect>
                                                    <rect fill="currentColor" height="15" width="8" x="45" y="68"></rect>
                                                    <circle className="text-primary fill-current" cx="50" cy="50" r="8"></circle>
                                                </svg>
                                            </div>
                                            <div className="mt-4 font-headline-md text-headline-md font-black text-primary tabular-nums">Rp {formatRupiah(totalDue)}</div>
                                            <span className="font-label-sm text-label-sm text-tertiary bg-tertiary-fixed px-3 py-1 rounded-full font-bold mt-1">Status: Menunggu Notifikasi Webhook...</span>
                                        </div>
                                        
                                        <div className="w-full flex gap-space-md">
                                            <button onClick={() => handleSwitchMethod('tunai')} className="w-1/2 h-14 rounded-full bg-surface-container text-on-surface font-label-lg text-label-lg font-bold" type="button">
                                                Batal &amp; Kembali Tunai
                                            </button>
                                            <button onClick={() => alert('Pembayaran QRIS Berhasil Diverifikasi!')} className="w-1/2 h-14 rounded-full bg-tertiary text-on-tertiary font-label-lg text-label-lg font-bold shadow-md" type="button">
                                                Konfirmasi Manual / Cek Mutasi
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Tombol Aksi Bawah Gigantis */}
                                {paymentMethod !== 'qris' && (
                                    <div className="pt-2">
                                        <button disabled={isProcessing} onClick={handleProcessPayment} className={`w-full h-16 rounded-full bg-primary-container hover:bg-primary text-on-primary flex items-center justify-between px-space-lg shadow-lg hover:shadow-xl transition-all active:scale-98 active:translate-y-0.5 ${isProcessing ? 'opacity-50 cursor-wait' : ''}`} type="button">
                                            <div className="flex items-center gap-space-sm">
                                                <span className="w-10 h-10 rounded-full bg-on-primary/20 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-[24px]">receipt_long</span>
                                                </span>
                                                <div className="flex flex-col text-left">
                                                    <span className="font-title-lg text-title-lg font-black tracking-wide leading-tight">{isProcessing ? 'MEMPROSES...' : 'PROSES BAYAR & CETAK STRUK'}</span>
                                                    <span className="font-label-sm text-label-sm text-on-primary/90 font-medium">Buka Laci Kasir Otomatis &amp; Kirim KOT Dapur</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 bg-on-primary/20 px-space-md py-1.5 rounded-full">
                                                <span className="font-label-sm text-label-sm uppercase font-bold text-on-primary">Diterima</span>
                                                <span className="font-title-lg text-title-lg font-black tabular-nums">Rp {formatRupiah(tenderedAmount)}</span>
                                                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
