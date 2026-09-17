import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginScreen() {
    const navigate = useNavigate();
    const [pin, setPin] = useState('');
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [branch, setBranch] = useState(null);
    const [appName, setAppName] = useState('Martaboom POS');
    const [error, setError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [shake, setShake] = useState(false);

    useEffect(() => {
        fetchEmployees();
        fetchBranch(1);
    }, []);

    const fetchBranch = async (branchId) => {
        try {
            const res = await fetch(`/api/branches/current?branch_id=${branchId}`, {
                headers: { 'Accept': 'application/json' },
            });
            const json = await res.json();
            if (json.status === 'success') {
                setBranch(json.data);
                localStorage.setItem('pos_branch', JSON.stringify(json.data));
            }
        } catch (err) {
            console.error('Failed to load branch', err);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await fetch('/api/admin/employees', {
                headers: { 'Accept': 'application/json' },
            });
            const json = await res.json();
            if (json.status === 'success') {
                const data = Array.isArray(json.data) ? json.data : (json.data?.data || []);
                setEmployees(data);
                if (data && data.length > 0) {
                    setSelectedEmployee(data[0]);
                    // Pre-fetch branch based on first employee
                    if (data[0]?.branch_id) fetchBranch(data[0].branch_id);
                }
            }
        } catch (err) {
            console.error('Failed to fetch employees', err);
        }
    };

    const triggerShake = (msg) => {
        setError(msg);
        setShake(true);
        setTimeout(() => setShake(false), 600);
    };

    const handlePinInput = (num) => {
        if (isVerifying) return;
        if (pin.length < 6) {
            const newPin = pin + num;
            setPin(newPin);
            setError('');
            if (newPin.length === 6) {
                verifyPin(newPin);
            }
        }
    };

    const verifyPin = async (pinValue) => {
        if (!selectedEmployee) return;
        setIsVerifying(true);
        try {
            const res = await fetch('/api/verify-pin', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: selectedEmployee.id, pin: pinValue }),
            });
            const json = await res.json();

            if (json.valid) {
                // Save cashier + branch to localStorage
                localStorage.setItem('pos_cashier', JSON.stringify({
                    id: selectedEmployee.id,
                    name: selectedEmployee.name,
                    role: selectedEmployee.role,
                    employee_id: selectedEmployee.employee_id,
                    branch_id: selectedEmployee.branch_id,
                }));
                // Fetch branch for this cashier
                if (selectedEmployee.branch_id) fetchBranch(selectedEmployee.branch_id);
                setTimeout(() => navigate('/shift'), 300);
            } else {
                triggerShake('PIN salah. Silakan coba lagi.');
                setPin('');
            }
        } catch (err) {
            triggerShake('Gagal memverifikasi PIN. Periksa koneksi.');
            setPin('');
        } finally {
            setIsVerifying(false);
        }
    };

    const handlePinBackspace = () => {
        if (!isVerifying && pin.length > 0) {
            setPin(pin.slice(0, -1));
            setError('');
        }
    };

    const handlePinClear = () => {
        setPin('');
        setError('');
    };

    const handleEmployeeSelect = (emp) => {
        setSelectedEmployee(emp);
        setPin('');
        setError('');
        if (emp.branch_id) fetchBranch(emp.branch_id);
    };

    const isDarkMode = false;
    const branchName = branch?.name || 'Memuat Cabang...';
    const branchAddress = branch?.address || '';

    return (
        <div className="bg-background font-body-md text-on-surface antialiased min-h-screen select-none flex items-center justify-center">
            <main className="w-full">
                <div className="flex flex-col w-full min-h-[760px] p-6 lg:p-8 max-w-[1366px] mx-auto select-none justify-between">

                    {/* Top Navigation / Identity Strip */}
                    <header className="w-full flex items-center justify-between pb-6">
                        <div className="flex items-center gap-6">
                            {/* Brand */}
                            <div className="flex items-center gap-2.5">
                                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                                    <span className="material-symbols-outlined text-on-primary text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>store</span>
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <span className="font-label-md text-label-md text-on-surface font-black uppercase tracking-widest">{appName}</span>
                                    <span className="font-label-sm text-label-sm text-on-surface-variant">POS System</span>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-surface-variant"></div>
                            {/* Branch Info */}
                            <div className="flex items-center gap-3 bg-surface-container-lowest shadow-sm rounded-full px-4 py-2">
                                <span className="material-symbols-outlined text-primary text-xl">storefront</span>
                                <div className="flex flex-col">
                                    <span className="font-label-md text-label-md text-on-surface">{branchName}</span>
                                    {branchAddress && (
                                        <span className="font-label-sm text-label-sm text-on-surface-variant">{branchAddress}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-lowest text-on-surface shadow-sm font-label-md text-label-md">
                                <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>wifi</span>
                                <span>Online</span>
                            </div>
                        </div>
                    </header>

                    {/* Central Authentication Card */}
                    <div className="w-full my-auto flex items-center justify-center">
                        <div className="w-full max-w-4xl bg-surface-container-lowest rounded-lg shadow-xl p-8 lg:p-10 flex flex-col md:flex-row gap-8 lg:gap-12 relative overflow-hidden">
                            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>
                            <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-primary-container/10 blur-3xl pointer-events-none"></div>

                            {/* Left Column */}
                            <div className="w-full md:w-5/12 flex flex-col justify-between relative z-10">
                                <div>
                                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">Terminal Keamanan POS</span>
                                    <h1 className="font-headline-lg text-headline-lg text-on-surface mt-1">Masuk Sesi Kasir</h1>
                                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                                        Pilih nama karyawan lalu masukkan PIN 6 digit yang sudah diatur oleh admin.
                                    </p>

                                    {/* Selected Cashier Card */}
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
                                                    {selectedEmployee ? selectedEmployee.name : 'Pilih Kasir'}
                                                </span>
                                                <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                            </div>
                                            <span className="font-label-sm text-label-sm text-primary font-semibold capitalize">
                                                {selectedEmployee ? selectedEmployee.role : '---'}
                                            </span>
                                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                                                ID: {selectedEmployee?.employee_id || ('EMP-' + (selectedEmployee?.id || '?').toString().padStart(5, '0'))}
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
                                                    onClick={() => handleEmployeeSelect(emp)}
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

                                {/* PIN Dots + Error */}
                                <div className="my-6 md:my-0 pt-4">
                                    {error && (
                                        <div className="mb-2 px-3 py-2 rounded-lg bg-error-container text-on-error-container font-label-sm text-label-sm flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[16px]">error</span>
                                            {error}
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between px-2 mb-3">
                                        <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Status Digit PIN</span>
                                        <span className="font-label-sm text-label-sm text-primary font-semibold">
                                            {isVerifying ? 'Memverifikasi...' : `${pin.length} dari 6 Digit`}
                                        </span>
                                    </div>
                                    <div className={`flex items-center justify-center gap-3.5 bg-surface-container-low p-4 rounded-xl shadow-inner transition-all ${shake ? 'animate-[shake_0.4s_ease]' : ''}`}>
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className={`w-4 h-4 rounded-full transition-all duration-200 ${i < pin.length ? 'bg-primary shadow-[0_0_12px_rgba(217,142,63,0.8)] transform scale-110' : 'bg-surface-variant/80'}`}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Vertical Divider */}
                            <div className="hidden md:block w-px bg-surface-container self-stretch"></div>

                            {/* Right Column: Numpad */}
                            <div className="w-full md:w-7/12 flex flex-col justify-center">
                                <div className="grid grid-cols-3 gap-3.5">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => handlePinInput(num.toString())}
                                            disabled={isVerifying}
                                            className="h-16 md:h-18 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container active:translate-y-0.5 active:shadow-inner shadow-sm flex items-center justify-center font-num-keypad text-num-keypad font-bold transition disabled:opacity-50"
                                            type="button"
                                        >
                                            {num}
                                        </button>
                                    ))}

                                    {/* Row 4: Backspace, 0, Submit */}
                                    <button
                                        onClick={handlePinBackspace}
                                        disabled={isVerifying}
                                        className="h-16 md:h-18 rounded-lg bg-error-container text-error hover:opacity-90 active:translate-y-0.5 active:shadow-inner shadow-sm flex items-center justify-center transition disabled:opacity-50"
                                        type="button"
                                    >
                                        <span className="material-symbols-outlined text-3xl">backspace</span>
                                    </button>
                                    <button
                                        onClick={() => handlePinInput('0')}
                                        disabled={isVerifying}
                                        className="h-16 md:h-18 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container active:translate-y-0.5 active:shadow-inner shadow-sm flex items-center justify-center font-num-keypad text-num-keypad font-bold transition disabled:opacity-50"
                                        type="button"
                                    >
                                        0
                                    </button>
                                    <button
                                        onClick={() => pin.length === 6 && !isVerifying && verifyPin(pin)}
                                        disabled={pin.length < 6 || isVerifying}
                                        className="h-16 md:h-18 rounded-lg bg-tertiary text-on-tertiary hover:opacity-90 active:translate-y-0.5 active:shadow-inner shadow-md flex items-center justify-center transition group disabled:opacity-40"
                                        type="button"
                                    >
                                        {isVerifying
                                            ? <span className="material-symbols-outlined text-3xl animate-spin">progress_activity</span>
                                            : <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">check_circle</span>
                                        }
                                    </button>
                                </div>

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

                    {/* Footer */}
                    <footer className="w-full flex items-center justify-between pt-6">
                        <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
                            <span className="material-symbols-outlined text-lg">info</span>
                            <span>Lupa PIN? Hubungi Admin atau Manager Shift</span>
                        </div>
                    </footer>
                </div>
            </main>

            {/* Shake animation style */}
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(-8px); }
                    40% { transform: translateX(8px); }
                    60% { transform: translateX(-6px); }
                    80% { transform: translateX(6px); }
                }
                .animate-\\[shake_0\\.4s_ease\\] {
                    animation: shake 0.4s ease;
                }
            `}</style>
        </div>
    );
}
