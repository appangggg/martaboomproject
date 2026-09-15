import React, { useState } from 'react';

export default function DiscrepancyAlertScreen() {
  const [selectedRowId, setSelectedRowId] = useState('row-dimas');

  const handleOwnerAction = (actionType) => {
    if (actionType === 'kasbon') {
      alert('Tindakan Dikonfirmasi: Nominal Rp 75.000 telah dialihkan ke pemotongan payroll kasir Dimas A. Notifikasi dikirimkan ke SPV Tebet.');
    } else if (actionType === 'toleransi') {
      alert('Toleransi Diberikan: Nominal Rp 75.000 dicatat sebagai Biaya Selisih Kasir (Operational Waste) bulan berjalan.');
    } else if (actionType === 'cctv') {
      alert('Permintaan klip CCTV kamera kasir #2 (21:00-22:00 WIB) telah diteruskan ke tim IT & Security Cabang Tebet.');
    }
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Top Banner / Discrepancy Overview */}
      <div className="flex flex-col gap-space-md mb-space-lg">
        {/* Header Title & Action Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse"></span>
              <span className="font-label-sm text-label-sm text-error uppercase tracking-wider font-semibold">Audit Kritis Terpusat</span>
            </div>
            <h1 className="font-headline-kpi text-headline-kpi text-on-surface">Peringatan Selisih &amp; Rekonsiliasi</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Deteksi anomali closing kasir, deviasi resep BOM, dan penyusutan opname lintas cabang.</p>
          </div>
          <div className="flex items-center gap-space-sm">
            <button className="px-space-md py-2 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-sm flex items-center gap-space-xs transition-colors font-label-md text-label-md">
              <span className="material-symbols-outlined text-[18px]">history</span>
              <span>Riwayat Audit</span>
            </button>
            <button className="px-space-md py-2 rounded-lg bg-primary text-on-primary hover:bg-on-primary-container shadow-sm flex items-center gap-space-xs transition-colors font-label-md text-label-md">
              <span className="material-symbols-outlined text-[18px]">file_download</span>
              <span>Ekspor Berita Acara</span>
            </button>
          </div>
        </div>

        {/* Metric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-gutter-desktop">
          {/* Card 1: Total Temuan Aktif */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Peringatan Aktif</span>
              <span className="p-1.5 rounded-lg bg-error-container text-on-error-container material-symbols-outlined text-[18px]">priority_high</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-kpi text-headline-kpi text-on-surface tabular-nums">4</span>
              <span className="font-label-md text-label-md text-on-surface-variant">Temuan Shift Ini</span>
            </div>
            {/* Micro Badges */}
            <div className="flex items-center gap-1.5 mt-space-sm flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-error text-on-error font-label-sm text-label-sm font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span> 2 Urgent
              </span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-on-secondary-container"></span> 1 Investigasi
              </span>
              <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> 1 Diklarifikasi
              </span>
            </div>
          </div>

          {/* Card 2: Potensi Kerugian Nominal */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Estimasi Selisih Kas</span>
              <span className="p-1.5 rounded-lg bg-surface-container text-primary material-symbols-outlined text-[18px]">point_of_sale</span>
            </div>
            <div>
              <span className="font-headline-kpi text-headline-kpi text-error tabular-nums">-Rp 60.000</span>
              <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                <span>Netto (Defisit Rp 75k - Surplus Rp 15k)</span>
              </div>
            </div>
            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mt-space-sm">
              <div className="bg-error h-full rounded-full" style={{ width: '83%' }}></div>
            </div>
          </div>

          {/* Card 3: Penyusutan Bahan Baku */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Penyusutan Fisik Bahan</span>
              <span className="p-1.5 rounded-lg bg-surface-container text-secondary material-symbols-outlined text-[18px]">scale</span>
            </div>
            <div>
              <span className="font-headline-kpi text-headline-kpi text-on-surface tabular-nums">-3.4 Kg</span>
              <div className="flex items-center gap-1 font-label-sm text-label-sm text-error mt-0.5">
                <span className="material-symbols-outlined text-[14px]">trending_down</span>
                <span>Est. Nominal Bahan: ~Rp 285.000</span>
              </div>
            </div>
            <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant mt-space-sm">
              <span>Keju: 1.2 kg</span>
              <span>•</span>
              <span>Daging: 2.2 kg</span>
            </div>
          </div>

          {/* Card 4: Audit & Loss Control Index */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Akurasi Rekonsiliasi</span>
              <span className="p-1.5 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed-variant material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                  <path className="text-surface-container" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5"></path>
                  <path className="text-tertiary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="94, 100" strokeLinecap="round" strokeWidth="3.5"></path>
                </svg>
                <span className="absolute font-label-md text-label-md text-on-surface font-bold tabular-nums">94%</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface leading-tight">Toleransi Wajar</span>
                <span className="font-label-sm text-label-sm text-tertiary font-medium">Batas deviasi &lt; 2.0%</span>
              </div>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-space-sm">Batas closing malam: 02:00 WIB</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls Ribbon (Filters) */}
      <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-sm mb-space-md">
        {/* Branch Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase px-2 font-semibold">Cabang:</span>
          <button className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md font-semibold whitespace-nowrap shadow-sm">
            Semua Cabang (4)
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container font-label-md text-label-md whitespace-nowrap transition-colors">
            Tebet (1)
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container font-label-md text-label-md whitespace-nowrap transition-colors">
            Kemang (1)
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container font-label-md text-label-md whitespace-nowrap transition-colors">
            BSD (1)
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container font-label-md text-label-md whitespace-nowrap transition-colors">
            Dago (1)
          </button>
        </div>
        {/* Status & Search Filter */}
        <div className="flex items-center gap-space-sm">
          <div className="flex items-center bg-surface-container-high rounded-lg px-2.5 py-1.5 gap-1.5">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">tune</span>
            <select className="bg-transparent font-label-md text-label-md text-on-surface focus:outline-none cursor-pointer">
              <option value="all">Semua Status Audit</option>
              <option value="urgent">Belum Diperiksa (2)</option>
              <option value="investigating">Sedang Investigasi (1)</option>
              <option value="resolved">Sudah Selesai (1)</option>
            </select>
          </div>
          <div className="relative">
            <input className="bg-surface-container-high text-on-surface rounded-lg pl-8 pr-3 py-1.5 font-body-md text-body-md placeholder:text-on-surface-variant/60 focus:outline-none focus:bg-surface-container w-44 md:w-56" placeholder="Cari item / petugas..." type="text"/>
            <span className="material-symbols-outlined absolute left-2 top-2 text-on-surface-variant text-[16px]">search</span>
          </div>
        </div>
      </div>

      {/* Main Work Area: Asymmetric Split Grid (Table 7 Cols, Drawer/Detail Panel 5 Cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter-desktop items-start">
        {/* Left Column: Master Table of Discrepancies (7 cols on large screens) */}
        <div className="xl:col-span-7 flex flex-col gap-space-sm">
          {/* Table Header Bar */}
          <div className="bg-surface-container-high px-space-md py-2.5 rounded-t-xl flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">Daftar Temuan Audit Aktif</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Klik baris untuk membuka lembar investigasi</span>
          </div>
          
          {/* Discrepancy Card List / Dense Table Rows */}
          <div className="flex flex-col gap-2.5">
            {/* Row 1: Selected / Cash Tebet */}
            <div 
              className={`bg-surface-container-lowest p-space-md rounded-xl shadow-md cursor-pointer transition-all relative ${selectedRowId === 'row-dimas' ? 'ring-2 ring-primary-container' : 'hover:shadow-md'}`}
              onClick={() => setSelectedRowId('row-dimas')}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-error rounded-l-xl"></div>
              <div className="flex flex-col gap-space-xs pl-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-error text-on-error font-label-sm text-label-sm uppercase font-bold tracking-wider flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                      &#128308; Butuh Klarifikasi
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-semibold">Tebet</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">24 Okt 2024 &bull; 23:45 WIB</span>
                  </div>
                  {selectedRowId === 'row-dimas' && (
                    <span className="font-label-sm text-label-sm text-primary font-bold flex items-center gap-1">
                      Sedang Terpilih <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mt-1">
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Uang Kasir Shift Malam (Closing Drawer)</h2>
                    <div className="flex items-center gap-2 text-on-surface-variant font-body-md text-body-md mt-0.5">
                      <span>Kasir: <strong className="text-on-surface">Dimas A.</strong></span>
                      <span>&bull;</span>
                      <span>Laci Register #02</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right tabular-nums">
                    <span className="font-headline-md text-headline-md text-error font-extrabold">-Rp 75.000</span>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Sistem: Rp 2.500.000 vs Fisik: Rp 2.425.000</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-space-xs mt-space-xs border-t border-surface-container-high -mx-space-md -mb-space-md px-space-md py-2 bg-surface-container-low/60 rounded-b-xl border-t-0">
                  <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[15px] text-error">receipt_long</span>
                    <span>Selisih mutlak kas fisik per shift closing</span>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary font-label-md text-label-md font-semibold flex items-center gap-1 transition-colors">
                    <span>Investigasi Kasir</span>
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Row 2: Keju BSD */}
            <div 
              className={`bg-surface-container-lowest p-space-md rounded-xl shadow-sm cursor-pointer transition-all relative ${selectedRowId === 'row-keju' ? 'ring-2 ring-primary-container' : 'hover:shadow-md'}`}
              onClick={() => setSelectedRowId('row-keju')}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-error rounded-l-xl"></div>
              <div className="flex flex-col gap-space-xs pl-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-error text-on-error font-label-sm text-label-sm uppercase font-bold tracking-wider flex items-center gap-1.5">
                      &#128308; Butuh Tindakan
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-semibold">BSD</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">24 Okt 2024 &bull; Closing Opname</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">BOM Variance Alert</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mt-1">
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Stok Fisik Keju Cheddar Kraft</h2>
                    <div className="flex items-center gap-2 text-on-surface-variant font-body-md text-body-md mt-0.5">
                      <span>Supervisor: <strong className="text-on-surface">Fajar M.</strong></span>
                      <span>&bull;</span>
                      <span>Kategori: Dairy &amp; Chilled</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right tabular-nums">
                    <span className="font-headline-md text-headline-md text-error font-extrabold">-1.2 Kg</span>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Sistem 8.5 Kg vs Fisik 7.3 Kg</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-space-xs mt-space-xs border-t border-surface-container-high -mx-space-md -mb-space-md px-space-md py-2 bg-surface-container-low/60 rounded-b-xl border-t-0">
                  <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[15px] text-error">warning</span>
                    <span>Deviasi porsi topping melampaui toleransi 5%</span>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container font-label-md text-label-md font-semibold flex items-center gap-1 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">menu_book</span>
                    <span>Lihat Log Resep</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Row 3: Daging Kemang */}
            <div 
              className={`bg-surface-container-lowest p-space-md rounded-xl shadow-sm cursor-pointer transition-all relative ${selectedRowId === 'row-daging' ? 'ring-2 ring-primary-container' : 'hover:shadow-md'}`}
              onClick={() => setSelectedRowId('row-daging')}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary-container rounded-l-xl"></div>
              <div className="flex flex-col gap-space-xs pl-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase font-bold tracking-wider flex items-center gap-1.5">
                      &#128993; Sedang Dicek Kasir / SPV
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-semibold">Kemang</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">23 Okt 2024 &bull; Shift 2</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary font-semibold">Investigasi Berjalan</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mt-1">
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Stok Daging Sapi Cincang</h2>
                    <div className="flex items-center gap-2 text-on-surface-variant font-body-md text-body-md mt-0.5">
                      <span>Supervisor: <strong className="text-on-surface">Rian P.</strong></span>
                      <span>&bull;</span>
                      <span>Freezer Sentral</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right tabular-nums">
                    <span className="font-headline-md text-headline-md text-secondary font-extrabold">-2.2 Kg</span>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Sistem 14.0 Kg vs Opname 11.8 Kg</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-space-xs mt-space-xs border-t border-surface-container-high -mx-space-md -mb-space-md px-space-md py-2 bg-surface-container-low/60 rounded-b-xl border-t-0">
                  <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[15px] text-secondary">hourglass_top</span>
                    <span>Proses verifikasi thawing waste &amp; kartu timbangan</span>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container font-label-md text-label-md font-semibold flex items-center gap-1 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                    <span>Lihat Bukti Timbang</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Row 4: Kas Dago (Resolved) */}
            <div 
              className={`bg-surface-container-lowest p-space-md rounded-xl shadow-sm cursor-pointer transition-all relative ${selectedRowId === 'row-dago' ? 'ring-2 ring-primary-container' : 'hover:shadow-md'}`}
              onClick={() => setSelectedRowId('row-dago')}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-tertiary rounded-l-xl"></div>
              <div className="flex flex-col gap-space-xs pl-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm uppercase font-bold tracking-wider flex items-center gap-1.5">
                      &#128994; Sudah Diklarifikasi
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-semibold">Dago</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">22 Okt 2024 &bull; Shift Sore</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-tertiary font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[14px]">done_all</span> Arsip Valid
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mt-1">
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Uang Kasir Shift Sore (Surplus)</h2>
                    <div className="flex items-center gap-2 text-on-surface-variant font-body-md text-body-md mt-0.5">
                      <span>Kasir: <strong className="text-on-surface">Agnes L.</strong></span>
                      <span>&bull;</span>
                      <span>Laci Register #01</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right tabular-nums">
                    <span className="font-headline-md text-headline-md text-tertiary font-extrabold">+Rp 15.000</span>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Lebih Kas di Laci</p>
                  </div>
                </div>
                
                {/* Attached SPV Note */}
                <div className="p-2.5 rounded-lg bg-surface-container-low mt-1 text-on-surface-variant font-body-md text-body-md flex items-start gap-2">
                  <span className="material-symbols-outlined text-tertiary text-[18px] mt-0.5">verified</span>
                  <div>
                    <span className="font-label-sm text-label-sm text-on-surface font-semibold">Catatan Supervisor Cabang Dago:</span>
                    <p className="text-on-surface-variant font-body-table text-body-table">"Uang tip pelanggan meja 7 masuk laci kasir saat rush hour. Sudah dipindahkan ke toples tip staff bersama saksi kasir."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Incident Summary Banner */}
          <div className="bg-surface-container p-space-md rounded-xl mt-space-sm flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-[24px]">gavel</span>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface">Kebijakan Pemotongan Selisih</span>
                <span className="font-body-md text-body-md text-on-surface-variant">Toleransi selisih kas maksimal Rp 5.000/shift. Selisih di atas batas wajib klarifikasi &lt; 24 jam.</span>
              </div>
            </div>
            <button className="px-space-md py-1.5 rounded-lg bg-surface-container-lowest text-primary hover:bg-surface-container-high font-label-md text-label-md font-semibold transition-colors">
              Lihat SOP Kasir
            </button>
          </div>
        </div>

        {/* Right Column: Detail / Investigation Drawer Panel (5 cols on large screens) */}
        <div className="xl:col-span-5 bg-surface-container-lowest rounded-xl shadow-lg overflow-hidden sticky top-20">
          {selectedRowId === 'row-dimas' && (
            <>
              {/* Drawer Header */}
              <div className="bg-surface-container-high p-space-md flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-error"></span>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Detail Investigasi Selisih Kasir</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">ID Audit: #REC-TB-2410-002</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-error text-on-error font-label-sm text-label-sm uppercase font-bold">
                  &#128308; Butuh Klarifikasi
                </span>
              </div>
              
              {/* Drawer Body */}
              <div className="p-space-md flex flex-col gap-space-md max-h-[calc(100vh-160px)] overflow-y-auto">
                {/* Summary Strip */}
                <div className="bg-surface-container-low p-space-md rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-medium">Petugas Shift</span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Dimas Anggara</h3>
                    <span className="font-body-table text-body-table text-on-surface-variant">Shift Malam (16:00 - 24:00) &bull; Cabang Tebet</span>
                  </div>
                  <div className="text-right">
                    <span className="font-label-sm text-label-sm text-error uppercase font-bold">Selisih Fisik</span>
                    <div className="font-headline-kpi text-headline-kpi text-error font-black tabular-nums">-Rp 75.000</div>
                  </div>
                </div>
                
                {/* Cash Breakdown Table / Physical Reconciliation */}
                <div className="flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface uppercase font-bold tracking-wider">Rekonsiliasi Fisik Pecahan Laci</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Dihitung Pukul 23:45</span>
                  </div>
                  <div className="bg-surface rounded-lg p-2.5 flex flex-col gap-1.5 font-body-table text-body-table">
                    <div className="grid grid-cols-12 text-on-surface-variant font-label-sm text-label-sm pb-1 border-b-0">
                      <span className="col-span-5 font-semibold">Pecahan Uang</span>
                      <span className="col-span-3 text-center font-semibold">Jumlah Lembar</span>
                      <span className="col-span-4 text-right font-semibold">Subtotal</span>
                    </div>
                    {/* 100k */}
                    <div className="grid grid-cols-12 items-center py-1 bg-surface-container-lowest px-2 rounded">
                      <span className="col-span-5 font-medium text-on-surface">Rp 100.000</span>
                      <span className="col-span-3 text-center text-on-surface">15 lembar</span>
                      <span className="col-span-4 text-right font-semibold text-on-surface tabular-nums">Rp 1.500.000</span>
                    </div>
                    {/* 50k */}
                    <div className="grid grid-cols-12 items-center py-1 bg-surface-container-lowest px-2 rounded">
                      <span className="col-span-5 font-medium text-on-surface">Rp 50.000</span>
                      <span className="col-span-3 text-center text-error font-bold">12 lembar <span className="text-[10px] text-error">(Defisit)</span></span>
                      <span className="col-span-4 text-right font-semibold text-on-surface tabular-nums">Rp 600.000</span>
                    </div>
                    {/* 20k */}
                    <div className="grid grid-cols-12 items-center py-1 bg-surface-container-lowest px-2 rounded">
                      <span className="col-span-5 font-medium text-on-surface">Rp 20.000</span>
                      <span className="col-span-3 text-center text-on-surface">10 lembar</span>
                      <span className="col-span-4 text-right font-semibold text-on-surface tabular-nums">Rp 200.000</span>
                    </div>
                    {/* 10k & 5k */}
                    <div className="grid grid-cols-12 items-center py-1 bg-surface-container-lowest px-2 rounded">
                      <span className="col-span-5 font-medium text-on-surface">Rp 10.000 / Rp 5.000</span>
                      <span className="col-span-3 text-center text-on-surface">17 lembar</span>
                      <span className="col-span-4 text-right font-semibold text-on-surface tabular-nums">Rp 115.000</span>
                    </div>
                    {/* Koin */}
                    <div className="grid grid-cols-12 items-center py-1 bg-surface-container-lowest px-2 rounded">
                      <span className="col-span-5 font-medium text-on-surface">Koin Campur (1k / 500)</span>
                      <span className="col-span-3 text-center text-on-surface">10 koin</span>
                      <span className="col-span-4 text-right font-semibold text-on-surface tabular-nums">Rp 10.000</span>
                    </div>
                    {/* Total Baris */}
                    <div className="grid grid-cols-12 items-center pt-2 px-2 bg-surface-container font-headline-sm text-headline-sm rounded mt-1">
                      <span className="col-span-5 font-bold text-on-surface">Total Kas Fisik</span>
                      <span className="col-span-3 text-center text-on-surface-variant font-label-sm text-label-sm tabular-nums">54 Item</span>
                      <span className="col-span-4 text-right font-bold text-on-surface tabular-nums">Rp 2.425.000</span>
                    </div>
                  </div>
                </div>

                {/* System Sales Log Comparison */}
                <div className="bg-surface-container-high/40 p-space-sm rounded-lg flex flex-col gap-1.5 tabular-nums">
                  <div className="flex items-center justify-between text-on-surface font-label-md text-label-md">
                    <span>Total Penjualan Tunai POS Sistem</span>
                    <span className="font-bold">Rp 2.500.000</span>
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant font-body-table text-body-table">
                    <span>Modal Kas Awal (Opening Float)</span>
                    <span>Rp 300.000</span>
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant font-body-table text-body-table">
                    <span>Pembayaran Kasbon Petugas</span>
                    <span>Rp 0</span>
                  </div>
                  <div className="flex items-center justify-between text-error font-headline-sm text-headline-sm pt-1 mt-1 border-t-0 bg-surface-container p-2 rounded">
                    <span className="font-bold">Total Selisih Netto (Minus)</span>
                    <span className="font-black">-Rp 75.000</span>
                  </div>
                </div>

                {/* Cashier Explanation Note */}
                <div className="flex flex-col gap-1.5">
                  <span className="font-label-md text-label-md text-on-surface uppercase font-bold tracking-wider">Klarifikasi Tertulis Kasir</span>
                  <div className="p-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md relative">
                    <span className="material-symbols-outlined text-primary text-[20px] absolute right-3 top-3">chat_bubble</span>
                    <p className="pr-8 italic">"Pukul 21:15 ada orderan GoFood #44 dan pesanan dine-in ramai bersamaan. Terjadi selip serah uang kembalian pecahan 50rb dan 20rb ke driver saat laci terbuka terburu-buru. Sudah saya cek ulang struk transaksi #44."</p>
                    <div className="flex items-center justify-between mt-2 pt-1 font-label-sm text-label-sm text-on-surface-variant">
                      <span>Ditulis: Dimas A. (23:50 WIB)</span>
                      <span className="text-tertiary font-semibold">Tanda Tangan Digital Terverifikasi</span>
                    </div>
                  </div>
                </div>

                {/* Photographic/Audit Proof Placeholder */}
                <div className="flex flex-col gap-1.5">
                  <span className="font-label-md text-label-md text-on-surface uppercase font-bold tracking-wider">Bukti Struk &amp; Rekap Kasir</span>
                  <div className="grid grid-cols-2 gap-space-sm">
                    <div className="h-28 rounded-lg overflow-hidden bg-surface-container relative group cursor-pointer">
                      <div className="w-full h-full bg-surface-container-high transition-transform group-hover:scale-105" />
                      <div className="absolute inset-0 bg-on-surface/40 flex items-center justify-center text-surface opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="font-label-sm text-label-sm flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">zoom_in</span> Struk Closing</span>
                      </div>
                    </div>
                    <div className="h-28 rounded-lg overflow-hidden bg-surface-container relative group cursor-pointer">
                      <div className="w-full h-full bg-surface-container-high transition-transform group-hover:scale-105" />
                      <div className="absolute inset-0 bg-on-surface/40 flex items-center justify-center text-surface opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="font-label-sm text-label-sm flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">zoom_in</span> Foto Laci Kasir</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Owner Decision & Action Buttons */}
                <div className="flex flex-col gap-2 pt-space-xs mt-space-xs bg-surface-container-high/30 p-space-sm rounded-xl">
                  <span className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider">Tindakan Owner (Pilih Keputusan)</span>
                  
                  {/* Action 1: Bebankan Kasbon Kasir */}
                  <button 
                    className="w-full py-2.5 px-space-md rounded-lg bg-error text-on-error hover:opacity-95 font-label-md text-label-md font-bold flex items-center justify-between shadow-sm transition-all" 
                    onClick={() => handleOwnerAction('kasbon')}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">person_remove</span>
                      <span>Bebankan ke Kasbon Kasir (-Rp 75.000)</span>
                    </div>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                  
                  {/* Action 2: Toleransi / Biaya Selisih */}
                  <button 
                    className="w-full py-2 px-space-md rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-md text-label-md font-semibold flex items-center justify-between shadow-sm transition-all" 
                    onClick={() => handleOwnerAction('toleransi')}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[18px]">handshake</span>
                      <span>Toleransi &amp; Masukkan Biaya Selisih Kas</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Post ke Beban Ops</span>
                  </button>
                  
                  {/* Action 3: CCTV Request */}
                  <button 
                    className="w-full py-2 px-space-md rounded-lg bg-surface-container text-primary hover:bg-surface-container-high font-label-md text-label-md font-semibold flex items-center justify-between transition-all" 
                    onClick={() => handleOwnerAction('cctv')}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">videocam</span>
                      <span>Minta Rekaman CCTV Meja Kasir (21:00 - 22:00)</span>
                    </div>
                    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                  </button>
                </div>
              </div>
              
              {/* Drawer Footer status note */}
              <div className="p-space-sm bg-surface-container px-space-md flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-tertiary">lock</span>
                  Audit trail tercatat permanen di cloud server
                </span>
                <span className="font-mono text-[11px]">SYNC-OK</span>
              </div>
            </>
          )}

          {selectedRowId !== 'row-dimas' && (
            <div className="p-space-xl flex flex-col items-center justify-center text-center h-full gap-2">
              <span className="material-symbols-outlined text-[48px] text-surface-container-high">find_in_page</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface-variant">Pilih temuan audit di sebelah kiri</h3>
              <p className="font-body-md text-body-md text-on-surface-variant/60">Detail investigasi dan kontrol keputusan akan muncul di sini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
