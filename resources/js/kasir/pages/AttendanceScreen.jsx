import React, { useState, useEffect } from 'react';
import PosHeader from '../components/layout/PosHeader';

export default function AttendanceScreen() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [pinCode, setPinCode] = useState('');
    const [selectedCrew, setSelectedCrew] = useState('budi');
    const [statusToast, setStatusToast] = useState({ show: false, message: '' });


    const [crewList, setCrewList] = useState([]);
    const [isLoadingCrew, setIsLoadingCrew] = useState(true);

    const loadCrew = async () => {
        setIsLoadingCrew(true);
        try {
            const response = await window.apiClient.get('/admin/employees?branch_id=1');
            if (response.status === 'success') {
                const employees = Array.isArray(response.data) ? response.data : (response.data?.data || []);
                const mappedCrew = employees.map(emp => ({
                    id: emp.id,
                    name: emp.name.split(' ')[0] + ' ' + (emp.name.split(' ')[1] ? emp.name.split(' ')[1][0] + '.' : ''),
                    role: emp.role || 'Staff',
                    fullName: emp.name,
                    img: emp.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(emp.name)
                }));
                setCrewList(mappedCrew);
                if (mappedCrew.length > 0) {
                    setSelectedCrew(mappedCrew[0].id);
                }
            }
        } catch (error) {
            console.error('Error loading crew:', error);
        } finally {
            setIsLoadingCrew(false);
        }
    };

    const [attendances, setAttendances] = useState([]);

    const loadAttendances = async () => {
        try {
            const response = await window.apiClient.get('/attendances?branch_id=1');
            if (response.status === 'success') {
                setAttendances(response.data);
            }
        } catch (error) {
            console.error('Error loading attendances:', error);
        }
    };

    useEffect(() => {
        loadAttendances();
        loadCrew();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const mins = String(date.getMinutes()).padStart(2, '0');
        const secs = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${mins}:${secs}`;
    };

    const formatDate = (date) => {
        const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    };

    const showToast = (message) => {
        setStatusToast({ show: true, message });
        setTimeout(() => setStatusToast({ show: false, message: '' }), 3500);
    };

    const handlePinPress = (val) => {
        if (pinCode.length < 4) {
            const newPin = pinCode + val;
            setPinCode(newPin);
            if (newPin.length === 4) {
                showToast("PIN Terverifikasi: Menunggu Aksi Shift");
            }
        }
    };

    const handleClearPin = () => {
        setPinCode(prev => prev.slice(0, -1));
    };

    const selectCrew = (id) => {
        setSelectedCrew(id);
        setPinCode('');
    };

    const handleAction = async (action) => {
        if (action === 'retake') {
            showToast("Kamera dikalibrasi ulang: Tatap lurus ke lensa");
            setPinCode('');
            return;
        }

        try {
            const response = await window.apiClient.post('/attendances', {
                user_id: 1, // simulated user based on selectedCrew
                shift_id: 1, // simulated active shift
                type: action
            });

            if (response.status === 'success') {
                if (action === 'clock_in') showToast("SUKSES: Clock In Masuk Shift Tersimpan & Dicetak!");
                if (action === 'clock_out') showToast("SUKSES: Clock Out Selesai Shift. Terima Kasih!");
                if (action === 'break_start') showToast("STATUS: Istirahat Shift Dimulai (30 Menit)");
                loadAttendances();
            } else {
                alert(response.message);
            }
        } catch (error) {
            alert('Gagal mencatat absensi: ' + (error.response?.data?.message || 'Error jaringan.'));
        }
        setPinCode('');
    };

    return (
        <div className="bg-background font-body-md text-on-surface antialiased min-h-screen select-none">
            <PosHeader />
            
            <main className="w-full pt-20 bg-background pb-10">
                <div className="flex flex-col w-full">
                    <div className="w-full max-w-[1600px] mx-auto p-space-md lg:p-space-lg">
                        
                        {/* Sub-header Breadcrumb Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
                            <div className="flex items-center gap-space-sm">
                                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shadow-sm">
                                    <span className="material-symbols-outlined text-[24px]">timer</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="font-headline-md text-headline-md text-on-surface">Absensi &amp; Presensi Tim Shift</h1>
                                        <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">Shift Sore-Malam</span>
                                    </div>
                                    <p className="font-body-md text-body-md text-on-surface-variant">Cabang Tebet Barat • Jam Operasional: 16:00 – 00:30 WIB</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-2 rounded-full shadow-sm">
                                <span className="material-symbols-outlined text-tertiary text-[20px]">verified_user</span>
                                <span className="font-label-md text-label-md text-on-surface font-semibold">Face Verification &amp; Geofence Aktif</span>
                            </div>
                        </div>

                        {/* 2 Balanced Column Master Layout (Landscape Optimized) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
                            
                            {/* KOLOM KIRI (Kamera Selfie, Validasi AI, & Tombol Aksi) */}
                            <div className="lg:col-span-6 flex flex-col gap-space-md">
                                {/* Viewfinder Card */}
                                <div className="bg-surface-container-lowest rounded-lg p-space-md lg:p-space-lg shadow-[0_4px_20px_-2px_rgba(70,42,25,0.07)] relative overflow-hidden">
                                    
                                    {/* Viewfinder Header Chips */}
                                    <div className="flex items-center justify-between gap-space-xs mb-space-sm">
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full">
                                            <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse"></span>
                                            <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Kamera Depan HD Active</span>
                                        </div>
                                        <div className="font-label-md text-label-md text-on-surface font-bold tracking-tight">
                                            {formatDate(currentTime)} • <span className="text-primary font-black font-mono">{formatTime(currentTime)}</span> WIB
                                        </div>
                                    </div>

                                    {/* Video Simulation Viewfinder Frame */}
                                    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-inverse-surface/95 shadow-inner">
                                        <img alt="preview" className="w-full h-full object-cover object-center filter saturate-[1.08] contrast-[1.02]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNN59BR15PbcVp2eA4Cgi-C9GG4w8PJGFlvFcSAyTE5ygcdGLX562_A7XRJrPtRk_GIXX_7TKtGVZkHTi9D1VzrD14Y5YlRsOrlNkvLRNcS2BF9jNRVwY_nnI-VMDauf7-ChUXKmFhDNTnjfSO29GKW9lEyvVU5KRXO08Ow3iI75PGkcqQ-eOelDjBXfJz5T1P1CKDhl7Rj6KyX7EUVHil-YG5rz3zmgUdgSWHYYG0ARQZ4UZ06Lyx" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-transparent to-inverse-surface/40 pointer-events-none"></div>
                                        
                                        {/* Face Detection Overlay HUD Box */}
                                        <div className="absolute inset-x-[20%] top-[12%] bottom-[22%] pointer-events-none flex flex-col items-center justify-between">
                                            <div className="w-full flex justify-between items-start">
                                                <div className="w-8 h-8 rounded-tl-xl bg-secondary-container shadow-md"></div>
                                                <div className="w-8 h-8 rounded-tr-xl bg-secondary-container shadow-md"></div>
                                            </div>
                                            <div className="px-3.5 py-1.5 rounded-full bg-surface/95 backdrop-blur-md text-on-surface flex items-center gap-2 shadow-lg scale-95 transition-all">
                                                <span className="material-symbols-outlined text-tertiary text-[18px]">face</span>
                                                <span className="font-label-sm text-label-sm font-bold text-tertiary">Wajah Terdeteksi • Jernih (98%)</span>
                                            </div>
                                            <div className="w-full flex justify-between items-end">
                                                <div className="w-8 h-8 rounded-bl-xl bg-secondary-container shadow-md"></div>
                                                <div className="w-8 h-8 rounded-br-xl bg-secondary-container shadow-md"></div>
                                            </div>
                                        </div>

                                        {/* Bottom HUD Watermark */}
                                        <div className="absolute bottom-3 inset-x-3 flex items-end justify-between text-inverse-on-surface">
                                            <div className="flex items-center gap-2 bg-inverse-surface/75 backdrop-blur-md px-3 py-1.5 rounded-full">
                                                <span className="material-symbols-outlined text-tertiary-fixed text-[18px]">location_on</span>
                                                <span className="font-label-sm text-label-sm text-inverse-on-surface font-semibold tracking-wide">
                                                    GPS Valid: <strong className="text-tertiary-fixed font-bold">12m</strong> dari Titik Gerai
                                                </span>
                                            </div>
                                            <button onClick={() => handleAction('retake')} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-lowest/90 hover:bg-surface-container-lowest text-on-surface font-label-sm text-label-sm font-bold shadow-md transition-all active:scale-95" type="button">
                                                <span className="material-symbols-outlined text-[16px] text-primary">flip_camera_ios</span>
                                                <span>Ambil Foto Ulang</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Bottom Action Buttons */}
                                    <div className="mt-space-md flex flex-col gap-space-xs">
                                        {/* Primary Clock In */}
                                        <button onClick={() => handleAction('clock_in')} className="h-16 w-full rounded-full bg-primary-container hover:bg-primary-container/90 text-on-primary font-title-lg text-title-lg flex items-center justify-between px-space-lg shadow-[0_8px_20px_-4px_rgba(217,142,63,0.5)] transition-all active:translate-y-0.5 active:shadow-[0_2px_6px_rgba(217,142,63,0.3)] group" type="button">
                                            <div className="flex items-center gap-space-sm">
                                                <div className="w-10 h-10 rounded-full bg-surface-container-lowest text-on-primary-container flex items-center justify-center shadow-sm">
                                                    <span className="material-symbols-outlined text-[22px]">login</span>
                                                </div>
                                                <div className="flex flex-col text-left">
                                                    <span className="font-title-lg text-title-lg font-extrabold leading-none tracking-tight text-surface-container-lowest">CLOCK IN (Masuk Shift)</span>
                                                    <span className="font-label-sm text-label-sm text-surface-container-lowest/90 font-medium mt-0.5">Otomatis simpan foto &amp; verifikasi posisi</span>
                                                </div>
                                            </div>
                                            <span className="material-symbols-outlined text-[28px] text-surface-container-lowest group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                        </button>
                                        
                                        {/* Dual Secondary */}
                                        <div className="grid grid-cols-2 gap-space-xs">
                                            <button onClick={() => handleAction('clock_out')} className="h-14 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-title-md flex items-center justify-center gap-2 shadow-sm transition-all active:translate-y-0.5 active:scale-[0.99]" type="button">
                                                <span className="material-symbols-outlined text-primary text-[20px]">logout</span>
                                                <span className="font-bold">CLOCK OUT (Pulang)</span>
                                            </button>
                                            <button onClick={() => handleAction('break_start')} className="h-14 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-title-md flex items-center justify-center gap-2 shadow-sm transition-all active:translate-y-0.5 active:scale-[0.99]" type="button">
                                                <span className="material-symbols-outlined text-secondary text-[20px]">coffee</span>
                                                <span className="font-bold">Mulai Istirahat</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* KOLOM KANAN */}
                            <div className="lg:col-span-6 flex flex-col gap-space-md">
                                {/* Card 1: Karyawan Selector + Quick PIN */}
                                <div className="bg-surface-container-lowest rounded-lg p-space-md lg:p-space-lg shadow-[0_4px_20px_-2px_rgba(70,42,25,0.07)]">
                                    <div className="flex items-center justify-between mb-space-sm">
                                        <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant tracking-wider">1. Pilih Karyawan Aktif</span>
                                        <span className="font-label-sm text-label-sm text-primary font-bold">Wajib 4-Digit PIN</span>
                                    </div>
                                    
                                    {/* Quick Crew Switcher */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-space-md">
                                        {crewList.map(crew => {
                                            const isActive = selectedCrew === crew.id;
                                            return (
                                                <button 
                                                    key={crew.id}
                                                    onClick={() => selectCrew(crew.id)}
                                                    className={`p-2 rounded-lg flex flex-col items-center text-center transition-all shadow-sm ${isActive ? 'bg-surface-container ring-2 ring-primary-container' : 'bg-surface-container-low hover:bg-surface-container'}`} 
                                                    type="button"
                                                >
                                                    <div className="relative w-11 h-11 rounded-full overflow-hidden mb-1.5 bg-surface-container-high">
                                                        <img className="w-full h-full object-cover" src={crew.img} alt={crew.name} />
                                                    </div>
                                                    <span className="font-label-md text-label-md text-on-surface font-bold leading-tight">{crew.name}</span>
                                                    <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight">{crew.role}</span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* PIN Display */}
                                    <div className="bg-surface-container-low rounded-lg p-3 flex flex-col items-center justify-center mb-space-sm shadow-inner">
                                        <span className="font-label-sm text-label-sm text-on-surface-variant mb-2">2. Masukkan Kode PIN Rahasia</span>
                                        <div className="flex items-center gap-3">
                                            {[0, 1, 2, 3].map(idx => (
                                                <div key={idx} className={`w-4 h-4 rounded-full transition-all duration-150 ${idx < pinCode.length ? 'bg-primary-container scale-125 shadow-sm' : 'bg-surface-container-highest'}`}></div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Keypad */}
                                    <div className="grid grid-cols-3 gap-2 sm:gap-2.5 max-w-sm mx-auto">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                            <button key={num} onClick={() => handlePinPress(num.toString())} className="h-14 rounded-base bg-surface-container-low hover:bg-surface-container font-num-keypad text-num-keypad text-on-surface font-bold shadow-sm active:translate-y-1 transition-all" type="button">{num}</button>
                                        ))}
                                        <button onClick={handleClearPin} className="h-14 rounded-base bg-error-container hover:bg-error-container/80 text-error font-title-lg text-title-lg font-bold shadow-sm active:translate-y-1 transition-all flex items-center justify-center" type="button">
                                            <span className="material-symbols-outlined text-[24px]">backspace</span>
                                        </button>
                                        <button onClick={() => handlePinPress('0')} className="h-14 rounded-base bg-surface-container-low hover:bg-surface-container font-num-keypad text-num-keypad text-on-surface font-bold shadow-sm active:translate-y-1 transition-all" type="button">0</button>
                                        <button className="h-14 rounded-base bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container font-title-lg text-title-lg font-bold shadow-sm active:translate-y-1 transition-all flex items-center justify-center" type="button">
                                            <span className="material-symbols-outlined text-[26px]">check_circle</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Card 2: Live Shift Attendance Log */}
                                <div className="bg-surface-container-lowest rounded-lg p-space-md lg:p-space-lg shadow-[0_4px_20px_-2px_rgba(70,42,25,0.07)]">
                                    <div className="flex items-center justify-between gap-space-xs pb-space-sm border-b border-surface-container-low mb-space-sm">
                                        <div>
                                            <h2 className="font-title-md text-title-md text-on-surface font-extrabold">Kehadiran Shift Sore-Malam</h2>
                                            <p className="font-label-sm text-label-sm text-on-surface-variant">Update terkoneksi real-time KOT server</p>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">2 Hadir</span>
                                            <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">1 Menunggu</span>
                                            <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-bold">0 Absen</span>
                                        </div>
                                    </div>

                                    {/* Attendance Roster Items */}
                                    <div className="flex flex-col gap-2">
                                        {attendances.length > 0 ? attendances.map((att) => (
                                            <div key={att.id} className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full overflow-hidden bg-surface-container-high shrink-0">
                                                        <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYIMiam64ARx5var1mH680o8kmG2tuHZ4_DMS5xQgtEQl5bpQ-N7BPWG1ZdhWiJetzTWvLpuBIMAKs6tYubrQ66KHDPpN83JrWNoh9yZoubeGi2GQy7gaioMHsOXsIQpWnEnTW01JCoFXLdzowbUW8z_giWsQ7crBGTstT7Rpx7JwdIFPwzXNeksWs41SLtKq4IsNZD6YzPeKKG5CUUQdvPJr-_-5G9hB_HOlJnWokW0QriD5h5wpg" alt="" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-title-md text-title-md text-on-surface font-bold leading-none">{att.user?.name || 'Karyawan'}</span>
                                                            <span className="font-label-sm text-label-sm text-tertiary font-bold bg-tertiary-fixed/60 px-1.5 py-0.2 rounded-full">{att.notes}</span>
                                                        </div>
                                                        <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5 inline-block">Jam: <strong>{new Date(att.created_at).toLocaleTimeString('id-ID', { hour12: false })} WIB</strong></span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-right">
                                                    <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
                                                    <span className="font-label-sm text-label-sm font-bold text-tertiary">Foto &amp; GPS OK</span>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="p-4 text-center text-on-surface-variant">Belum ada data kehadiran hari ini.</div>
                                        )}
                                    </div>

                                    {/* Toast Status */}
                                    {statusToast.show && (
                                        <div className="mt-space-sm p-2.5 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-between text-left animate-in fade-in duration-300">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[20px] text-tertiary">check_circle</span>
                                                <span className="font-label-md text-label-md font-bold">{statusToast.message}</span>
                                            </div>
                                            <span className="font-label-sm text-label-sm text-on-tertiary-fixed-variant">Sinkron KOT • 0ms</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
