import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginScreen() {
    const navigate = useNavigate();
    const [pin, setPin] = useState('');
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    
    const isDarkMode = false; // Add real theme state later

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                // Fetch cashiers/employees
                const res = await axios.get('/api/admin/employees');
                if (res.data.status === 'success') {
                    const responseData = res.data.data;
                    const data = Array.isArray(responseData) ? responseData : responseData.data;
                    setEmployees(data);
                    if (data && data.length > 0) {
                        setSelectedEmployee(data[0]);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch employees", err);
            }
        };
        fetchEmployees();
    }, []);

    const handlePinInput = (num) => {
        if (pin.length < 6) {
            const newPin = pin + num;
            setPin(newPin);
            if (newPin.length === 6) {
                // In a real app we'd verify the PIN against selectedEmployee.pin
                localStorage.setItem('pos_cashier', JSON.stringify(selectedEmployee));
                setTimeout(() => {
                    navigate('/shift');
                }, 300);
            }
        }
    };

    const handlePinBackspace = () => {
        if (pin.length > 0) {
            setPin(pin.slice(0, -1));
        }
    };

    const handlePinClear = () => {
        setPin('');
    };

    const handlePinSubmit = () => {
        if (pin.length === 6) {
            navigate('/shift');
        }
    };

    return (
        <div className="bg-background font-body-md text-on-surface antialiased min-h-screen select-none flex items-center justify-center">
            <main className="w-full">
                <div className="flex flex-col w-full min-h-[760px] p-6 lg:p-8 max-w-[1366px] mx-auto select-none justify-between">
                    
                    {/* Top Navigation / Identity Strip */}
                    <header className="w-full flex items-center justify-between pb-6">
                        <div className="flex items-center gap-6">
                            <div className="h-14 flex items-center">
                                <img alt="Martaboom POS Brand Logo" className="h-12 w-auto object-contain drop-shadow-sm" src="https://lh3.googleusercontent.com/aida/AEtjO1UQOtaXm8ZM52PSH8kPJRElEQ_Pfy3dgMMn-fyZ8_Rmt1Pl1XQb0uJaBCrQZaRKYTYCwM8uINgZNZxHiJ_oRP_bwkA6ii_s5uBI8Rxf2Ujl6GE-kQKJAyvJZs7j0LsKlUVro8V50X1Fy0oulYAUbtFov8LvgbbRP76m3-wUBu5JzvZ08fll8tLrYcPRliuBNaxOPrt0lXNe7IXrsZyqINLBqo_nan54NHiuG69MqmtTQPsUeHyi4aJUGrU" />
                            </div>
                            <div className="h-8 w-px bg-surface-variant"></div>
                            <div className="flex items-center gap-3 bg-surface-container-lowest shadow-sm rounded-full px-4 py-2">
                                <span className="material-symbols-outlined text-primary text-xl">storefront</span>
                                <div className="flex flex-col">
                                    <span className="font-label-md text-label-md text-on-surface">Cabang Tebet Barat</span>
                                    <span className="font-label-sm text-label-sm text-on-surface-variant">Jl. Tebet Barat Raya No. 12</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2.5 bg-tertiary/10 rounded-full px-4 py-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary"></span>
                                </span>
                                <span className="font-label-md text-label-md text-tertiary">Shift Malam • Buka</span>
                            </div>
                            <button className="w-11 h-11 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-on-surface-variant active:scale-95 transition-transform" type="button">
                                <span className="material-symbols-outlined text-xl">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
                            </button>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-lowest text-on-surface shadow-sm font-label-md text-label-md">
                                <span className="material-symbols-outlined text-secondary-container" style={{fontVariationSettings: "'FILL' 1"}}>wifi</span>
                                <span>Online</span>
                            </div>
                        </div>
                    </header>

                    {/* Central Authentication Card (Bento Split) */}
                    <div className="w-full my-auto flex items-center justify-center">
                        <div className="w-full max-w-4xl bg-surface-container-lowest rounded-lg shadow-xl p-8 lg:p-10 flex flex-col md:flex-row gap-8 lg:gap-12 relative overflow-hidden">
                            {/* Subtle Decorative Golden Glow */}
                            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>
                            <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-primary-container/10 blur-3xl pointer-events-none"></div>
                            
                            {/* Left Column: Cashier Profile & PIN Status */}
                            <div className="w-full md:w-5/12 flex flex-col justify-between relative z-10">
                                <div>
                                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">Terminal Keamanan POS</span>
                                    <h1 className="font-headline-lg text-headline-lg text-on-surface mt-1">Masuk Sesi Kasir</h1>
                                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">Masukkan 6 digit PIN otoritas kasir bertugas untuk membuka laci kas.</p>
                                    
                                    {/* Current Cashier Card */}
                                    <div className="mt-6 p-4 rounded-xl bg-surface-container-low flex items-center gap-4 shadow-sm">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-full shadow-md bg-primary/20 text-primary flex items-center justify-center font-bold text-2xl">
                                                {selectedEmployee ? selectedEmployee.name.substring(0, 2).toUpperCase() : 'KA'}
                                            </div>
                                            <span className="absolute bottom-0 right-0 w-4 h-4 bg-tertiary rounded-full border-2 border-surface-container-lowest"></span>
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-title-md text-title-md text-on-surface font-bold truncate">
                                                    {selectedEmployee ? selectedEmployee.name : 'Kasir Utama'}
                                                </span>
                                                <span className="material-symbols-outlined text-primary text-base" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                                            </div>
                                            <span className="font-label-sm text-label-sm text-primary font-semibold">
                                                {selectedEmployee ? selectedEmployee.role.toUpperCase() : 'KASIR'}
                                            </span>
                                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                                                ID: KSR-{(selectedEmployee?.id || 1).toString().padStart(5, '0')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Quick Switch Cashier Chips */}
                                    <div className="mt-4">
                                        <label className="font-label-sm text-label-sm text-on-surface-variant block mb-2">Ganti Petugas Kasir:</label>
                                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                            {employees.map(emp => (
                                                <button 
                                                    key={emp.id}
                                                    onClick={() => { setSelectedEmployee(emp); setPin(''); }}
                                                    className={`group flex items-center gap-2 px-3 py-1.5 rounded-full transition active:scale-95 text-on-surface ${selectedEmployee?.id === emp.id ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container hover:bg-surface-container-high'}`} 
                                                    type="button"
                                                >
                                                    <span className={`w-6 h-6 rounded-full font-label-sm text-label-sm flex items-center justify-center ${selectedEmployee?.id === emp.id ? 'bg-primary text-on-primary' : 'bg-secondary-container text-on-secondary-container'}`}>
                                                        {emp.name.substring(0, 2).toUpperCase()}
                                                    </span>
                                                    <span className="font-label-md text-label-md">{emp.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* PIN Display Dots */}
                                <div className="my-6 md:my-0 pt-4">
                                    <div className="flex items-center justify-between px-2 mb-3">
                                        <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Status Digit PIN</span>
                                        <span className="font-label-sm text-label-sm text-primary font-semibold">{pin.length} dari 6 Digit</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-3.5 bg-surface-container-low p-4 rounded-xl shadow-inner">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className={`w-4 h-4 rounded-full transition-all duration-200 ${i < pin.length ? 'bg-primary shadow-[0_0_12px_rgba(217,142,63,0.8)] transform scale-110' : 'bg-surface-variant/80'}`}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Vertical Divider (Desktop) */}
                            <div className="hidden md:block w-px bg-surface-container self-stretch"></div>
                            
                            {/* Right Column: Giant Touch-First Numpad */}
                            <div className="w-full md:w-7/12 flex flex-col justify-center">
                                <div className="grid grid-cols-3 gap-3.5">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                        <button 
                                            key={num}
                                            onClick={() => handlePinInput(num.toString())}
                                            className="h-16 md:h-18 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container active:translate-y-0.5 active:shadow-inner shadow-sm flex items-center justify-center font-num-keypad text-num-keypad font-bold transition"
                                            type="button"
                                        >
                                            {num}
                                        </button>
                                    ))}
                                    
                                    {/* Row 4: Backspace, 0, Submit */}
                                    <button 
                                        onClick={handlePinBackspace}
                                        className="h-16 md:h-18 rounded-lg bg-error-container text-error hover:opacity-90 active:translate-y-0.5 active:shadow-inner shadow-sm flex items-center justify-center transition" 
                                        type="button"
                                    >
                                        <span className="material-symbols-outlined text-3xl">backspace</span>
                                    </button>
                                    <button 
                                        onClick={() => handlePinInput('0')}
                                        className="h-16 md:h-18 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container active:translate-y-0.5 active:shadow-inner shadow-sm flex items-center justify-center font-num-keypad text-num-keypad font-bold transition" 
                                        type="button"
                                    >
                                        0
                                    </button>
                                    <button 
                                        onClick={handlePinSubmit}
                                        className="h-16 md:h-18 rounded-lg bg-tertiary text-on-tertiary hover:opacity-90 active:translate-y-0.5 active:shadow-inner shadow-md flex items-center justify-center transition group" 
                                        type="button"
                                    >
                                        <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">check_circle</span>
                                    </button>
                                </div>

                                {/* Quick Action Prompt */}
                                <div className="mt-4 flex items-center justify-between text-on-surface-variant px-1">
                                    <div className="flex items-center gap-1.5 font-label-sm text-label-sm">
                                        <span className="material-symbols-outlined text-sm">touch_app</span>
                                        <span>Tap layar sentuh responsif</span>
                                    </div>
                                    <button onClick={handlePinClear} className="font-label-sm text-label-sm text-error font-semibold hover:underline" type="button">Hapus Semua (C)</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Bottom Utility & Overwrite Actions */}
                    <footer className="w-full flex items-center justify-between pt-6">
                        <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
                            <span className="material-symbols-outlined text-lg">info</span>
                            <span>Lupa PIN Kasir? Hubungi Manager Shift Toko</span>
                        </div>
                        <button className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface shadow-sm active:scale-95 transition" type="button">
                            <span className="material-symbols-outlined text-primary text-xl">admin_panel_settings</span>
                            <span className="font-label-lg text-label-lg">Bantuan / Supervisor Overwrite</span>
                        </button>
                    </footer>
                </div>
            </main>
        </div>
    );
}
