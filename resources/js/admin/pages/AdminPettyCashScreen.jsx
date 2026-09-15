import React, { useState } from 'react';

export default function AdminPettyCashScreen() {
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [topupNominal, setTopupNominal] = useState('Rp 1.000.000');

  const openReceipt = (title, amount, vendor, date, spv, image) => {
    setSelectedReceipt({ title, amount, vendor, date, spv, image });
    setIsReceiptModalOpen(true);
  };

  const handleTopup = (amount) => {
    setTopupNominal(`Rp ${amount}`);
  };

  const confirmReceipt = () => {
    alert('Bukti nota berhasil ditandai valid!');
    setIsReceiptModalOpen(false);
  };

  const approveReimbursement = () => {
    alert('Pengajuan Reimbursement Rp 84.000 berhasil disetujui!');
    setIsApproveModalOpen(false);
  };

  const processTopup = () => {
    alert('Instruksi Transfer VA BCA diterbitkan! Silakan konfirmasi pembayaran m-BCA.');
    setIsTopupModalOpen(false);
  };

  const transactions = [
    {
      id: 1,
      date: '24 Okt 2024',
      time: '17:30 WIB (Shift 2)',
      branch: 'Cabang Tebet',
      categoryIcon: 'propane_tank',
      category: 'Gas & Listrik',
      categoryColor: 'text-primary',
      desc: 'Beli Refill Gas Elpiji 12kg (2 Tabung)',
      descNote: 'Agen Gas Utama Tebet Barat - Restock darurat saat peak hour martabak',
      amount: 'Rp 440.000',
      cashier: 'Dimas',
      pin: 'PIN #104',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzDXUKOl80lLQN6Wo11NRdd0laoZSTU1H9-C5Ndymx3DLo0QvWTOODS7NfG1ygDx___WjhDdFAfVjbRwutEP2G3haGuMoC_KQkUV0dJRH-gEf6JQjBwHuemsX_kqaCzZG25jPeogo7iIXfqxfTPekJl7ipvki_EmjkuU20NhYermy14t2PF-DrwmxEfdKBGyNLogA_mYINl6MGrrR_bZMsKUEeB2C3cIqUoIAKXrYv8eP0_bvmfQ1dIA',
      status: 'Terverifikasi',
      statusColor: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
      statusIcon: 'check_circle',
      statusBy: 'Oleh: SPV Riko'
    },
    {
      id: 2,
      date: '24 Okt 2024',
      time: '15:10 WIB (Shift 1)',
      branch: 'Cabang Kemang',
      categoryIcon: 'ac_unit',
      category: 'Es Batu',
      categoryColor: 'text-primary-container',
      desc: '4 Kantong Es Kristal Tube Pesan Antar',
      descNote: 'Agen Es Polar Kemang - Order tambahan cuaca panas terik',
      amount: 'Rp 48.000',
      cashier: 'Siti',
      pin: 'PIN #202',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1DwJlWefVStDKmuGtJ2Q9CmAw_Guw5vaDcLiggzWiYqe48ft1W19y8jqaDDwZmN_vQOGsruQ5qgfgidUtDioGCKvJ1k-OVRCN9IkXRGZgmyoB2qUBFfuzjXj_DKxKtzoNnw7eRQ7YABTN6IJqN3eWu-w2gzdH5_wIqjrtQ6eFob2Fvg1rNJgjS024k28zN9O8HZPT--xj9jtOwQLpbffTY70YsMFAov2_1NF8DVWyPy6teQptdiPEMg',
      status: 'Terverifikasi',
      statusColor: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
      statusIcon: 'check_circle',
      statusBy: 'Oleh: SPV Doni'
    },
    {
      id: 3,
      date: '23 Okt 2024',
      time: '19:20 WIB (Shift 2)',
      branch: 'Cabang BSD',
      categoryIcon: 'shopping_cart',
      category: 'Bahan Darurat',
      categoryColor: 'text-secondary',
      desc: 'Beli Mentega Blueband Sachet 4 pcs di Indomaret',
      descWarning: 'Habis mendadak karena lonjakan martabak manis',
      amount: 'Rp 36.000',
      cashier: 'Rian',
      pin: 'PIN #305',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAag-8itsyGRLNZjaYpI4ye2B8b_djgNVcjs1y_he9TZUcTmXw4V4Zv1gEIW-H58MAnAEcvyy1-WtQZWL9Tvpng5ThaVwOY1MTnyuEnwb6MO1o-1PtgX5X8teJXJFfXEQWIFf1VFD4ceB-aOLEoSRBVJ42QhaDPAW6V8iJyAw9jSXvJzfeRjEBlo9B7Q2G_19NSI2AVP0BZUI3PHU55H15yrIIlN5rAjDEgtE6_TW3shsm_Jk7oYwuXAw',
      status: 'Catatan Khusus',
      statusColor: 'bg-secondary-fixed text-on-secondary-fixed-variant',
      statusIcon: 'help',
      statusBy: 'Audit BOM Darurat',
      isWarningRow: true
    },
    {
      id: 4,
      date: '23 Okt 2024',
      time: '16:00 WIB (Shift 1)',
      branch: 'Cabang Tebet',
      categoryIcon: 'cleaning_services',
      category: 'Kebersihan',
      categoryColor: 'text-tertiary',
      desc: 'Sabun Cuci Piring Sunlight 1.5L & Plastik Martabak Jumbo',
      descNote: 'Toko Plastik & Kimia Berkah Jaya',
      amount: 'Rp 85.000',
      cashier: 'Dimas',
      pin: 'PIN #104',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARO7akzy6tuV1HrJ4QF1HmldN5fU5j4lAtLe42b3fTVzWfhGD64igO_skZncAwaVGBVhz2yuN3vZFqwH8gugTrw1PBPSCFuEiPPEo5ne92654sDjChAvhbi_i_Iu9jfzThZEm2Ni0O9KdtAaw-WZmX6xdB5GbalaQTsmdRYGj3crJED5Jksd1SUFdwMzBjH_EKgc03xeKcbbcr1F4koh-lH4hWeGZEVfuJVKZmb0zME92jYa-gsGRD6w',
      status: 'Terverifikasi',
      statusColor: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
      statusIcon: 'check_circle',
      statusBy: 'Oleh: SPV Riko'
    }
  ];

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Top Level Action & Status Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md py-space-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>AUDIT REAL-TIME KAS KECIL OPERASIONAL</span>
            <span>•</span>
            <span className="text-primary font-semibold">4 CABANG TERMONITOR</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight mt-0.5">Laporan Kas Kecil (Petty Cash)</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Pengawasan pengeluaran darurat, pembelian es & gas, serta audit struk transaksi harian kasir.</p>
        </div>
        {/* Quick Action Hub */}
        <div className="flex flex-wrap items-center gap-space-sm">
          <button onClick={() => setIsTopupModalOpen(true)} className="flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container transition-all shadow-sm">
            <span className="material-symbols-outlined text-[18px] text-primary">account_balance_wallet</span>
            <span className="font-label-md text-label-md">Top-Up Kas via VA BCA</span>
          </button>
          <button onClick={() => setIsApproveModalOpen(true)} className="flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-primary text-on-primary hover:bg-on-primary-fixed-variant transition-all shadow-sm">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span className="font-label-md text-label-md">Setujui Reimbursement</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface shadow-sm transition-all" title="Ekspor Laporan XLS">
            <span className="material-symbols-outlined text-[20px]">download</span>
          </button>
        </div>
      </div>

      {/* Primary Financial Metrics Mosaic */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop mt-space-sm">
        {/* Card 1: Total Pengeluaran */}
        <div className="relative overflow-hidden p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Kas Keluar Bulan Ini</span>
              <span className="font-headline-kpi text-headline-kpi text-on-surface mt-1">Rp 6.200.000</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">payments</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-on-surface-variant font-body-table text-body-table">
              <span className="material-symbols-outlined text-[15px] text-tertiary">store</span>
              <span>Rata-rata <strong className="text-on-surface font-semibold">Rp 1.550.000</strong> / cabang</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-primary-container font-label-sm text-label-sm">4 Cabang Aktif</span>
          </div>
        </div>
        {/* Card 2: Kategori Terbesar */}
        <div className="relative overflow-hidden p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Beban Terbesar (39.5%)</span>
              <span className="font-headline-kpi text-headline-kpi text-primary mt-1">Rp 2.450.000</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant">
              <span className="material-symbols-outlined text-[22px]">propane_tank</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between">
            <span className="font-body-table text-body-table text-on-surface-variant">Kategori: <strong className="text-on-surface font-medium">Gas Elpiji 12kg & 3kg</strong></span>
            <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm">Beban Utama Dapur</span>
          </div>
        </div>
        {/* Card 3: Saldo Kas Tersisa & Warning */}
        <div className="relative overflow-hidden p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Saldo Kas Tersisa (4 Toko)</span>
              <span className="font-headline-kpi text-headline-kpi text-on-surface mt-1">Rp 1.800.000</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-error-container flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[22px]">warning</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-error font-body-table text-body-table font-semibold">
              <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
              <span>Perlu top-up: Cabang Kemang</span>
            </div>
            <button onClick={() => setIsTopupModalOpen(true)} className="text-primary hover:underline font-label-sm text-label-sm font-semibold">Top Up Sekarang →</button>
          </div>
        </div>
      </div>

      {/* Middle Grid: Category Breakdown & Operational Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop mt-space-md">
        {/* Category Donut Breakdown & Legend */}
        <div className="lg:col-span-8 p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-xs gap-space-xs">
            <div>
              <span className="font-headline-sm text-headline-sm text-on-surface">Distribusi Pengeluaran Kasir</span>
              <p className="font-body-table text-body-table text-on-surface-variant">Breakdown peruntukan dana darurat dan operational restock cabang</p>
            </div>
            <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm bg-surface-container px-2.5 py-1 rounded-full">
              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
              <span>Bulan Berjalan (1 - 24 Okt 2024)</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md items-center mt-space-sm">
            {/* SVG Donut Chart */}
            <div className="md:col-span-5 flex flex-col items-center justify-center relative py-space-sm">
              <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 160 160">
                <circle cx="80" cy="80" fill="none" r="62" stroke="#f6e5da" strokeWidth="20"></circle>
                <circle className="transition-all hover:opacity-90" cx="80" cy="80" fill="none" r="62" stroke="#8c5000" strokeDasharray="153.8 389.5" strokeDashoffset="0" strokeWidth="20"></circle>
                <circle className="transition-all hover:opacity-90" cx="80" cy="80" fill="none" r="62" stroke="#d98e3f" strokeDasharray="85.7 389.5" strokeDashoffset="-153.8" strokeWidth="20"></circle>
                <circle className="transition-all hover:opacity-90" cx="80" cy="80" fill="none" r="62" stroke="#496729" strokeDasharray="72.0 389.5" strokeDashoffset="-239.5" strokeWidth="20"></circle>
                <circle className="transition-all hover:opacity-90" cx="80" cy="80" fill="none" r="62" stroke="#fdc74b" strokeDasharray="46.7 389.5" strokeDashoffset="-311.5" strokeWidth="20"></circle>
                <circle className="transition-all hover:opacity-90" cx="80" cy="80" fill="none" r="62" stroke="#524438" strokeDasharray="31.2 389.5" strokeDashoffset="-358.2" strokeWidth="20"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">100%</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Alokasi Dana</span>
              </div>
            </div>
            {/* Legend Bars */}
            <div className="md:col-span-7 flex flex-col gap-2.5">
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary"></span>
                  <span className="font-body-table text-body-table font-medium text-on-surface">Gas Elpiji (12kg / 3kg)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-body-table text-body-table text-on-surface-variant">Rp 2.450.000</span>
                  <span className="font-label-md text-label-md font-bold text-primary">39.5%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary-container"></span>
                  <span className="font-body-table text-body-table font-medium text-on-surface">Es Batu Kristal Harian</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-body-table text-body-table text-on-surface-variant">Rp 1.364.000</span>
                  <span className="font-label-md text-label-md font-bold text-on-primary-container">22.0%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-tertiary"></span>
                  <span className="font-body-table text-body-table font-medium text-on-surface">Kebersihan & Kantong Kresek</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-body-table text-body-table text-on-surface-variant">Rp 1.147.000</span>
                  <span className="font-label-md text-label-md font-bold text-tertiary">18.5%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-secondary-container"></span>
                  <span className="font-body-table text-body-table font-medium text-on-surface">Bahan Baku Darurat</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-body-table text-body-table text-on-surface-variant">Rp 744.000</span>
                  <span className="font-label-md text-label-md font-bold text-secondary">12.0%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-on-surface-variant"></span>
                  <span className="font-body-table text-body-table font-medium text-on-surface">Retribusi Lingkungan & Parkir</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-body-table text-body-table text-on-surface-variant">Rp 495.000</span>
                  <span className="font-label-md text-label-md font-bold text-on-surface-variant">8.0%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Branch Balance Snapshot */}
        <div className="lg:col-span-4 flex flex-col gap-space-sm">
          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col flex-1 justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm text-on-surface">Status Kasir 4 Cabang</span>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">pie_chart</span>
              </div>
              <p className="font-body-table text-body-table text-on-surface-variant mt-0.5">Saldo laci aktual kasir per malam ini</p>
              
              <div className="mt-space-md flex flex-col gap-3">
                <div>
                  <div className="flex justify-between text-body-table mb-1">
                    <span className="font-semibold text-on-surface">Cabang Tebet</span>
                    <span className="text-on-surface font-semibold">Rp 720.000 <span className="text-on-surface-variant font-normal">/ 1.0M</span></span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-tertiary rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-body-table mb-1">
                    <span className="font-semibold text-on-surface">Cabang Bintaro</span>
                    <span className="text-on-surface font-semibold">Rp 580.000 <span className="text-on-surface-variant font-normal">/ 1.0M</span></span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-tertiary rounded-full" style={{ width: '58%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-body-table mb-1">
                    <span className="font-semibold text-on-surface">Cabang BSD</span>
                    <span className="text-on-surface font-semibold">Rp 390.000 <span className="text-on-surface-variant font-normal">/ 1.0M</span></span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '39%' }}></div>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-error-container/40">
                  <div className="flex justify-between text-body-table mb-1">
                    <span className="font-semibold text-error flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">warning</span> Cabang Kemang
                    </span>
                    <span className="text-error font-bold">Rp 110.000 <span className="text-on-surface-variant font-normal">/ 1.0M</span></span>
                  </div>
                  <div className="w-full h-2 bg-error-container rounded-full overflow-hidden">
                    <div className="h-full bg-error rounded-full" style={{ width: '11%' }}></div>
                  </div>
                  <span className="font-label-sm text-label-sm text-error block mt-1">Kritis: Sisa kas di bawah limit aman (Rp 250k)</span>
                </div>
              </div>
            </div>
            
            <button onClick={() => setIsTopupModalOpen(true)} className="w-full mt-space-sm py-2 px-3 rounded-lg bg-surface-container-high hover:bg-surface-container text-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 transition-colors">
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              Top-Up Cabang Kemang Sekarang
            </button>
          </div>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="p-space-sm rounded-xl bg-surface-container-lowest shadow-sm mt-space-md flex flex-wrap items-center justify-between gap-space-sm">
        <div className="flex flex-wrap items-center gap-space-xs">
          {/* Selectors */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md cursor-pointer hover:bg-surface-container">
            <span className="material-symbols-outlined text-[18px] text-primary">storefront</span>
            <select className="bg-transparent text-on-surface font-medium focus:outline-none cursor-pointer">
              <option value="all">Semua Cabang (4)</option>
              <option value="tebet">Cabang Tebet</option>
              <option value="kemang">Cabang Kemang</option>
              <option value="bsd">Cabang BSD</option>
              <option value="bintaro">Cabang Bintaro</option>
            </select>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md cursor-pointer hover:bg-surface-container">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">category</span>
            <select className="bg-transparent text-on-surface font-medium focus:outline-none cursor-pointer">
              <option value="all">Semua Kategori</option>
              <option value="gas">Gas & Listrik</option>
              <option value="es">Es Batu Kristal</option>
              <option value="darurat">Bahan Baku Darurat</option>
            </select>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">calendar_month</span>
            <input type="date" value="2024-10-24" readOnly className="bg-transparent text-on-surface font-medium focus:outline-none cursor-pointer text-body-md" />
          </div>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-2.5 text-[18px] text-on-surface-variant">search</span>
            <input type="text" placeholder="Cari keterangan, kasir, nota..." className="pl-8 pr-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body-md text-body-md focus:outline-none focus:bg-surface-container w-52 sm:w-64" />
          </div>
        </div>
        <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tertiary"></span> Terverifikasi</span>
          <span className="flex items-center gap-1 ml-2"><span className="w-2 h-2 rounded-full bg-secondary-container"></span> Butuh Tinjauan</span>
          <span className="flex items-center gap-1 ml-2"><span className="w-2 h-2 rounded-full bg-error"></span> Selisih / Ditolak</span>
        </div>
      </div>

      {/* Primary Transaction Ledger Table */}
      <div className="mt-space-sm rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse tabular-nums">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                <th className="py-3 px-space-md">Waktu & Tanggal</th>
                <th className="py-3 px-space-md">Cabang</th>
                <th className="py-3 px-space-md">Kategori</th>
                <th className="py-3 px-space-md">Keterangan Pengeluaran</th>
                <th className="py-3 px-space-md text-right">Nominal (Rp)</th>
                <th className="py-3 px-space-md">Kasir Input</th>
                <th className="py-3 px-space-md text-center">Bukti Nota Fisik</th>
                <th className="py-3 px-space-md">Status SPV</th>
                <th className="py-3 px-space-md text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md text-on-surface divide-y divide-surface-container-high/40">
              {transactions.map((trx) => (
                <tr key={trx.id} className={`${trx.isWarningRow ? 'bg-secondary-container/5 hover:bg-surface-container-low/40' : 'hover:bg-surface-container-low/40'} transition-colors`}>
                  <td className="py-3.5 px-space-md whitespace-nowrap">
                    <div className="font-semibold text-on-surface">{trx.date}</div>
                    <div className="text-on-surface-variant font-label-sm text-label-sm">{trx.time}</div>
                  </td>
                  <td className="py-3.5 px-space-md whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-medium">{trx.branch}</span>
                  </td>
                  <td className="py-3.5 px-space-md whitespace-nowrap">
                    <div className={`flex items-center gap-1.5 ${trx.categoryColor}`}>
                      <span className="material-symbols-outlined text-[16px]">{trx.categoryIcon}</span>
                      <span className="font-semibold">{trx.category}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-space-md">
                    <div className="font-medium">{trx.desc}</div>
                    {trx.descNote && <div className="text-on-surface-variant font-label-sm text-label-sm">{trx.descNote}</div>}
                    {trx.descWarning && (
                      <div className="text-error font-label-sm text-label-sm font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">info</span> {trx.descWarning}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-space-md whitespace-nowrap text-right font-semibold text-on-surface">
                    {trx.amount}
                  </td>
                  <td className="py-3.5 px-space-md whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">person</span>
                      <span>{trx.cashier}</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">{trx.pin}</span>
                  </td>
                  <td className="py-3.5 px-space-md text-center whitespace-nowrap">
                    <div onClick={() => openReceipt(trx.desc, trx.amount, 'Vendor/Agen', trx.date, trx.statusBy, trx.image)} className="group relative inline-block cursor-pointer">
                      <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden shadow-sm flex items-center justify-center group-hover:opacity-90">
                        <img className="w-full h-full object-cover" src={trx.image} alt="Nota" />
                      </div>
                      <span className="absolute -bottom-1 -right-1 bg-surface-container-lowest text-primary rounded-full p-0.5 shadow-sm">
                        <span className="material-symbols-outlined text-[12px] block">photo_camera</span>
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-space-md whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full ${trx.statusColor} font-label-sm text-label-sm flex items-center gap-1 font-semibold w-max`}>
                      <span className="material-symbols-outlined text-[13px]">{trx.statusIcon}</span> {trx.status}
                    </span>
                    <div className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">{trx.statusBy}</div>
                  </td>
                  <td className="py-3.5 px-space-md text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container" title="Lihat Detail Transaksi">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      <button className="p-1 rounded text-on-surface-variant hover:text-error hover:bg-surface-container" title="Tandai Selisih">
                        <span className="material-symbols-outlined text-[18px]">flag</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Footer */}
        <div className="p-space-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-sm font-label-sm text-label-sm text-on-surface-variant">
          <div>Menampilkan <strong className="text-on-surface">4</strong> dari <strong className="text-on-surface">28 transaksi kas kecil</strong> bulan ini</div>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface disabled:opacity-40" disabled>Sebelumnya</button>
            <button className="w-7 h-7 rounded-lg bg-primary text-on-primary font-semibold">1</button>
            <button className="w-7 h-7 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold">2</button>
            <button className="w-7 h-7 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold">3</button>
            <button className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface">Selanjutnya</button>
          </div>
        </div>
      </div>

      {/* Operational Policy Box */}
      <div className="mt-space-md p-space-md rounded-xl bg-surface-container-low flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md shadow-sm">
        <div className="flex items-start gap-space-sm">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[20px]">policy</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-surface">SOP Kas Kecil Kasir Martaboom Group</span>
            <p className="font-body-table text-body-table text-on-surface-variant mt-0.5">Maksimal batas pengeluaran tanpa otorisasi owner adalah Rp 100.000/transaksi. Setiap nota fisik wajib difoto jelas dan disimpan di laci kasir untuk audit fisik mingguan.</p>
          </div>
        </div>
        <div className="flex items-center gap-space-xs shrink-0">
          <a href="#" className="px-space-md py-2 rounded-lg bg-surface-container-lowest text-primary hover:bg-surface font-label-md text-label-md font-semibold transition-all">Unduh SOP PDF</a>
        </div>
      </div>

      {/* Modals */}
      {/* Receipt Modal */}
      {isReceiptModalOpen && selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-space-md">
          <div className="w-full max-w-lg rounded-2xl bg-surface-container-lowest shadow-xl overflow-hidden flex flex-col">
            <div className="p-space-md bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">receipt_long</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">Detail Bukti Nota Fisik</span>
              </div>
              <button onClick={() => setIsReceiptModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="p-space-md flex flex-col gap-space-sm">
              <div className="w-full h-64 rounded-xl bg-surface-container overflow-hidden shadow-inner flex items-center justify-center">
                <img src={selectedReceipt.image} alt="Nota" className="w-full h-full object-cover" />
              </div>
              <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-1 text-body-table">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Deskripsi Barang:</span>
                  <span className="font-semibold text-on-surface">{selectedReceipt.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Nominal Tercantum:</span>
                  <span className="font-bold text-primary">{selectedReceipt.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Toko / Agen:</span>
                  <span className="text-on-surface">{selectedReceipt.vendor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Waktu Pembelian:</span>
                  <span className="text-on-surface">{selectedReceipt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Penginput / Verifikator:</span>
                  <span className="text-tertiary font-medium">{selectedReceipt.spv}</span>
                </div>
              </div>
            </div>
            <div className="p-space-md bg-surface-container-low flex justify-end gap-space-xs">
              <button onClick={() => setIsReceiptModalOpen(false)} className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md">Tutup</button>
              <button onClick={confirmReceipt} className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md">Konfirmasi Nota Sah</button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Reimbursement Modal */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-space-md">
          <div className="w-full max-w-xl rounded-2xl bg-surface-container-lowest shadow-xl overflow-hidden flex flex-col">
            <div className="p-space-md bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">verified</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">Setujui Reimbursement Kasir</span>
              </div>
              <button onClick={() => setIsApproveModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="p-space-md flex flex-col gap-space-sm">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Persetujuan penggantian dana talangan pribadi kasir untuk pembelian operasional mendesak. Dana akan diganti via transfer atau saldo kas laci toko.
              </p>
              <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="rb-1" className="rounded accent-primary w-4 h-4" defaultChecked />
                    <label htmlFor="rb-1" className="text-body-md font-semibold text-on-surface">Cabang BSD - Rian (Mentega Indomaret)</label>
                  </div>
                  <span className="font-bold text-on-surface">Rp 36.000</span>
                </div>
                <div className="text-label-sm text-on-surface-variant pl-6">Alasan: Beli mentega sachet darurat karena pesanan borongan kantor mendadak.</div>
              </div>
              <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="rb-2" className="rounded accent-primary w-4 h-4" defaultChecked />
                    <label htmlFor="rb-2" className="text-body-md font-semibold text-on-surface">Cabang Kemang - Siti (Es Kristal Tube)</label>
                  </div>
                  <span className="font-bold text-on-surface">Rp 48.000</span>
                </div>
                <div className="text-label-sm text-on-surface-variant pl-6">Alasan: Es batu mencair saat kendala freezer padam selama 30 menit.</div>
              </div>
              <div className="flex justify-between items-center p-space-sm rounded-lg bg-surface-container font-headline-sm text-headline-sm">
                <span className="text-on-surface">Total Klaim Disetujui:</span>
                <span className="text-primary font-bold">Rp 84.000</span>
              </div>
            </div>
            <div className="p-space-md bg-surface-container-low flex justify-end gap-space-xs">
              <button onClick={() => setIsApproveModalOpen(false)} className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md">Batal</button>
              <button onClick={approveReimbursement} className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold">Proses & Setujui Reimbursement</button>
            </div>
          </div>
        </div>
      )}

      {/* Topup Modal */}
      {isTopupModalOpen && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-space-md">
          <div className="w-full max-w-lg rounded-2xl bg-surface-container-lowest shadow-xl overflow-hidden flex flex-col">
            <div className="p-space-md bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">account_balance</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">Top-Up Saldo Kas Toko via VA BCA</span>
              </div>
              <button onClick={() => setIsTopupModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="p-space-md flex flex-col gap-space-sm">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant">Pilih Cabang Tujuan Top-Up:</label>
                <select className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none">
                  <option value="kemang">Cabang Kemang (Sisa Rp 110.000 - Sangat Butuh Top-up)</option>
                  <option value="tebet">Cabang Tebet (Sisa Rp 720.000)</option>
                  <option value="bsd">Cabang BSD (Sisa Rp 390.000)</option>
                  <option value="bintaro">Cabang Bintaro (Sisa Rp 580.000)</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant">Nominal Pengisian Kas Laci Toko:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => handleTopup('500.000')} className="py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold">Rp 500.000</button>
                  <button onClick={() => handleTopup('1.000.000')} className="py-2 rounded-lg bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary-fixed font-label-md text-label-md font-bold">Rp 1.000.000</button>
                  <button onClick={() => handleTopup('1.500.000')} className="py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold">Rp 1.500.000</button>
                </div>
                <input type="text" value={topupNominal} readOnly className="mt-2 w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-headline-sm text-headline-sm focus:outline-none font-bold" />
              </div>
              <div className="p-space-sm rounded-xl bg-surface-container flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Nomor Virtual Account BCA</span>
                  <span className="font-label-sm text-label-sm text-primary font-bold">Otomatis Terverifikasi</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-headline-sm text-headline-sm text-on-surface tracking-wider font-mono">1289 0821 9920 110</span>
                  <button onClick={() => { navigator.clipboard.writeText('128908219920110'); alert('Nomor VA BCA Tersalin!'); }} className="p-1 rounded bg-surface-container-lowest text-primary hover:text-on-primary-container text-label-sm">
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  </button>
                </div>
                <span className="text-label-sm text-on-surface-variant mt-1">Atas Nama: <strong>PT MARTABOOM KULINER INDONESIA (KAS TOKO)</strong></span>
              </div>
            </div>
            <div className="p-space-md bg-surface-container-low flex justify-end gap-space-xs">
              <button onClick={() => setIsTopupModalOpen(false)} className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md">Tutup</button>
              <button onClick={processTopup} className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold">Generate Instruksi Transfer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
