import React, { useState, useEffect } from 'react';
import PosHeader from '../components/layout/PosHeader';

export default function AttendanceScreen() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [pinCode, setPinCode] = useState('');
    const [selectedCrewId, setSelectedCrewId] = useState(null);
    const [statusToast, setStatusToast] = useState({ show: false, message: '', type: 'success' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pinError, setPinError] = useState('');

    const [crewList, setCrewList] = useState([]);
    const [attendances, setAttendances] = useState([]);
    const [branch, setBranch] = useState(null);
    const [activeShift, setActiveShift] = useState(null);

    // Load branch info from localStorage (set by login/header)
    useEffect(() => {
        const saved = localStorage.getItem('pos_branch');
        if (saved) {
            try { setBranch(JSON.parse(saved)); } catch (_) {}
        }
    }, []);

    const loadCrew = async () => {
        try {
            const branchId = branch?.id || 1;
            const res = await window.apiClient.get(`/admin/employees?branch_id=${branchId}`);
            if (res.status === 'success') {
                const employees = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                const mapped = employees.map(emp => ({
                    id: emp.id,
                    name: emp.name,
                    role: emp.role || 'Staff',
                    branch_id: emp.branch_id,
                }));
                setCrewList(mapped);
                if (mapped.length > 0 && !selectedCrewId) {
                    setSelectedCrewId(mapped[0].id);
                }
            }
        } catch (err) {
            console.error('Error loading crew:', err);
        }
    };

    const loadAttendances = async () => {
        try {
            const branchId = branch?.id || 1;
            const res = await window.apiClient.get(`/attendances?branch_id=${branchId}`);
            if (res.status === 'success') {
                setAttendances(res.data);
            }
        } catch (err) {
            console.error('Error loading attendances:', err);
        }
    };

    const loadActiveShift = async () => {
        try {
            const cashier = JSON.parse(localStorage.getItem('pos_cashier') || '{}');
            const userId = cashier?.id || 1;
            const res = await window.apiClient.get(`/shift/current?user_id=${userId}&branch_id=${branch?.id || 1}`);
            if (res.status === 'success' && res.data) {
                setActiveShift(res.data);
            }
        } catch (err) {
            console.error('Error loading shift:', err);
        }
    };

    useEffect(() => {
        loadCrew();
        loadAttendances();
        loadActiveShift();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, [branch]);

    const formatTime = (date) => {
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    const showToast = (message, type = 'success') => {
        setStatusToast({ show: true, message, type });
        setTimeout(() => setStatusToast({ show: false, message: '', type: 'success' }), 4000);
    };

    const handlePinPress = (val) => {
        if (isSubmitting) return;
        if (pinCode.length < 6) {
            const next = pinCode + val;
            setPinCode(next);
            setPinError('');
        }
    };

    const handleClearPin = () => {
        setPinCode(prev => prev.slice(0, -1));
        setPinError('');
    };

    const handleClearAll = () => {
        setPinCode('');
        setPinError('');
    };

    const selectCrew = (id) => {
        setSelectedCrewId(id);
        setPinCode('');
        setPinError('');
    };

    const handleAction = async (action) => {
        if (!selectedCrewId) {
            showToast('Pilih karyawan terlebih dahulu.', 'error');
            return;
        }
        if (pinCode.length < 4) {
            setPinError('Masukkan minimal 4 digit PIN.');
            return;
        }
        if (!activeShift && action !== 'retake') {
            showToast('Tidak ada shift aktif. Buka shift terlebih dahulu.', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await window.apiClient.post('/attendances', {
                user_id: selectedCrewId,
                pin: pinCode,
                type: action,
                shift_id: activeShift?.id || null,
            });

            if (res.status === 'success') {
                const messages = {
                    clock_in: '✅ Clock In berhasil! Selamat bertugas.',
                    clock_out: '✅ Clock Out berhasil! Terima kasih sudah bertugas.',
                    break_start: '☕ Istirahat dimulai. Kembali sebelum 30 menit ya!',
                    break_end: '✅ Istirahat selesai. Lanjut bertugas!',
                };
                showToast(messages[action] || 'Absensi berhasil dicatat.', 'success');
                setPinCode('');
                loadAttendances();
            } else {
                setPinError(res.message || 'Terjadi kesalahan.');
                setPinCode('');
            }
        } catch (err) {
            const msg = err?.data?.message || 'PIN salah atau server error.';
            if (msg.toLowerCase().includes('pin')) {
                setPinError('PIN salah. Coba lagi.');
            } else {
                showToast(msg, 'error');
            }
            setPinCode('');
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedCrew = crewList.find(c => c.id === selectedCrewId);
    const branchName = branch?.name || 'Memuat Cabang...';

    return (
        <div className="bg-background font-body-md text-on-surface antialiased min-h-screen select-none">
            <PosHeader />

            <main className="w-full pt-20 bg-background pb-10">
                <div className="w-full max-w-[1600px] mx-auto p-space-md lg:p-space-lg">

                    {/* Sub-header */}
                    <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
                        <div className="flex items-center gap-space-sm">
                            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shadow-sm">
                                <span className="material-symbols-outlined text-[24px]">timer</span>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="font-headline-md text-headline-md text-on-surface">Absensi &amp; Presensi Tim</h1>
                                    {activeShift && (
                                        <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold capitalize">
                                            {activeShift.shift_type}
                                        </span>
                                    )}
                                </div>
                                <p className="font-body-md text-body-md text-on-surface-variant">
                                    {branchName} • {formatDate(currentTime)}
                                </p>
                            </div>
                        </div>
                        <div className="font-mono text-2xl font-black text-primary tracking-widest bg-surface-container-low px-4 py-2 rounded-full shadow-sm">
                            {formatTime(currentTime)} WIB
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">

                        {/* KIRI: Pilih Karyawan + PIN + Aksi */}
                        <div className="lg:col-span-5 flex flex-col gap-space-md">

                            {/* Pilih Karyawan */}
                            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm">
                                <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant tracking-wider block mb-3">
                                    1. Pilih Karyawan
                                </span>
                                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                                    {crewList.length === 0 && (
                                        <p className="col-span-2 text-center text-on-surface-variant font-body-md text-body-md py-4">Memuat daftar karyawan...</p>
                                    )}
                                    {crewList.map(crew => {
                                        const isActive = selectedCrewId === crew.id;
                                        return (
                                            <button
                                                key={crew.id}
                                                onClick={() => selectCrew(crew.id)}
                                                className={`p-3 rounded-xl flex items-center gap-3 text-left transition-all shadow-sm ${isActive ? 'bg-primary-container ring-2 ring-primary' : 'bg-surface-container-low hover:bg-surface-container'}`}
                                                type="button"
                                            >
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${isActive ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                                                    {crew.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-label-md text-label-md text-on-surface font-bold truncate">{crew.name.split(' ')[0]}</span>
                                                    <span className="font-label-sm text-label-sm text-on-surface-variant capitalize">{crew.role}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* PIN Input */}
                            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant tracking-wider">
                                        2. Masukkan PIN (4-6 Digit)
                                    </span>
                                    <span className="font-label-sm text-label-sm text-primary font-bold">{pinCode.length}/6</span>
                                </div>

                                {/* PIN Dots */}
                                <div className={`flex items-center justify-center gap-3 bg-surface-container-low p-4 rounded-xl shadow-inner mb-3 ${pinError ? 'ring-2 ring-error' : ''}`}>
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${i < pinCode.length ? 'bg-primary shadow-[0_0_10px_rgba(217,142,63,0.7)] scale-125' : 'bg-surface-variant'}`}></div>
                                    ))}
                                </div>

                                {pinError && (
                                    <div className="mb-3 px-3 py-2 rounded-lg bg-error-container text-on-error-container font-label-sm text-label-sm flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">error</span>
                                        {pinError}
                                    </div>
                                )}

                                {/* Numpad */}
                                <div className="grid grid-cols-3 gap-2">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                        <button
                                            key={num}
                                            onClick={() => handlePinPress(num.toString())}
                                            disabled={isSubmitting}
                                            className="h-14 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-bold text-xl shadow-sm active:translate-y-0.5 transition-all disabled:opacity-50"
                                            type="button"
                                        >
                                            {num}
                                        </button>
                                    ))}
                                    <button onClick={handleClearPin} disabled={isSubmitting} className="h-14 rounded-xl bg-error-container text-error hover:opacity-90 shadow-sm active:translate-y-0.5 transition-all flex items-center justify-center disabled:opacity-50" type="button">
                                        <span className="material-symbols-outlined text-[22px]">backspace</span>
                                    </button>
                                    <button onClick={() => handlePinPress('0')} disabled={isSubmitting} className="h-14 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-bold text-xl shadow-sm active:translate-y-0.5 transition-all disabled:opacity-50" type="button">0</button>
                                    <button onClick={handleClearAll} disabled={isSubmitting} className="h-14 rounded-xl bg-surface-container text-on-surface-variant hover:bg-surface-container-high shadow-sm active:translate-y-0.5 transition-all flex items-center justify-center text-xs font-bold disabled:opacity-50" type="button">HAPUS</button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-3">
                                <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant tracking-wider">3. Pilih Aksi Shift</span>

                                <button
                                    onClick={() => handleAction('clock_in')}
                                    disabled={isSubmitting || pinCode.length < 4}
                                    className="h-16 w-full rounded-2xl bg-primary text-on-primary font-title-lg text-title-lg flex items-center justify-between px-space-lg shadow-md transition-all active:translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed group"
                                    type="button"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>login</span>
                                        <div className="flex flex-col text-left">
                                            <span className="font-bold leading-none">CLOCK IN (Masuk Shift)</span>
                                            <span className="text-sm opacity-80 mt-0.5">
                                                {selectedCrew ? selectedCrew.name : 'Pilih karyawan dulu'}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-[24px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </button>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleAction('clock_out')}
                                        disabled={isSubmitting || pinCode.length < 4}
                                        className="h-14 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
                                        type="button"
                                    >
                                        <span className="material-symbols-outlined text-error text-[20px]">logout</span>
                                        CLOCK OUT
                                    </button>
                                    <button
                                        onClick={() => handleAction('break_start')}
                                        disabled={isSubmitting || pinCode.length < 4}
                                        className="h-14 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
                                        type="button"
                                    >
                                        <span className="material-symbols-outlined text-secondary text-[20px]">coffee</span>
                                        Istirahat
                                    </button>
                                </div>

                                {isSubmitting && (
                                    <div className="flex items-center justify-center gap-2 text-primary font-label-md text-label-md py-2">
                                        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                                        Memverifikasi PIN &amp; menyimpan...
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* KANAN: Log Kehadiran */}
                        <div className="lg:col-span-7 flex flex-col gap-space-md">

                            {/* Toast */}
                            {statusToast.show && (
                                <div className={`p-3.5 rounded-xl flex items-center gap-3 shadow-md ${statusToast.type === 'success' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-error-container text-on-error-container'}`}>
                                    <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        {statusToast.type === 'success' ? 'check_circle' : 'error'}
                                    </span>
                                    <span className="font-label-md text-label-md font-bold">{statusToast.message}</span>
                                </div>
                            )}

                            {/* Attendance Log */}
                            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col">
                                <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-low mb-space-sm">
                                    <div>
                                        <h2 className="font-title-md text-title-md text-on-surface font-extrabold">Log Kehadiran Hari Ini</h2>
                                        <p className="font-label-sm text-label-sm text-on-surface-variant">{branchName} • Update real-time</p>
                                    </div>
                                    <button onClick={loadAttendances} className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high flex items-center justify-center transition-colors" type="button" title="Refresh">
                                        <span className="material-symbols-outlined text-[18px]">refresh</span>
                                    </button>
                                </div>

                                <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto">
                                    {attendances.length > 0 ? attendances.map((att) => (
                                        <div key={att.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                                                    {att.user?.name?.substring(0, 2).toUpperCase() || 'KW'}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-title-sm text-title-sm text-on-surface font-bold">{att.user?.name || 'Karyawan'}</span>
                                                        <span className={`font-label-sm text-label-sm font-bold px-2 py-0.5 rounded-full ${att.notes === 'clock_in' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : att.notes === 'clock_out' ? 'bg-error-container text-on-error-container' : 'bg-secondary-fixed text-on-secondary-fixed'}`}>
                                                            {att.notes === 'clock_in' ? 'MASUK' : att.notes === 'clock_out' ? 'PULANG' : att.notes?.replace('_', ' ').toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                                                        {new Date(att.created_at).toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit' })} WIB
                                                        {att.shift && <span className="ml-2 text-primary capitalize">• {att.shift.shift_type}</span>}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="material-symbols-outlined text-tertiary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                        </div>
                                    )) : (
                                        <div className="py-10 text-center text-on-surface-variant">
                                            <span className="material-symbols-outlined text-[48px] mb-2 block opacity-40">event_note</span>
                                            <p className="font-body-md text-body-md">Belum ada data kehadiran hari ini.</p>
                                            <p className="font-label-sm text-label-sm">Karyawan bisa Clock In menggunakan PIN masing-masing.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Shift Info Card */}
                            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[22px]">schedule</span>
                                    </div>
                                    <div>
                                        <p className="font-label-md text-label-md font-bold text-on-surface">
                                            {activeShift ? `Shift Aktif: ${activeShift.shift_type}` : 'Belum Ada Shift Aktif'}
                                        </p>
                                        <p className="font-label-sm text-label-sm text-on-surface-variant">
                                            {activeShift
                                                ? `Dibuka: ${new Date(activeShift.opened_at || activeShift.created_at).toLocaleTimeString('id-ID', { hour12: false })} WIB`
                                                : 'Buka shift terlebih dahulu di menu "Buka Shift"'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
