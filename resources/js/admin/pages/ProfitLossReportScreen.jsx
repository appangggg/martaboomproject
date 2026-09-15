import React from 'react';

export default function ProfitLossReportScreen() {
  return (
    <div className="flex flex-col w-full">
      <div className="relative py-space-lg flex flex-col gap-space-lg">
        <div className="absolute -top-12 -right-8 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">Audit Finansial Konsolidasi</span>
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
              <span className="font-label-sm text-label-sm text-tertiary font-semibold">Periode Berjalan: 01 - 07 Oktober 2024</span>
            </div>
            <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">Analisis Laba Rugi Kotor</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Dekonstruksi margin kotor real-time di 4 outlet. Menampilkan relasi mutlak antara gross revenue, serapan HPP resep (BOM), dan serapan operasional kas kecil.
            </p>
          </div>
          <div className="flex items-center gap-space-sm flex-wrap">
            <div className="flex items-center bg-surface-container-lowest p-1 rounded-xl shadow-sm">
              <button className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md transition-all shadow-sm">Mingguan</button>
              <button className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all">Bulanan</button>
              <button className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all">Kustom</button>
            </div>
            <button className="flex items-center gap-space-xs px-space-md py-2.5 bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md rounded-lg shadow-sm transition-all">
              <span className="material-symbols-outlined text-[18px] text-primary">sim_card_download</span>
              <span>Ekspor Laporan Audit</span>
            </button>
          </div>
        </div>

        {/* Waterfall Breakdown Container */}
        <div className="bg-gradient-to-br from-surface-container-lowest via-surface-container-lowest to-surface-container-low rounded-xl p-space-lg shadow-sm">
          <div className="flex flex-col lg:flex-row items-stretch gap-space-md">
            {/* Step 1: Penjualan */}
            <div className="flex-1 bg-surface-container-lowest rounded-lg p-space-md flex flex-col justify-between shadow-sm relative overflow-hidden group hover:bg-surface-container transition-all">
              <div className="absolute top-0 left-0 right-0 h-1 bg-secondary"></div>
              <div>
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">1. Total Penjualan</span>
                  <span className="material-symbols-outlined text-secondary text-[20px]">storefront</span>
                </div>
                <div className="font-label-md text-label-md text-on-surface-variant mb-1">Gross Revenue (4 Cabang)</div>
                <div className="font-headline-kpi text-headline-kpi text-on-surface tracking-tight leading-none tabular-nums">Rp 124.600.000</div>
              </div>
              <div className="mt-space-md pt-space-xs flex items-center justify-between text-on-surface-variant">
                <span className="font-label-sm text-label-sm">Baseline Omzet 100%</span>
                <span className="font-label-md text-label-md text-tertiary font-semibold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[16px]">north_east</span> +8.4%
                </span>
              </div>
            </div>
            {/* Flow Connector 1 */}
            <div className="hidden lg:flex items-center justify-center -mx-2 z-10">
              <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </div>
            </div>
            {/* Step 2: HPP Bahan Baku */}
            <div className="flex-1 bg-surface-container-lowest rounded-lg p-space-md flex flex-col justify-between shadow-sm relative overflow-hidden group hover:bg-surface-container transition-all">
              <div className="absolute top-0 left-0 right-0 h-1 bg-error"></div>
              <div>
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-error">2. HPP Bahan Baku</span>
                  <span className="material-symbols-outlined text-error text-[20px]">layers</span>
                </div>
                <div className="font-label-md text-label-md text-on-surface-variant mb-1">Konsumsi BOM Terstandar</div>
                <div className="font-headline-kpi text-headline-kpi text-error tracking-tight leading-none tabular-nums">- Rp 49.840.000</div>
              </div>
              <div className="mt-space-md pt-space-xs flex items-center justify-between text-on-surface-variant">
                <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold tabular-nums">Beban 40.0%</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Toleransi maks 42%</span>
              </div>
            </div>
            {/* Flow Connector 2 */}
            <div className="hidden lg:flex items-center justify-center -mx-2 z-10">
              <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </div>
            </div>
            {/* Step 3: Pengeluaran Kasir */}
            <div className="flex-1 bg-surface-container-lowest rounded-lg p-space-md flex flex-col justify-between shadow-sm relative overflow-hidden group hover:bg-surface-container transition-all">
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
              <div>
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary">3. Kas Kecil Harian</span>
                  <span className="material-symbols-outlined text-primary text-[20px]">point_of_sale</span>
                </div>
                <div className="font-label-md text-label-md text-on-surface-variant mb-1">Pengeluaran Kasir Terverifikasi</div>
                <div className="font-headline-kpi text-headline-kpi text-primary tracking-tight leading-none tabular-nums">- Rp 6.200.000</div>
              </div>
              <div className="mt-space-md pt-space-xs flex items-center justify-between text-on-surface-variant">
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold tabular-nums">Beban 5.0%</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Es, Gas, Kebersihan</span>
              </div>
            </div>
            {/* Flow Connector 3 */}
            <div className="hidden lg:flex items-center justify-center -mx-2 z-10">
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm font-bold">
                <span className="material-symbols-outlined text-[18px]">equal</span>
              </div>
            </div>
            {/* Step 4: Net Gross Margin Final (Hero Highlight) */}
            <div className="flex-[1.2] bg-gradient-to-br from-primary-container via-primary to-surface-tint rounded-lg p-space-md text-on-primary flex flex-col justify-between shadow-md relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-secondary-container/20 rounded-full blur-2xl pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-fixed font-bold">Laba Kotor Bersih</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md font-bold">
                    MARGIN 55.0%
                  </span>
                </div>
                <div className="font-label-md text-label-md text-primary-fixed mb-1">Gross Profit Riil Siap Operasional</div>
                <div className="font-display-lg text-display-lg font-bold tracking-tight text-on-primary leading-none drop-shadow-sm tabular-nums">
                  Rp 68.560.000
                </div>
              </div>
              <div className="mt-space-md pt-space-xs flex items-center justify-between text-primary-fixed">
                <span className="font-label-sm text-label-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">verified</span> Target Owner Tercapai (&ge;52%)
                </span>
                <span className="font-label-md text-label-md text-secondary-fixed font-semibold">Sehat Prima</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dual Layout: Trend Chart + AI Insight Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* Chart Column (8 cols) */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Dinamika Margin &amp; Beban</span>
                <h2 className="font-headline-md text-headline-md text-on-surface">Tren Laba Kotor Mingguan vs HPP</h2>
              </div>
              <div className="flex items-center gap-space-md text-on-surface-variant font-label-sm text-label-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-tertiary"></span>
                  <span>Laba Kotor Nominal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-primary-container"></span>
                  <span>HPP Bahan Baku</span>
                </div>
              </div>
            </div>
            
            {/* Inline SVG Area Chart */}
            <div className="w-full h-64 relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 240">
                <defs>
                  <linearGradient id="profitGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#496729" stopOpacity="0.32"></stop>
                    <stop offset="100%" stopColor="#496729" stopOpacity="0.0"></stop>
                  </linearGradient>
                  <linearGradient id="hppGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#d98e3f" stopOpacity="0.25"></stop>
                    <stop offset="100%" stopColor="#d98e3f" stopOpacity="0.0"></stop>
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <line stroke="#f0dfd4" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="700" y1="40" y2="40"></line>
                <line stroke="#f0dfd4" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="700" y1="100" y2="100"></line>
                <line stroke="#f0dfd4" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="700" y1="160" y2="160"></line>
                <line stroke="#f0dfd4" strokeWidth="1" x1="0" x2="700" y1="220" y2="220"></line>
                
                {/* Area & Line for HPP Bahan Baku */}
                <path d="M 0,165 Q 116,150 233,145 T 466,138 T 700,130 L 700,220 L 0,220 Z" fill="url(#hppGrad)"></path>
                <path d="M 0,165 Q 116,150 233,145 T 466,138 T 700,130" fill="none" stroke="#d98e3f" strokeWidth="2.5"></path>
                
                {/* Area & Line for Laba Kotor Bersih */}
                <path d="M 0,110 Q 116,95 233,80 T 466,72 T 700,55 L 700,220 L 0,220 Z" fill="url(#profitGrad)"></path>
                <path d="M 0,110 Q 116,95 233,80 T 466,72 T 700,55" fill="none" stroke="#496729" strokeWidth="3"></path>
                
                {/* Key Metric Dots */}
                <circle cx="233" cy="80" fill="#496729" r="4.5" stroke="#ffffff" strokeWidth="2"></circle>
                <circle cx="466" cy="72" fill="#496729" r="4.5" stroke="#ffffff" strokeWidth="2"></circle>
                <circle cx="700" cy="55" fill="#496729" r="5.5" stroke="#ffffff" strokeWidth="2.5"></circle>
                <circle cx="700" cy="130" fill="#d98e3f" r="4.5" stroke="#ffffff" strokeWidth="2"></circle>
              </svg>
              {/* Tooltip Callout at Peak */}
              <div className="absolute right-4 top-2 bg-surface-container-highest px-3 py-1.5 rounded-lg shadow-sm text-right hidden sm:block">
                <span className="font-label-sm text-label-sm text-on-surface-variant block">Puncak Minggu Ini (Minggu)</span>
                <span className="font-label-md text-label-md text-tertiary font-bold tabular-nums">Laba: Rp 12.450.000 / Hari</span>
              </div>
            </div>
            
            {/* Days Axis Labels */}
            <div className="flex justify-between text-on-surface-variant font-label-sm text-label-sm pt-space-sm px-1">
              <span>Senin (01/10)</span>
              <span>Selasa (02/10)</span>
              <span>Rabu (03/10)</span>
              <span>Kamis (04/10)</span>
              <span>Jumat (05/10)</span>
              <span>Sabtu (06/10)</span>
              <span>Minggu (07/10)</span>
            </div>
          </div>

          {/* AI Insights & Recipe Vigilance (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-space-md">
            {/* Automated Efficiency Insight Card */}
            <div className="bg-surface-container-low rounded-xl p-space-md shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center gap-space-xs mb-space-sm">
                <div className="w-7 h-7 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface font-semibold">Deteksi Anomali Otomatis</span>
              </div>
              <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm mb-space-sm">
                <div className="flex items-start gap-space-xs mb-1">
                  <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">warning</span>
                  <p className="font-body-md text-body-md text-on-surface font-medium leading-snug">
                    Cabang BSD mengalami lonjakan HPP keju <span className="text-error font-bold">+4.2%</span> minggu ini.
                  </p>
                </div>
                <p className="font-body-table text-body-table text-on-surface-variant pl-6">
                  Disarankan audit gramasi takaran topping mozarella &amp; keju parut saat shift siang.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm">
                <div className="flex items-start gap-space-xs mb-1">
                  <span className="material-symbols-outlined text-tertiary text-[18px] shrink-0 mt-0.5">check_circle</span>
                  <p className="font-body-md text-body-md text-on-surface font-medium leading-snug">
                    Cabang Kemang mencatat efisiensi minyak goreng terbaik.
                  </p>
                </div>
                <p className="font-body-table text-body-table text-on-surface-variant pl-6">
                  Rasio konsumsi minyak 1.8 liter / 100 porsi ayam, 12% lebih hemat dari rata-rata grup.
                </p>
              </div>
              <div className="mt-space-md pt-space-xs flex items-center justify-between">
                <button className="font-label-md text-label-md text-primary hover:text-on-primary-fixed-variant flex items-center gap-1 transition-colors">
                  <span>Buka Protokol Pengecekan BSD</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
            {/* Mini Visual Kitchen Banner */}
            <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex items-center gap-space-md overflow-hidden">
              <div className="w-20 h-20 rounded-lg bg-surface-container-high shrink-0"></div>
              <div className="flex flex-col pr-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Audit Bahan Inti</span>
                <span className="font-headline-sm text-headline-sm text-on-surface leading-snug">Konsumsi Daging &amp; Keju</span>
                <span className="font-body-table text-body-table text-on-surface-variant mt-0.5">73.8% dari total HPP terserap di 2 komoditas utama ini.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comparative Table Section */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container-low/40">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Benchmark Antar Unit</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">Perbandingan Margin &amp; Kontribusi Cabang</h2>
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant mr-1">Urutkan:</span>
              <span className="px-2.5 py-1 rounded-md bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold">Margin Tertinggi</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                  <th className="py-3 px-space-md">Cabang</th>
                  <th className="py-3 px-space-md text-right">Omzet Bruto</th>
                  <th className="py-3 px-space-md text-right">HPP Bahan (BOM)</th>
                  <th className="py-3 px-space-md text-right">Pengeluaran Kasir</th>
                  <th className="py-3 px-space-md text-right">Laba Kotor Nominal</th>
                  <th className="py-3 px-space-md text-center">Persentase Margin</th>
                  <th className="py-3 px-space-md text-right">Status Efisiensi</th>
                </tr>
              </thead>
              <tbody className="divide-y-0">
                {/* Row 1: Kemang */}
                <tr className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-4 px-space-md">
                    <div className="flex items-center gap-space-xs">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center font-bold text-on-surface font-label-md">KM</div>
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-headline-sm text-on-surface">Cabang Kemang</span>
                        <span className="font-body-table text-body-table text-on-surface-variant">Jakarta Selatan &bull; SPV: Rian</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-space-md text-right font-headline-sm text-headline-sm text-on-surface tabular-nums">
                    Rp 38.200.000
                  </td>
                  <td className="py-4 px-space-md text-right font-body-md text-body-md text-error tabular-nums">
                    Rp 14.516.000 <span className="text-on-surface-variant font-label-sm block">38.0%</span>
                  </td>
                  <td className="py-4 px-space-md text-right font-body-md text-body-md text-on-surface tabular-nums">
                    Rp 1.870.000 <span className="text-on-surface-variant font-label-sm block">4.9%</span>
                  </td>
                  <td className="py-4 px-space-md text-right font-headline-sm text-headline-sm text-tertiary tabular-nums font-bold">
                    Rp 21.814.000
                  </td>
                  <td className="py-4 px-space-md text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-md text-label-md font-bold">
                      <span className="material-symbols-outlined text-[14px]">trending_up</span> 57.1%
                    </div>
                  </td>
                  <td className="py-4 px-space-md text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary text-on-tertiary font-label-sm text-label-sm font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest"></span>
                      Sangat Sehat (&gt;55%)
                    </span>
                  </td>
                </tr>
                {/* Row 2: Tebet */}
                <tr className="bg-surface-container-lowest hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-4 px-space-md">
                    <div className="flex items-center gap-space-xs">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center font-bold text-on-surface font-label-md">TB</div>
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-headline-sm text-on-surface">Cabang Tebet</span>
                        <span className="font-body-table text-body-table text-on-surface-variant">Jakarta Selatan &bull; SPV: Dimas</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-space-md text-right font-headline-sm text-headline-sm text-on-surface tabular-nums">
                    Rp 35.500.000
                  </td>
                  <td className="py-4 px-space-md text-right font-body-md text-body-md text-error tabular-nums">
                    Rp 13.845.000 <span className="text-on-surface-variant font-label-sm block">39.0%</span>
                  </td>
                  <td className="py-4 px-space-md text-right font-body-md text-body-md text-on-surface tabular-nums">
                    Rp 1.704.000 <span className="text-on-surface-variant font-label-sm block">4.8%</span>
                  </td>
                  <td className="py-4 px-space-md text-right font-headline-sm text-headline-sm text-tertiary tabular-nums font-bold">
                    Rp 19.951.000
                  </td>
                  <td className="py-4 px-space-md text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-md text-label-md font-bold">
                      <span className="material-symbols-outlined text-[14px]">trending_up</span> 56.2%
                    </div>
                  </td>
                  <td className="py-4 px-space-md text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary text-on-tertiary font-label-sm text-label-sm font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest"></span>
                      Sangat Sehat (&gt;55%)
                    </span>
                  </td>
                </tr>
                {/* Row 3: BSD */}
                <tr className="bg-surface-container-low/20 hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-4 px-space-md">
                    <div className="flex items-center gap-space-xs">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center font-bold text-on-surface font-label-md">BS</div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="font-headline-sm text-headline-sm text-on-surface">Cabang BSD</span>
                          <span className="px-1.5 py-0.2 rounded bg-error-container text-error text-[10px] font-bold">Audit</span>
                        </div>
                        <span className="font-body-table text-body-table text-on-surface-variant">Tangerang &bull; SPV: Fajar</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-space-md text-right font-headline-sm text-headline-sm text-on-surface tabular-nums">
                    Rp 28.400.000
                  </td>
                  <td className="py-4 px-space-md text-right font-body-md text-body-md text-error tabular-nums font-medium">
                    Rp 11.928.000 <span className="text-error font-label-sm block">42.0% (Porsi Keju Naik)</span>
                  </td>
                  <td className="py-4 px-space-md text-right font-body-md text-body-md text-on-surface tabular-nums">
                    Rp 1.306.000 <span className="text-on-surface-variant font-label-sm block">4.6%</span>
                  </td>
                  <td className="py-4 px-space-md text-right font-headline-sm text-headline-sm text-on-surface tabular-nums font-bold">
                    Rp 15.166.000
                  </td>
                  <td className="py-4 px-space-md text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md font-bold">
                      <span>53.4%</span>
                    </div>
                  </td>
                  <td className="py-4 px-space-md text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      Waspada HPP Tinggi
                    </span>
                  </td>
                </tr>
                {/* Row 4: Dago */}
                <tr className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-4 px-space-md">
                    <div className="flex items-center gap-space-xs">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center font-bold text-on-surface font-label-md">DG</div>
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-headline-sm text-on-surface">Cabang Dago</span>
                        <span className="font-body-table text-body-table text-on-surface-variant">Bandung &bull; SPV: Sarah</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-space-md text-right font-headline-sm text-headline-sm text-on-surface tabular-nums">
                    Rp 22.500.000
                  </td>
                  <td className="py-4 px-space-md text-right font-body-md text-body-md text-error tabular-nums font-medium">
                    Rp 9.551.000 <span className="text-error font-label-sm block">42.5%</span>
                  </td>
                  <td className="py-4 px-space-md text-right font-body-md text-body-md text-on-surface tabular-nums">
                    Rp 1.320.000 <span className="text-on-surface-variant font-label-sm block">5.7%</span>
                  </td>
                  <td className="py-4 px-space-md text-right font-headline-sm text-headline-sm text-on-surface tabular-nums font-bold">
                    Rp 11.629.000
                  </td>
                  <td className="py-4 px-space-md text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-md text-label-md font-bold">
                      <span>51.8%</span>
                    </div>
                  </td>
                  <td className="py-4 px-space-md text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error text-on-error font-label-sm text-label-sm font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-on-error animate-pulse"></span>
                      Waspada HPP Tinggi
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Footer Summary Strip */}
          <div className="p-space-md bg-surface-container-high/60 flex flex-col sm:flex-row items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[16px] text-tertiary">verified_user</span>
              <span>Semua data terverifikasi otomatis dengan sistem Kitchen Display &amp; Stock Movement Log.</span>
            </div>
            <div className="flex items-center gap-space-md">
              <span className="font-label-md text-label-md text-on-surface-variant">Rata-rata Margin Konsolidasi:</span>
              <span className="font-headline-sm text-headline-sm text-tertiary font-bold tabular-nums">55.0%</span>
            </div>
          </div>
        </div>

        {/* Quick Action / Actionable Steps for Management */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md pb-space-lg">
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-start gap-space-sm hover:bg-surface-container transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">scale</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface">Kalibrasi Timbangan BSD</span>
              <span className="font-body-table text-body-table text-on-surface-variant mt-0.5">Kirim surat peringatan timbangan &amp; porsi keju mozzarella.</span>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-start gap-space-sm hover:bg-surface-container transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">recommend</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface">Apresiasi Tim Kemang</span>
              <span className="font-body-table text-body-table text-on-surface-variant mt-0.5">Reward efisiensi minyak goreng &amp; konsistensi resep (57.1%).</span>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-start gap-space-sm hover:bg-surface-container transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">sync_alt</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface">Review Pengadaan Supplier</span>
              <span className="font-body-table text-body-table text-on-surface-variant mt-0.5">Cek harga beli fillet ayam &amp; komparasi vendor cabang Bandung.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
