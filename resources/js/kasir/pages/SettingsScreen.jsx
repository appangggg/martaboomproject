import React, { useState } from 'react';
import PosHeader from '../components/layout/PosHeader';

export default function SettingsScreen() {
    const [toastState, setToastState] = useState({ show: false, message: '', icon: '' });
    const [isScanning, setIsScanning] = useState(false);
    const [isTestingEpson, setIsTestingEpson] = useState(false);
    const [isTestingSunmi, setIsTestingSunmi] = useState(false);

    const showToast = (message, icon = 'check_circle') => {
        setToastState({ show: true, message, icon });
        setTimeout(() => {
            setToastState({ show: false, message: '', icon: '' });
        }, 2800);
    };

    const handleScanDevices = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            showToast('Pindai selesai: Tidak ada perangkat baru ditemukan.', 'bluetooth');
        }, 1600);
    };

    const handleTestPrintEpson = () => {
        setIsTestingEpson(true);
        setTimeout(() => {
            setIsTestingEpson(false);
            showToast('Kertas uji berhasil dicetak di Epson TM-T82 (Struk Kasir)', 'print');
        }, 1200);
    };

    const handleTestPrintSunmi = () => {
        setIsTestingSunmi(true);
        setTimeout(() => {
            setIsTestingSunmi(false);
            showToast('Kertas uji berhasil dicetak di Sunmi KOT Dapur (Griddle)', 'print');
        }, 1200);
    };

    const handleKickDrawer = () => {
        showToast('Perintah Buka Laci Kasir (RJ11) terkirim!', 'lock_open');
    };

    const handleSaveStatus = () => {
        showToast('Seluruh konfigurasi POS Tebet Barat disimpan.', 'save');
    };

    const handleCheckUpdate = () => {
        showToast('Aplikasi menggunakan versi terbaru (v2.4.1).', 'cloud_done');
    };

    const handleHelpSupport = () => {
        showToast('Menghubungkan ke Tim IT Helpdesk Martaboom...', 'headset_mic');
    };

    const handleLogoutSession = () => {
        if (window.confirm('Apakah kasir Budi Santoso yakin ingin mengakhiri sesi kasir ini?')) {
            showToast('Mengunci sesi kasir...', 'lock');
        }
    };

    return (
        <div className="bg-background font-body-md text-on-surface antialiased min-h-screen select-none">
            <PosHeader />
            
            <main className="w-full pt-20 bg-background pb-10">
                <div className="flex flex-col w-full">
                    <div className="w-full px-space-lg py-space-md">
                        
                        {/* Header Context Strip */}
                        <div className="w-full bg-surface-container-low rounded-lg p-space-md shadow-sm mb-space-lg flex flex-wrap items-center justify-between gap-space-sm">
                            <div className="flex items-center gap-space-md">
                                <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-[0_2px_8px_rgba(217,142,63,0.35)] shrink-0">
                                    <span className="material-symbols-outlined text-[26px]">tune</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-space-xs">
                                        <span className="font-headline-md text-headline-md text-on-surface">Pengaturan Kasir &amp; Perangkat Hardware</span>
                                        <span className="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">POS #01</span>
                                    </div>
                                    <p className="font-body-md text-body-md text-on-surface-variant">Konfigurasi printer thermal, laci kas, preferensi layar kasir &amp; status operasional.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-space-sm">
                                <div className="flex items-center gap-2 bg-surface-container-lowest px-space-md py-2 rounded-full shadow-sm">
                                    <span className="material-symbols-outlined text-primary text-[20px]">storefront</span>
                                    <span className="font-label-md text-label-md text-on-surface font-bold">Outlet: Cabang Tebet Barat</span>
                                    <span className="text-outline-variant font-label-md">/</span>
                                    <span className="font-label-md text-label-md text-tertiary font-bold flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                                        Siap Operasional
                                    </span>
                                </div>
                                <button onClick={handleSaveStatus} className="h-12 px-space-lg rounded-full bg-primary text-on-primary font-label-lg text-label-lg flex items-center gap-2 shadow-[0_4px_16px_rgba(140,80,0,0.25)] active:scale-95 transition-transform" type="button">
                                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                    <span>Simpan Preferensi</span>
                                </button>
                            </div>
                        </div>

                        {/* 3-Column Landscape Grid Architecture */}
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
                            
                            {/* KOLOM 1: Hardware & Printer Management (5 Cols on XL) */}
                            <section className="xl:col-span-5 flex flex-col gap-space-md">
                                {/* Header Card Section */}
                                <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col gap-space-md">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-[24px]">print</span>
                                            <h2 className="font-title-lg text-title-lg text-on-surface">Printer &amp; Perangkat Keras</h2>
                                        </div>
                                        <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2 py-1 rounded-full">3 Terdaftar</span>
                                    </div>
                                    <p className="font-body-md text-body-md text-on-surface-variant">Kelola perangkat cetak struk pembeli, tiket pesanan dapur (KOT), dan sensor laci kasir otomatis.</p>
                                    <button onClick={handleScanDevices} disabled={isScanning} className="w-full h-14 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-base font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all" type="button">
                                        <span className={`material-symbols-outlined text-primary text-[22px] ${isScanning ? 'animate-spin' : ''}`}>bluetooth_searching</span>
                                        <span>{isScanning ? 'Memindai perangkat sekitar...' : 'Pindai Perangkat Bluetooth / WiFi Baru (+)'}</span>
                                    </button>
                                </div>

                                {/* List of Printers */}
                                {/* Printer 1: Epson TM-T82 Bluetooth */}
                                <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col gap-space-sm relative overflow-hidden">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-start gap-space-sm">
                                            <div className="w-12 h-12 rounded-base bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0 shadow-sm">
                                                <span className="material-symbols-outlined text-[26px]">receipt_long</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-title-md text-title-md text-on-surface">Epson TM-T82</h3>
                                                    <span className="font-label-sm text-label-sm bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded font-bold">BT</span>
                                                </div>
                                                <p className="font-label-sm text-label-sm text-on-surface-variant">MAC: 00:1B:66:82:11:A4 • Roll Lebar 80mm</p>
                                                <div className="mt-1 flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                                                    <span className="font-label-sm text-label-sm text-tertiary font-bold">Terhubung • Siap Cetak</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm px-2.5 py-1 rounded-full font-bold">
                                            Struk Pelanggan
                                        </span>
                                    </div>
                                    <div className="w-full h-px bg-surface-container my-1"></div>
                                    <div className="grid grid-cols-2 gap-space-xs">
                                        <button onClick={handleTestPrintEpson} disabled={isTestingEpson} className="h-14 px-space-sm rounded-base bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all" type="button">
                                            {isTestingEpson ? (
                                                <>
                                                    <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                                                    <span>Mencetak...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined text-primary text-[18px]">print_connect</span>
                                                    <span>Uji Kertas Struk</span>
                                                </>
                                            )}
                                        </button>
                                        <div className="flex items-center justify-between bg-surface-container-low px-space-sm py-2 rounded-base h-14">
                                            <div className="flex flex-col">
                                                <span className="font-label-sm text-label-sm text-on-surface font-bold leading-tight">Auto-Cut</span>
                                                <span className="font-label-sm text-[10px] text-on-surface-variant leading-tight">Potong Kertas</span>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-primary after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Printer 2: Sunmi Dapur / Griddle LAN */}
                                <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col gap-space-sm">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-start gap-space-sm">
                                            <div className="w-12 h-12 rounded-base bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed-variant shrink-0 shadow-sm">
                                                <span className="material-symbols-outlined text-[26px]">skillet</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-title-md text-title-md text-on-surface">Sunmi Dapur &amp; Griddle</h3>
                                                    <span className="font-label-sm text-label-sm bg-tertiary-container text-on-tertiary-container px-1.5 py-0.5 rounded font-bold">LAN</span>
                                                </div>
                                                <p className="font-label-sm text-label-sm text-on-surface-variant">IP: 192.168.1.120 • Port: 9100</p>
                                                <div className="mt-1 flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                                                    <span className="font-label-sm text-label-sm text-tertiary font-bold">Terhubung • Respon 12ms</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm px-2.5 py-1 rounded-full font-bold">
                                            Tiket KOT Dapur
                                        </span>
                                    </div>
                                    <div className="w-full h-px bg-surface-container my-1"></div>
                                    <div className="flex gap-space-xs">
                                        <button onClick={handleTestPrintSunmi} disabled={isTestingSunmi} className="w-full h-14 rounded-base bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-bold flex items-center justify-center gap-2 active:scale-95 transition-all" type="button">
                                            {isTestingSunmi ? (
                                                <>
                                                    <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                                                    <span>Mencetak...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined text-primary text-[20px]">restaurant_menu</span>
                                                    <span>Test Print KOT Dapur</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Printer 3: Panda PRJ-58D USB (Standby) */}
                                <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col gap-space-sm opacity-80">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-start gap-space-sm">
                                            <div className="w-12 h-12 rounded-base bg-surface-container flex items-center justify-center text-outline shrink-0">
                                                <span className="material-symbols-outlined text-[26px]">usb</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-title-md text-title-md text-on-surface">Panda PRJ-58D</h3>
                                                    <span className="font-label-sm text-label-sm bg-surface-container-highest text-on-surface-variant px-1.5 py-0.5 rounded font-bold">USB</span>
                                                </div>
                                                <p className="font-label-sm text-label-sm text-on-surface-variant">Koneksi Kabel USB Kasir • Roll 58mm</p>
                                                <div className="mt-1 flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-outline"></span>
                                                    <span className="font-label-sm text-label-sm text-outline font-bold">Tidak Tersambung / Standby</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="h-9 px-3 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-bold" type="button">
                                            Hubungkan
                                        </button>
                                    </div>
                                </div>

                                {/* Cash Drawer Hardware Toggle */}
                                <div className="bg-surface-container p-space-lg rounded-lg shadow-sm flex items-center justify-between gap-space-md">
                                    <div className="flex items-center gap-space-sm">
                                        <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-[24px]">point_of_sale</span>
                                        </div>
                                        <div>
                                            <h4 className="font-title-md text-title-md text-on-surface">Laci Kasir (Cash Drawer RJ11)</h4>
                                            <p className="font-body-md text-body-md text-on-surface-variant">Buka otomatis pemicu solenoide saat transaksi tunai lunas</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button onClick={handleKickDrawer} className="h-12 px-3 rounded-base bg-surface-container-lowest text-primary font-label-sm text-label-sm font-bold active:scale-95 transition-transform shadow-xs" type="button">
                                            Uji Buka Laci
                                        </button>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-14 h-8 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-on-primary after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-container"></div>
                                        </label>
                                    </div>
                                </div>
                            </section>

                            {/* KOLOM 2: Preferensi Antarmuka & Operasional Kasir (4 Cols on XL) */}
                            <section className="xl:col-span-4 flex flex-col gap-space-md">
                                {/* Header Mode Antarmuka */}
                                <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col gap-space-md">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-[24px]">palette</span>
                                        <h2 className="font-title-lg text-title-lg text-on-surface">Tampilan &amp; Sentuhan Layar</h2>
                                    </div>
                                    <p className="font-body-md text-body-md text-on-surface-variant">Optimalkan kontras visual dan ukuran font untuk kecepatan input kasir saat jam padat antrean.</p>
                                    
                                    {/* Mode Layar */}
                                    <div className="flex flex-col gap-2">
                                        <span className="font-label-md text-label-md text-on-surface font-bold">Tema Tampilan Kasir</span>
                                        <div className="grid grid-cols-2 gap-space-xs">
                                            {/* Mode Terang */}
                                            <div className="bg-surface-container-low p-space-sm rounded-base shadow-[0_2px_8px_rgba(217,142,63,0.25)] flex flex-col gap-2 cursor-pointer transition-all hover:bg-surface-container relative">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5 text-primary">
                                                        <span className="material-symbols-outlined text-[20px]">light_mode</span>
                                                        <span className="font-title-md text-title-md font-bold">Terang Krem</span>
                                                    </div>
                                                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                                                </div>
                                                <div className="w-full h-12 bg-background rounded-DEFAULT p-1.5 flex gap-1 items-center">
                                                    <div className="w-1/3 h-full bg-surface-container-highest rounded-sm"></div>
                                                    <div className="w-2/3 h-full bg-primary-container rounded-sm"></div>
                                                </div>
                                                <span className="font-label-sm text-label-sm text-on-surface-variant">Warm Pastry default</span>
                                            </div>
                                            {/* Mode Gelap */}
                                            <div className="bg-surface-container-lowest p-space-sm rounded-base shadow-sm flex flex-col gap-2 cursor-pointer hover:bg-surface-container-low transition-all">
                                                <div className="flex items-center justify-between text-outline">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="material-symbols-outlined text-[20px]">dark_mode</span>
                                                        <span className="font-title-md text-title-md font-bold">Espresso</span>
                                                    </div>
                                                </div>
                                                <div className="w-full h-12 bg-inverse-surface rounded-DEFAULT p-1.5 flex gap-1 items-center">
                                                    <div className="w-1/3 h-full bg-on-surface-variant rounded-sm"></div>
                                                    <div className="w-2/3 h-full bg-primary rounded-sm"></div>
                                                </div>
                                                <span className="font-label-sm text-label-sm text-outline">Pencahayaan redup malam</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Ukuran Font */}
                                    <div className="flex flex-col gap-2 mt-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-label-md text-label-md text-on-surface font-bold">Ukuran Huruf Layar Tablet</span>
                                            <span className="font-label-sm text-label-sm text-primary font-bold">Optimal iPad (Besar)</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-1.5 bg-surface-container-low p-1.5 rounded-full">
                                            <button className="py-2.5 rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors text-center font-bold" type="button">
                                                Standar
                                            </button>
                                            <button className="py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md font-bold shadow-sm text-center" type="button">
                                                Besar (iPad)
                                            </button>
                                            <button className="py-2.5 rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors text-center font-bold" type="button">
                                                Ekstra Besar
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Suara, Audio & Keamanan Kasir */}
                                <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col gap-space-md">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-[24px]">volume_up</span>
                                        <h2 className="font-title-lg text-title-lg text-on-surface">Audio &amp; Keamanan Kasir</h2>
                                    </div>
                                    <div className="flex flex-col gap-space-sm">
                                        {/* Row 1 */}
                                        <div className="flex items-center justify-between py-1">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface shrink-0">
                                                    <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-title-md text-title-md text-on-surface leading-snug">Beep Saat Tambah Item</h4>
                                                    <p className="font-body-md text-body-md text-on-surface-variant">Konfirmasi getar/audio instan setiap ketukan</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-12 h-7 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-primary after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-container"></div>
                                            </label>
                                        </div>
                                        <div className="w-full h-px bg-surface-container"></div>
                                        
                                        {/* Row 2 */}
                                        <div className="flex items-center justify-between py-1">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface shrink-0">
                                                    <span className="material-symbols-outlined text-[20px]">campaign</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-title-md text-title-md text-on-surface leading-snug">Notifikasi Pesanan Masuk</h4>
                                                    <p className="font-body-md text-body-md text-on-surface-variant">Denting suara saat pesanan online diterima</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-12 h-7 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-primary after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-container"></div>
                                            </label>
                                        </div>
                                        <div className="w-full h-px bg-surface-container"></div>
                                        
                                        {/* Row 3 */}
                                        <div className="flex items-center justify-between py-1">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface shrink-0">
                                                    <span className="material-symbols-outlined text-[20px]">lock_clock</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-title-md text-title-md text-on-surface leading-snug">Kunci Otomatis (PIN)</h4>
                                                    <p className="font-body-md text-body-md text-on-surface-variant">Kunci layar setelah 5 menit kasir ditinggalkan</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-12 h-7 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-primary after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-container"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* KOLOM 3: Info Sistem & Cabang (3 Cols on XL) */}
                            <section className="xl:col-span-3 flex flex-col gap-space-md">
                                {/* Outlet Profile Card */}
                                <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col gap-space-sm relative overflow-hidden">
                                    <div className="w-full flex items-center justify-between">
                                        <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Profil Gerai Aktif</span>
                                        <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                                    </div>
                                    <div className="flex items-center gap-3 my-1">
                                        <div className="w-14 h-14 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shadow-sm shrink-0">
                                            <span className="material-symbols-outlined text-[30px]">store</span>
                                        </div>
                                        <div>
                                            <h3 className="font-headline-md text-headline-md text-on-surface leading-tight">Cabang Tebet</h3>
                                            <p className="font-label-sm text-label-sm text-on-surface-variant">Jl. Tebet Barat Raya No. 12, Jaksel</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-28 rounded-base overflow-hidden relative shadow-inner">
                                        <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1uZE3XMbLAtCA0lB2qt1q8jgTMpXQWuZOMJIuiS-E2pE8_fPz_UpQNlj2fY76X3qxuF1zfkqMH2XZ7ekBknihoHF1tyxHHAzuLTQB50aWT6xvYBcV31jSaxQdZGjKBS6abwHdMOZiDdX8mS8NkIWNRkzJzMp-VQXvnf7gOYxI410Dn43fXooYHrv6msHCN_ne8K5O1HvRIgfQ2osg8NsnUboLH5VSqyPzkTqGTjyJQKgeagCUxrjj" alt="Store Ambience" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                                            <span className="text-on-primary font-label-sm text-label-sm font-bold flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px]">location_on</span>
                                                Jakarta Selatan 12810
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Sync & Offline Storage Health Card */}
                                <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col gap-space-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="font-label-md text-label-md text-on-surface font-bold">Konektivitas Cloud POS</span>
                                        <span className="flex items-center gap-1 font-label-sm text-label-sm text-tertiary font-bold bg-tertiary-fixed px-2 py-0.5 rounded-full">
                                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                                            Realtime Sync
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between bg-surface-container-low p-space-sm rounded-base">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-[20px]">database</span>
                                            <div>
                                                <span className="font-label-md text-label-md text-on-surface block font-bold">Data Offline Lokal</span>
                                                <span className="font-label-sm text-label-sm text-on-surface-variant">48 Transaksi Tersimpan</span>
                                            </div>
                                        </div>
                                        <span className="font-title-md text-title-md text-primary font-bold">12.4 MB</span>
                                    </div>
                                    <div className="flex flex-col gap-1 text-on-surface-variant font-label-sm text-label-sm px-1 pt-1">
                                        <div className="flex justify-between">
                                            <span>Versi Aplikasi:</span>
                                            <span className="font-bold text-on-surface">v2.4.1 (Build 2024.10)</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>ID Terminal:</span>
                                            <span className="font-mono text-on-surface font-semibold">MB-POS-TBT-01</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Memori iPad:</span>
                                            <span className="text-on-surface font-semibold">1.8 GB / 4.0 GB Bebas</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Command Stack */}
                                <div className="flex flex-col gap-space-xs">
                                    <button onClick={handleCheckUpdate} className="h-14 px-space-md rounded-base bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xs" type="button">
                                        <span className="material-symbols-outlined text-primary text-[20px]">system_update</span>
                                        <span>Periksa Pembaruan Sistem</span>
                                    </button>
                                    <button onClick={handleHelpSupport} className="h-14 px-space-md rounded-base bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xs" type="button">
                                        <span className="material-symbols-outlined text-secondary text-[20px]">support_agent</span>
                                        <span>Bantuan &amp; Kontak Support</span>
                                    </button>
                                    <button onClick={handleLogoutSession} className="h-14 px-space-md rounded-base bg-error-container hover:bg-error text-on-error-container hover:text-on-error font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xs" type="button">
                                        <span className="material-symbols-outlined text-[20px]">logout</span>
                                        <span>Keluar Sesi Kasir (Logout)</span>
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            {/* Toast Notification Container */}
            {toastState.show && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-space-lg py-space-md rounded-lg shadow-xl animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <span className="material-symbols-outlined text-tertiary-fixed text-[24px]">{toastState.icon}</span>
                    <span className="font-label-lg text-label-lg font-bold">{toastState.message}</span>
                </div>
            )}
        </div>
    );
}
