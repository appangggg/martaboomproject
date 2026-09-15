import React, { useState, useEffect } from 'react';

export default function StockOpnameWasteScreen() {
  const [wastes, setWastes] = useState([]);
  const [opnames, setOpnames] = useState([]);
  const [branchId, setBranchId] = useState('all');

  const loadWastes = async () => {
    try {
      const endpoint = branchId === 'all' ? '/waste-logs' : `/waste-logs?branch_id=${branchId}`;
      const res = await window.apiClient.get(endpoint);
      if (res.status === 'success') {
        setWastes(res.data);
      }
    } catch (error) {
      console.error('Error loading waste logs:', error);
    }
  };

  const loadOpnames = async () => {
    try {
      const endpoint = branchId === 'all' ? '/stock-opnames' : `/stock-opnames?branch_id=${branchId}`;
      const res = await window.apiClient.get(endpoint);
      if (res.status === 'success') {
        setOpnames(res.data);
      }
    } catch (error) {
      console.error('Error loading stock opnames:', error);
    }
  };

  useEffect(() => {
    loadWastes();
    loadOpnames();
  }, [branchId]);

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Header */}
      <div className="flex flex-col gap-space-lg w-full pt-space-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-sm">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm mb-1 uppercase tracking-wider">
              <span>Audit Operasional</span>
              <span>&bull;</span>
              <span className="text-primary font-semibold">Stok &amp; Waste Harian</span>
            </div>
            <div className="flex items-baseline gap-space-sm">
              <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">Stok Opname &amp; Waste</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">Tutup Toko (Malam)</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">Rekonsiliasi inventaris fisik aktual vs kalkulasi resep sistem secara otomatis</p>
          </div>
          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-lg shadow-sm">
              <span className="material-symbols-outlined text-[18px] text-primary">storefront</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Filter Cabang</span>
                <select 
                  className="bg-transparent font-headline-sm text-headline-sm text-on-surface focus:outline-none cursor-pointer pr-3" 
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                >
                  <option value="all">Semua Cabang (Konsolidasi)</option>
                  <option value="1">Cabang Tebet (Outlet #01)</option>
                  <option value="2">Cabang Kemang (Outlet #02)</option>
                  <option value="3">Cabang BSD (Outlet #03)</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-lg shadow-sm">
              <span className="material-symbols-outlined text-[18px] text-primary">calendar_today</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Tanggal Audit Opname</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-medium cursor-pointer flex items-center gap-1">
                  24 Okt 2024 (Kemarin Malam)
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_drop_down</span>
                </span>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-primary hover:bg-on-primary-fixed-variant text-on-primary px-4 py-3 rounded-lg shadow-sm transition-all duration-200 cursor-pointer font-label-md text-label-md">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Finalisasi Berita Acara</span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
          <div className="flex flex-col p-5 rounded-xl bg-surface-container-lowest shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Total Item Di-Opname</span>
              <span className="p-1.5 rounded-lg bg-surface-container text-primary material-symbols-outlined text-[18px]">inventory</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-headline-kpi text-headline-kpi text-on-surface tabular-nums">24 Bahan</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-tertiary font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              <span>100% Selesai Dihitung Shift Malam</span>
            </div>
          </div>
          
          <div className="flex flex-col p-5 rounded-xl bg-surface-container-lowest shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Selisih Kritis (Investigasi)</span>
              <span className="p-1.5 rounded-lg bg-error-container text-on-error-container material-symbols-outlined text-[18px]">warning</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-headline-kpi text-headline-kpi text-error tabular-nums">3 Item</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">perlu tinjauan</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-error font-label-sm text-label-sm font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
              <span>Total Nilai Selisih: -Rp 288.000</span>
            </div>
          </div>
          
          <div className="flex flex-col p-5 rounded-xl bg-surface-container-lowest shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Biaya Waste Bulan Ini</span>
              <span className="p-1.5 rounded-lg bg-secondary-fixed text-on-secondary-fixed material-symbols-outlined text-[18px]">delete_sweep</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-headline-kpi text-headline-kpi text-on-surface tabular-nums">Rp 840.000</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-tertiary font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[14px]">trending_down</span>
              <span>0.67% dari Omzet (Batas Aman 1.5%)</span>
            </div>
          </div>
          
          <div className="flex flex-col p-5 rounded-xl bg-surface-container-lowest shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Akurasi Resep &amp; BOM</span>
              <span className="p-1.5 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed-variant material-symbols-outlined text-[18px]">precision_manufacturing</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-headline-kpi text-headline-kpi text-on-surface tabular-nums">97.8%</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-tertiary font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              <span>+1.4% dibanding minggu lalu</span>
            </div>
          </div>
        </div>

        {/* Tabel Fisik Aktual vs Sistem */}
        <div className="flex flex-col rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden">
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container-low/40">
            <div className="flex items-center gap-space-sm">
              <div className="w-2.5 h-6 rounded-full bg-primary"></div>
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Perbandingan Fisik Aktual vs Sistem (Buku Kasir &amp; BOM)</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Bahan dengan deviasi &gt;0% otomatis ditandai untuk penelusuran resep &amp; takaran timbangan shift</p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="px-2 py-1 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-error"></span> 3 Perbedaan Ditemukan
              </span>
              <button className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[20px]">filter_list</span>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-table text-body-table border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                  <th className="py-3.5 px-space-md">Nama Bahan Pokok</th>
                  <th className="py-3.5 px-space-md">Kategori</th>
                  <th className="py-3.5 px-space-md text-right">Stok Sistem (BOM)</th>
                  <th className="py-3.5 px-space-md text-right">Hitung Fisik Aktual</th>
                  <th className="py-3.5 px-space-md text-right">Selisih / Deviasi</th>
                  <th className="py-3.5 px-space-md text-right">Nilai Rupiah</th>
                  <th className="py-3.5 px-space-md">Catatan Shift / Log</th>
                  <th className="py-3.5 px-space-md text-center">Status Audit</th>
                  <th className="py-3.5 px-space-md text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {opnames.length > 0 ? opnames.flatMap((opname, oIndex) => 
                  opname.items.map((item, iIndex) => (
                    <tr key={`${oIndex}-${iIndex}`} className="hover:bg-surface-container-high/30 transition-colors bg-surface-container-lowest border-b border-surface-container-low">
                      <td className="py-4 px-space-md font-semibold text-on-surface">
                        <div className="flex items-center gap-space-xs">
                          <span className={`material-symbols-outlined text-[18px] ${item.difference < 0 ? 'text-error' : (item.difference > 0 ? 'text-secondary' : 'text-tertiary')}`}>
                            {item.difference < 0 ? 'error' : (item.difference > 0 ? 'warning' : 'check_circle')}
                          </span>
                          <div>
                            <span className={`font-body-lg text-body-lg font-bold ${item.difference < 0 ? 'text-error' : 'text-on-surface'}`}>Item ID: {item.ingredient_id}</span>
                            <div className="font-label-sm text-label-sm text-on-surface-variant">{opname.branch?.name || 'Cabang'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-space-md text-on-surface">Bahan Baku</td>
                      <td className="py-4 px-space-md text-right font-medium text-on-surface tabular-nums">{item.system_qty}</td>
                      <td className="py-4 px-space-md text-right font-bold text-on-surface tabular-nums">{item.actual_qty}</td>
                      <td className="py-4 px-space-md text-right tabular-nums">
                        <div className="flex flex-col items-end">
                          <span className={`px-2 py-0.5 rounded font-bold inline-flex items-center gap-1 ${item.difference < 0 ? 'text-error bg-surface-container-lowest shadow-sm' : (item.difference > 0 ? 'text-secondary bg-surface-container-lowest shadow-sm' : 'text-tertiary bg-tertiary-fixed')}`}>
                            {item.difference < 0 && <span className="w-1.5 h-1.5 rounded-full bg-error"></span>}
                            {item.difference === 0 && <span className="material-symbols-outlined text-[12px]">done_all</span>}
                            {item.difference > 0 && <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>}
                            {item.difference}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-space-md text-right font-medium text-on-surface-variant tabular-nums">
                        -
                      </td>
                      <td className="py-4 px-space-md text-on-surface-variant max-w-xs">
                        <span className="italic text-on-surface-variant">{item.notes || '-'}</span>
                      </td>
                      <td className="py-4 px-space-md text-center">
                        <span className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm font-bold shadow-sm inline-flex items-center gap-1 whitespace-nowrap ${item.difference < 0 ? 'bg-error text-on-error' : (item.difference > 0 ? 'bg-secondary text-on-secondary' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant')}`}>
                          <span className="material-symbols-outlined text-[13px]">{item.difference < 0 ? 'search_insights' : (item.difference > 0 ? 'search_insights' : 'verified')}</span>
                          {item.difference !== 0 ? 'Butuh Investigasi' : 'Terverifikasi'}
                        </span>
                      </td>
                      <td className="py-4 px-space-md text-center">
                        {item.difference !== 0 ? (
                          <button className="px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold shadow-sm transition-all">
                            Investigasi
                          </button>
                        ) : (
                          <span className="text-on-surface-variant font-label-sm text-label-sm">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="py-8 text-center text-on-surface-variant">Belum ada data Stock Opname.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-surface-container-low/60 flex flex-col md:flex-row items-center justify-between gap-space-sm">
            <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
              <span className="material-symbols-outlined text-primary text-[18px]">info</span>
              <span>Stok opname ditutup oleh: <strong className="text-on-surface">Supervisor Riko</strong> pada 24 Okt 2024, 23:40 WIB</span>
            </div>
            <div className="flex items-center gap-space-sm">
              <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors">
                Cetak Berita Acara Fisik
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md font-semibold hover:bg-primary hover:text-on-primary transition-all">
                Kirim Notifikasi SPV Shift
              </button>
            </div>
          </div>
        </div>

        {/* Waste Log and Summary Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md items-start mt-2">
          {/* Buku Catatan Limbah (Waste Log) */}
          <div className="xl:col-span-8 flex flex-col rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden">
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container-low/40">
              <div className="flex items-center gap-space-sm">
                <div className="w-2.5 h-6 rounded-full bg-secondary-container"></div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Buku Catatan Limbah &amp; Kerusakan Bahan (Waste Log)</h2>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">Oktober 2024</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">Pencatatan harian kerusakan adonan, bahan baku kadaluarsa, atau kesalahan olah dapur</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 bg-primary hover:bg-on-primary-fixed-variant text-on-primary px-3.5 py-2 rounded-lg font-label-md text-label-md font-semibold transition-all shadow-sm cursor-pointer whitespace-nowrap">
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  <span>Input Waste Tambahan</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body-table text-body-table border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                    <th className="py-3 px-space-md">Waktu &amp; Cabang</th>
                    <th className="py-3 px-space-md">Bahan &amp; Jumlah Rusak</th>
                    <th className="py-3 px-space-md">Alasan Kerusakan (Root Cause)</th>
                    <th className="py-3 px-space-md">Petugas / Koki</th>
                    <th className="py-3 px-space-md text-center">Foto Bukti</th>
                    <th className="py-3 px-space-md text-right">Biaya Waste</th>
                    <th className="py-3 px-space-md text-center">Status ACC</th>
                  </tr>
                </thead>
                <tbody className="divide-y-0">
                  {wastes.length > 0 ? wastes.map(waste => (
                    <tr key={waste.id} className="hover:bg-surface-container-high/30 transition-colors">
                      <td className="py-4 px-space-md font-medium text-on-surface">
                        <div className="flex flex-col">
                          <span className="font-bold text-on-surface">{new Date(waste.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</span>
                          <span className="font-label-sm text-label-sm text-primary font-semibold">{waste.branch?.name || 'Cabang'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-space-md font-semibold text-on-surface">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-error">local_fire_department</span>
                          <div>
                            <span className="font-body-lg text-body-lg text-on-surface">{waste.item_name}</span>
                            <div className="font-label-sm text-label-sm text-on-surface-variant font-bold text-error">{waste.quantity} {waste.unit}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-space-md text-on-surface max-w-xs">
                        <p className="font-body-md text-body-md text-on-surface leading-tight">{waste.reason}</p>
                      </td>
                      <td className="py-4 px-space-md text-on-surface">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-[11px] text-on-surface">{waste.user?.name ? waste.user.name.charAt(0) : 'U'}</div>
                          <span className="font-medium whitespace-nowrap">{waste.user?.name || 'User'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-space-md text-center">
                        <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-secondary-fixed/50 hover:bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold transition-all whitespace-nowrap">
                          <span className="material-symbols-outlined text-[15px]">{waste.photo_url ? 'photo_camera' : 'hide_image'}</span>
                          <span>{waste.photo_url ? 'Ada 📷' : 'Tidak Ada'}</span>
                        </button>
                      </td>
                      <td className="py-4 px-space-md text-right font-bold text-on-surface tabular-nums">
                        Rp {Number(waste.estimated_cost).toLocaleString('id-ID')}
                      </td>
                      <td className="py-4 px-space-md text-center">
                        <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-bold whitespace-nowrap">{waste.status || 'Disetujui'}</span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-on-surface-variant">Belum ada data waste</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 bg-surface-container-low/40 flex flex-wrap items-center justify-between gap-space-sm">
              <div className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
                <span>Menampilkan 3 entri waste terkini dari total 18 insiden bulan Oktober.</span>
              </div>
              <div className="flex items-center gap-space-sm">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all">
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  <span>Filter Berdasarkan Koki</span>
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-label-md text-label-md font-semibold transition-all shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                  <span>Export Laporan Waste</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Toleransi & Dokumentasi */}
          <div className="xl:col-span-4 flex flex-col gap-space-md">
            <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Toleransi Waste Bulanan</h3>
                <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-bold">Sangat Aman</span>
              </div>
              <div className="flex items-baseline justify-between mb-1 tabular-nums">
                <span className="font-body-md text-body-md text-on-surface-variant">Biaya Terakumulasi</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Rp 840.000 <span className="font-body-md text-body-md text-on-surface-variant font-normal">/ Rp 1.875.000 max</span></span>
              </div>
              <div className="w-full bg-surface-container-high h-3 rounded-full overflow-hidden mb-2 relative">
                <div className="bg-tertiary h-full rounded-full transition-all duration-500" style={{ width: '44.8%' }}></div>
              </div>
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant tabular-nums">
                <span>Aktual: 0.67% Omzet</span>
                <span>Batas Toleransi SOP: 1.50%</span>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-surface-container-low flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">tips_and_updates</span>
                <p className="font-body-table text-body-table text-on-surface-variant leading-relaxed">
                  Biaya waste terkendali dengan sangat baik. Kerusakan terbesar bulan ini berasal dari trial adonan koki baru pada shift sore.
                </p>
              </div>
            </div>
            
            <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Dokumentasi Kerusakan</h3>
                <span className="font-label-sm text-label-sm text-primary font-semibold">2 Foto Tersedia</span>
              </div>
              <div className="grid grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1.5">
                  <div className="w-full h-28 rounded-lg overflow-hidden relative shadow-sm group bg-surface-container">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      alt="Terang Bulan Gosong"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_lwXtwPsGVuwm-t2rI9QS3ab6j3Ph4pgZ3cWDf2WxsH27YRWbS8ZlPPXx6dtkPdlwXS0XKfxeztM_btM8UlLjjnTikdu5oDx_XqY5VtaM0Zzqcf5XbhiGKjmbX0Z8MZePmhY_Qxlz6jS2d0gfz9SS4W_LsvQN4BPgjgYXhyEXYSDMBXMVckEKky-3td1zKg_4O13F1W2babyT8pK9t02zdBSBKHgnqY1-D96sIJ_zqpGzqUWkUksvSA"
                    />
                    <div className="absolute bottom-1 right-1 bg-surface/90 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-label-sm text-on-surface font-semibold">24 Okt</div>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface font-medium truncate">Terang Bulan Gosong</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Tebet &bull; Rahmat</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="w-full h-28 rounded-lg overflow-hidden relative shadow-sm group bg-surface-container">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      alt="Telur Bebek Retak"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmJ1JXVmCtcBebB8ktQxzS6UeLiWMzV2F-6tNbnWoUjcqa4RrfJzIgNTdFDtr1LYLb3WNMawNbiwnBbjOQzwHoVcNRqEZxng8ImxDfvWxqROE0cwwnEr4X8SUimSfvk-CzbltYdnlDjS2a6pI49eYTKN5aM1OWcQUAHe5Hbbtb7Ftv0jhjig4tHBGy1-W_5bxMjD-609hjIbMM7ar8MSJOvMYZoTODkWuhV1EeieV-iY0zPRTLS6vzvA"
                    />
                    <div className="absolute bottom-1 right-1 bg-surface/90 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-label-sm text-on-surface font-semibold">23 Okt</div>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface font-medium truncate">Telur Bebek Retak</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Kemang &bull; Siti</span>
                </div>
              </div>
              <div className="mt-4 pt-3 flex items-center justify-between border-t border-outline-variant/30">
                <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[16px]">cloud_sync</span>
                  <span>Cloud Storage Terenkripsi</span>
                </div>
                <button className="text-primary hover:text-on-primary-container font-label-md text-label-md font-semibold flex items-center gap-1">
                  <span>Buka Galeri</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
            
            <div className="p-5 rounded-xl bg-surface-container text-on-surface shadow-sm flex flex-col relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-[20px]">account_balance</span>
                <span className="font-headline-sm text-headline-sm font-bold">Sinkronisasi Jurnal</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Data pemborosan stok &amp; selisih opname otomatis diposting ke COGS / HPP (Akun 5-1020: Beban Kerusakan).
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Auto-Sync: Aktif (Jurnal #8942)</span>
                <span className="material-symbols-outlined text-tertiary text-[18px]">sync_saved_locally</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
