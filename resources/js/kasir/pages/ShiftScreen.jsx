import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PosHeader from '../components/layout/PosHeader';
import apiClient from '../utils/apiClient';

export default function ShiftScreen() {
    const navigate = useNavigate();
    const [amount, setAmount] = useState(300000);
    const [isProcessing, setIsProcessing] = useState(false);

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID').format(number);
    };

    const setPreset = (val) => setAmount(val);
    const addAmount = (val) => setAmount(prev => Math.min(prev + val, 99999999));
    const resetAmount = () => setAmount(0);

    const pressDigit = (digit) => {
        setAmount(prev => {
            let str = prev === 0 ? '' : prev.toString();
            str += digit;
            if (str.length > 9) return prev;
            return parseInt(str || '0', 10);
        });
    };

    const clearLastDigit = () => {
        setAmount(prev => {
            let str = prev.toString();
            if (str.length <= 1) return 0;
            return parseInt(str.slice(0, -1), 10);
        });
    };

    const submitOpenShift = async () => {
        setIsProcessing(true);
        try {
            const response = await apiClient.post('/shift/start', {
                branch_id: 1, // default branch
                user_id: 1, // default user
                shift_type: 'Pagi',
                opening_cash: amount
            });
            
            if (response.status === 'success') {
                navigate('/order');
            } else {
                alert(response.message);
            }
        } catch (error) {
            alert('Gagal membuka shift. ' + (error.response?.data?.message || 'Error jaringan.'));
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-background font-body-md text-on-surface antialiased min-h-screen select-none">
            <PosHeader />
            
            <main className="w-full pt-20 bg-background">
                <div className="flex flex-col w-full">
                    <div className="relative w-full min-h-[calc(100vh-5rem)] p-space-lg flex items-center justify-center overflow-hidden">
                        
                        {/* Background decor */}
                        <div className="absolute inset-0 bg-surface-container-low/80 backdrop-blur-md"></div>
                        <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>
                        <div className="absolute -bottom-28 -right-20 w-[30rem] h-[30rem] rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none"></div>
                        
                        <div className="relative z-10 w-full max-w-5xl bg-surface-container-lowest rounded-lg shadow-xl overflow-hidden flex flex-col">
                            {/* Header Section */}
                            <div className="px-space-xl py-space-lg bg-surface-container-high/60 flex items-center justify-between">
                                <div className="flex items-center gap-space-md">
                                    <div className="w-14 h-14 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container shadow-inner">
                                        <span className="material-symbols-outlined text-[32px]" style={{fontVariationSettings: "'FILL' 1"}}>point_of_sale</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h1 className="font-headline-lg text-headline-lg text-on-surface">Konfirmasi Buka Shift</h1>
                                            <span className="bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-bold">Shift Siang • Reguler</span>
                                        </div>
                                        <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                                            Kasir: <strong className="text-on-surface font-semibold">Budi Santoso</strong> • Waktu: <span className="text-on-surface">Rabu, 23 Okt 2024 • 16:30 WIB</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="hidden sm:flex items-center gap-space-xs bg-surface-container px-space-md py-2 rounded-full">
                                    <span className="material-symbols-outlined text-secondary text-[20px]">storefront</span>
                                    <span className="font-label-md text-label-md text-on-surface font-bold">Laci Utama Kasir 01</span>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="p-space-xl grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
                                {/* Left Side: Presets & Details */}
                                <div className="lg:col-span-7 flex flex-col gap-space-lg">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-baseline">
                                            <label className="font-label-lg text-label-lg uppercase tracking-wider text-on-surface-variant">Nominal Kas Modal Awal</label>
                                            <span className="font-label-sm text-label-sm text-primary font-bold">Wajib dihitung fisik laci</span>
                                        </div>
                                        <div className="relative bg-surface-container-highest/60 rounded-DEFAULT p-space-lg flex items-center justify-between shadow-inner">
                                            <div className="flex items-baseline gap-2">
                                                <span className="font-headline-lg text-headline-lg text-primary font-black">Rp</span>
                                                <span className="font-num-display text-num-display text-on-surface tracking-tight font-extrabold select-all">
                                                    {formatRupiah(amount)}
                                                </span>
                                            </div>
                                            <button onClick={clearLastDigit} className="w-12 h-12 rounded-full bg-surface-container-lowest hover:bg-error-container text-on-surface-variant hover:text-error flex items-center justify-center transition-all duration-150 active:scale-90 shadow-sm" type="button">
                                                <span className="material-symbols-outlined text-[24px]">backspace</span>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2.5">
                                        <span className="font-label-md text-label-md font-bold text-on-surface-variant">Pecahan Cepat (Quick Preset):</span>
                                        <div className="grid grid-cols-3 gap-2.5">
                                            <button onClick={() => setPreset(200000)} className="h-14 rounded-DEFAULT bg-surface-container-low hover:bg-surface-container text-on-surface font-label-lg text-label-lg transition-all duration-150 active:scale-95 shadow-sm flex items-center justify-center font-bold" type="button">
                                                Rp 200.000
                                            </button>
                                            <button onClick={() => setPreset(300000)} className="h-14 rounded-DEFAULT bg-secondary-fixed text-on-secondary-fixed font-label-lg text-label-lg transition-all duration-150 active:scale-95 shadow-sm flex items-center justify-center font-black" type="button">
                                                Rp 300.000
                                            </button>
                                            <button onClick={() => setPreset(500000)} className="h-14 rounded-DEFAULT bg-surface-container-low hover:bg-surface-container text-on-surface font-label-lg text-label-lg transition-all duration-150 active:scale-95 shadow-sm flex items-center justify-center font-bold" type="button">
                                                Rp 500.000
                                            </button>
                                            <button onClick={() => addAmount(50000)} className="h-14 rounded-DEFAULT bg-surface-container-lowest hover:bg-primary-fixed text-primary font-label-lg text-label-lg transition-all duration-150 active:scale-95 shadow-sm flex items-center justify-center font-bold" type="button">
                                                + Rp 50.000
                                            </button>
                                            <button onClick={() => addAmount(100000)} className="h-14 rounded-DEFAULT bg-surface-container-lowest hover:bg-primary-fixed text-primary font-label-lg text-label-lg transition-all duration-150 active:scale-95 shadow-sm flex items-center justify-center font-bold" type="button">
                                                + Rp 100.000
                                            </button>
                                            <button onClick={resetAmount} className="h-14 rounded-DEFAULT bg-error-container/40 hover:bg-error-container text-error font-label-lg text-label-lg transition-all duration-150 active:scale-95 shadow-sm flex items-center justify-center font-bold" type="button">
                                                Reset (Rp 0)
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-surface-container-low rounded-DEFAULT p-space-md flex items-start gap-space-sm shadow-sm">
                                        <span className="material-symbols-outlined text-primary-container text-[24px] shrink-0 mt-0.5">info</span>
                                        <div className="flex flex-col text-left">
                                            <span className="font-label-md text-label-md text-on-surface font-bold">Rincian Fisik Rekomendasi Kasir Pagi:</span>
                                            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                                                Modal kembalian awal: <strong className="text-on-surface">20 lembar Rp 5.000</strong> • <strong className="text-on-surface">10 lembar Rp 10.000</strong> • <strong className="text-on-surface">5 lembar Rp 20.000</strong>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Numpad */}
                                <div className="lg:col-span-5 bg-surface-container-low/70 rounded-DEFAULT p-space-md flex flex-col gap-2.5 shadow-inner">
                                    <div className="flex items-center justify-between px-1">
                                        <span className="font-label-md text-label-md font-bold text-on-surface-variant">Numpad Layar Sentuh</span>
                                        <span className="font-label-sm text-label-sm text-on-surface-variant">Responsif 56px+</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2.5">
                                        {[1,2,3,4,5,6,7,8,9].map(num => (
                                            <button key={num} onClick={() => pressDigit(num.toString())} className="h-16 rounded-DEFAULT bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-num-keypad text-num-keypad font-bold transition-all duration-100 active:scale-95 shadow-sm flex items-center justify-center" type="button">
                                                {num}
                                            </button>
                                        ))}
                                        <button onClick={() => pressDigit('000')} className="h-16 rounded-DEFAULT bg-surface-container hover:bg-surface-container-high text-on-surface font-title-lg text-title-lg font-bold transition-all duration-100 active:scale-95 shadow-sm flex items-center justify-center" type="button">000</button>
                                        <button onClick={() => pressDigit('0')} className="h-16 rounded-DEFAULT bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-num-keypad text-num-keypad font-bold transition-all duration-100 active:scale-95 shadow-sm flex items-center justify-center" type="button">0</button>
                                        <button onClick={clearLastDigit} className="h-16 rounded-DEFAULT bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-error transition-all duration-100 active:scale-95 shadow-sm flex items-center justify-center" type="button">
                                            <span className="material-symbols-outlined text-[28px]">backspace</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-space-xl bg-surface-container-low/50 flex flex-col-reverse sm:flex-row items-center justify-between gap-space-md">
                                <button onClick={() => navigate(-1)} className="w-full sm:w-auto px-space-xl h-16 rounded-full bg-surface-container-highest hover:bg-surface-container text-on-surface font-label-lg text-label-lg transition-all duration-150 active:scale-95 flex items-center justify-center gap-2" type="button">
                                    <span className="material-symbols-outlined text-[22px]">close</span>
                                    <span>Batal / Kembali</span>
                                </button>
                                <div className="flex items-center gap-space-md w-full sm:w-auto">
                                    <button disabled={isProcessing} onClick={submitOpenShift} className={`w-full sm:w-auto min-w-[340px] h-16 px-space-xl rounded-full bg-primary-container hover:bg-primary text-on-primary font-title-lg text-title-lg font-bold shadow-md transition-all duration-150 active:scale-95 flex items-center justify-between gap-space-lg group ${isProcessing ? 'opacity-50 cursor-wait' : ''}`} type="button">
                                        <div className="flex items-center gap-space-sm">
                                            <span className="material-symbols-outlined text-[28px] group-hover:rotate-12 transition-transform duration-200">check_circle</span>
                                            <span>{isProcessing ? 'Memproses...' : 'Mulai Berjualan (Buka Toko)'}</span>
                                        </div>
                                        <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
