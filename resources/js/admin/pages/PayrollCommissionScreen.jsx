import React, { useState, useEffect } from 'react';

export default function PayrollCommissionScreen() {
  const [activePeriod, setActivePeriod] = useState('oct-2024');
  const [activeBranch, setActiveBranch] = useState('all');
  const [activeStatus, setActiveStatus] = useState('ready');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(true);

  const showToast = (title, desc, icon = 'check', isError = false) => {
    setToastMessage({ title, desc, icon, isError });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const fetchPayrolls = async () => {
    setLoading(true);
    try {
      const res = await window.apiClient.get('/payrolls');
      if (res.status === 'success') {
        setPayrollData(res.data);
      }
    } catch (err) {
      console.error('Error loading payroll:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendWa = (name, amount) => {
    showToast('Slip Gaji Terkirim', `Slip digital Rp ${amount} berhasil dikirim ke nomor terdaftar ${name}.`);
  };

  const handleExportBca = () => {
    showToast('Batch Transfer Siap', 'File BCA_Payroll.csv berhasil diunduh untuk KlikBCA Bisnis.', 'file_download');
  };

  const handleLockPeriod = () => {
    if (window.confirm('Apakah Anda yakin ingin mengunci periode ini? Perubahan data absensi dan loyang tidak dapat disunting kembali setelah dikunci.')) {
      showToast('Periode Dikunci', 'Payroll telah difinalisasi dan diarsip.', 'lock');
    }
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Top Title & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md mb-space-lg">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs mb-1">
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm uppercase tracking-wider font-bold">Payroll Engine</span>
            <span className="text-outline-variant text-[14px]">/</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Perhitungan Komisi & THP</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">Gaji & Insentif Kru Outlet</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Otomatisasi kalkulasi loyang terjual, potongan kasbon, dan pencairan batch transfer bank.</p>
        </div>
        {/* Filter Control Group */}
        <div className="flex flex-wrap items-center gap-space-sm bg-surface-container-low p-1.5 rounded-xl shadow-sm">
          <div className="relative">
            <label className="sr-only" htmlFor="filter-period">Periode Gaji</label>
            <div className="flex items-center gap-space-xs bg-surface-container-lowest px-3 py-2 rounded-lg shadow-sm cursor-pointer hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-primary text-[18px]">calendar_month</span>
              <select id="filter-period" className="bg-transparent font-label-md text-label-md text-on-surface outline-none cursor-pointer pr-3" value={activePeriod} onChange={e => setActivePeriod(e.target.value)}>
                <option value="oct-2024">Oktober 2024 (Cut-off 25 Okt)</option>
                <option value="sep-2024">September 2024 (Cut-off 25 Sep)</option>
                <option value="aug-2024">Agustus 2024 (Cut-off 25 Ags)</option>
              </select>
            </div>
          </div>
          <div className="relative">
            <label className="sr-only" htmlFor="filter-branch">Pilihan Cabang</label>
            <div className="flex items-center gap-space-xs bg-surface-container-lowest px-3 py-2 rounded-lg shadow-sm cursor-pointer hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-primary text-[18px]">store</span>
              <select id="filter-branch" className="bg-transparent font-label-md text-label-md text-on-surface outline-none cursor-pointer pr-3" value={activeBranch} onChange={e => setActiveBranch(e.target.value)}>
                <option value="all">Semua Cabang (4 Outlet)</option>
                <option value="tebet">Outlet Tebet Raya</option>
                <option value="bsd">Outlet BSD Sektor 1</option>
                <option value="kelapa-gading">Outlet Kelapa Gading</option>
                <option value="bintaro">Outlet Bintaro S9</option>
              </select>
            </div>
          </div>
          <div className="relative">
            <label className="sr-only" htmlFor="filter-status">Status Pembayaran</label>
            <div className="flex items-center gap-space-xs bg-surface-container-lowest px-3 py-2 rounded-lg shadow-sm cursor-pointer hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
              <select id="filter-status" className="bg-transparent font-label-md text-label-md text-on-surface outline-none cursor-pointer pr-3" value={activeStatus} onChange={e => setActiveStatus(e.target.value)}>
                <option value="ready">Siap Transfer / Draft</option>
                <option value="verified">Terverifikasi Owner</option>
                <option value="completed">Sudah Dicairkan</option>
              </select>
            </div>
          </div>
          <button className="w-9 h-9 flex items-center justify-center bg-primary text-on-primary rounded-lg shadow-sm hover:bg-on-primary-container transition-all" title="Refresh Perhitungan">
            <span className="material-symbols-outlined text-[18px]">autorenew</span>
          </button>
        </div>
      </div>

      {/* Financial KPI Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop mb-space-lg">
        {/* Total Payroll Card */}
        <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Payroll Bulan Ini</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline-kpi text-headline-kpi text-on-surface">Rp 46.850.000</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              <span className="font-body-md text-body-md text-on-surface-variant">15 Karyawan Aktif</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">4 Cabang Sinkron</span>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-primary/5 pointer-events-none"></div>
        </div>
        {/* Total Insentif Card */}
        <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Insentif Loyang Terjual</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline-kpi text-headline-kpi text-primary">Rp 7.800.000</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-secondary-fixed/50 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[24px]">local_pizza</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between">
            <span className="font-body-md text-body-md text-on-surface-variant">Skema: Rp 1.000 / loyang dibagikan rata</span>
            <span className="font-label-md text-label-md text-tertiary font-semibold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[16px]">trending_up</span> 7.800 Unit
            </span>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-secondary-container/20 pointer-events-none"></div>
        </div>
        {/* Total Potongan Card */}
        <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Potongan Kasbon & Selisih</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline-kpi text-headline-kpi text-error">Rp 1.250.000</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-error-container flex items-center justify-center text-on-error-container">
              <span className="material-symbols-outlined text-[24px]">price_check</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between">
            <span className="font-body-md text-body-md text-on-surface-variant">Kasbon: Rp 1.175k | Beban Kasir: Rp 75k</span>
            <span className="px-2 py-0.5 rounded-full bg-error text-on-error font-label-sm text-label-sm font-semibold">1 Rekonsiliasi</span>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-error/5 pointer-events-none"></div>
        </div>
      </div>

      {/* Operational Alert Callout */}
      <div className="bg-surface-container-low rounded-xl p-space-md mb-space-lg flex flex-col md:flex-row md:items-center justify-between gap-space-md shadow-sm">
        <div className="flex items-center gap-space-sm">
          <div className="w-9 h-9 rounded-lg bg-error text-on-error flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">report</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-surface">Auto-Deduction Selisih Kasir Terdeteksi</span>
            <span className="font-body-md text-body-md text-on-surface-variant">Pemotongan Rp 75.000 diterapkan pada kasir Dimas Anggara (Tebet) sesuai audit selisih laci kas closing shift malam 24 Okt.</span>
          </div>
        </div>
        <div className="flex items-center gap-space-sm flex-shrink-0">
          <button className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors shadow-sm">Lihat Log Audit</button>
          <button className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md hover:opacity-90 transition-opacity">Verifikasi Selisih</button>
        </div>
      </div>

      {/* Ledger Data Card & Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden mb-space-lg">
        <div className="p-space-md bg-surface-container-low/60 flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="font-headline-sm text-headline-sm text-on-surface">Rincian Komponen Gaji Staf</span>
            <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm">5 dari 15 Ditampilkan</span>
          </div>
          <div className="flex items-center gap-space-xs">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-2.5 text-[18px] text-on-surface-variant">search</span>
              <input 
                className="pl-8 pr-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md outline-none placeholder:text-outline shadow-sm w-56" 
                placeholder="Cari nama atau cabang..." 
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface transition-colors shadow-sm" title="Download Spreadsheet">
              <span className="material-symbols-outlined text-[20px]">file_download</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse tabular-nums">
            <thead>
              <tr className="bg-surface-container-high/60 text-on-surface-variant uppercase tracking-wider font-label-sm text-label-sm">
                <th className="py-3 px-space-md">Karyawan & Posisi</th>
                <th className="py-3 px-space-sm">Cabang</th>
                <th className="py-3 px-space-sm text-center">Kehadiran</th>
                <th className="py-3 px-space-sm text-right">Gaji Pokok</th>
                <th className="py-3 px-space-sm text-right">Insentif Loyang</th>
                <th className="py-3 px-space-sm text-right">Lembur</th>
                <th className="py-3 px-space-sm text-right">Potongan</th>
                <th className="py-3 px-space-md text-right bg-primary-fixed/20 text-on-primary-fixed font-bold">Total THP</th>
                <th className="py-3 px-space-sm text-center">Status</th>
                <th className="py-3 px-space-md text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-none font-body-table text-body-table text-on-surface">
              {loading ? (
                <tr><td colSpan="9" className="py-8 text-center text-on-surface-variant">Memuat data payroll...</td></tr>
              ) : payrollData.length > 0 ? (
                payrollData
                  .filter(emp => {
                    const name = emp.user?.name || emp.name || '';
                    const branch = emp.branch?.name || emp.branch || '';
                    return name.toLowerCase().includes(searchQuery.toLowerCase()) || branch.toLowerCase().includes(searchQuery.toLowerCase());
                  })
                  .map((emp, index) => {
                    const name = emp.user?.name || emp.name || 'Karyawan';
                    const role = emp.user?.role || emp.role || '-';
                    const branch = emp.branch?.name || emp.branch || '-';
                    const baseSalary = emp.base_salary ? `Rp ${Number(emp.base_salary).toLocaleString('id-ID')}` : (emp.baseSalary || 'Rp 0');
                    const commission = emp.commission ? `Rp ${Number(emp.commission).toLocaleString('id-ID')}` : (emp.incentive || 'Rp 0');
                    const deductions = emp.deductions ? `Rp ${Number(emp.deductions).toLocaleString('id-ID')}` : (emp.deduction || 'Rp 0');
                    const netSalary = emp.net_salary ? Number(emp.net_salary).toLocaleString('id-ID') : (emp.thp || '0');
                    const status = emp.status || 'Draft';
                    const initials = name.charAt(0).toUpperCase();
                    const statusBadge = status === 'paid' || status === 'Terverifikasi' 
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' 
                      : status === 'pending' || status === 'Draft Review'
                      ? 'bg-secondary-fixed text-on-secondary-fixed'
                      : 'bg-surface-container-high text-on-surface';
                    const statusIcon = status === 'paid' || status === 'Terverifikasi' ? 'check_circle' : 'pending';

                    return (
                      <tr key={emp.id || index} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="py-3 px-space-md">
                          <div className="flex items-center gap-space-xs">
                            <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-xs shadow-sm">{initials}</div>
                            <div className="flex flex-col">
                              <span className="font-headline-sm text-[14px] text-on-surface leading-tight font-semibold">{name}</span>
                              <span className="font-label-sm text-label-sm text-on-surface-variant">{role}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-space-sm">
                          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm">{branch}</span>
                        </td>
                        <td className="py-3 px-space-sm text-center">
                          <span className="font-semibold text-tertiary">{emp.attendance || '-'}</span>
                        </td>
                        <td className="py-3 px-space-sm text-right font-medium">{baseSalary}</td>
                        <td className="py-3 px-space-sm text-right">
                          <span className="font-medium text-primary">{commission}</span>
                        </td>
                        <td className="py-3 px-space-sm text-right font-medium">{emp.overtime ? `Rp ${Number(emp.overtime).toLocaleString('id-ID')}` : (emp.overtime_pay || 'Rp 0')}</td>
                        <td className="py-3 px-space-sm text-right">
                          <span className={`font-medium ${Number(emp.deductions) > 0 ? 'text-error' : 'text-on-surface-variant'}`}>{deductions}</span>
                        </td>
                        <td className="py-3 px-space-md text-right bg-primary-fixed/20 font-headline-sm text-[15px] font-bold text-primary">
                          Rp {netSalary}
                        </td>
                        <td className="py-3 px-space-sm text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${statusBadge} font-label-sm text-label-sm font-semibold`}>
                            <span className="material-symbols-outlined text-[13px]">{statusIcon}</span> {status}
                          </span>
                        </td>
                        <td className="py-3 px-space-md text-center">
                          <button onClick={() => handleSendWa(name, netSalary)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface font-label-sm text-label-sm transition-all shadow-sm">
                            <span className="material-symbols-outlined text-[15px] text-tertiary">chat</span>
                            <span>Kirim WA</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
              ) : (
                <tr><td colSpan="9" className="py-8 text-center text-on-surface-variant">Belum ada data payroll. Tambahkan data melalui menu Kasir.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-space-md py-3 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
          <span>Menampilkan {payrollData.length} data payroll. Tambah lewat input manual atau sinkronisasi shift.</span>
          <div className="flex items-center gap-space-xs">
            <button className="px-2.5 py-1 rounded bg-surface-container-lowest text-on-surface shadow-sm disabled:opacity-50" disabled>Sebelumnya</button>
            <span className="font-bold text-on-surface px-1">Halaman 1 dari 3</span>
            <button className="px-2.5 py-1 rounded bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container-high">Berikutnya</button>
          </div>
        </div>
      </div>

      {/* Bottom Action Center & Executive Tools */}
      <div className="bg-surface-container-high rounded-xl p-space-md shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-sm">
          <div className="w-11 h-11 rounded-lg bg-primary text-on-primary flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[24px]">verified_user</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-surface">Otorisasi Payroll & Sinkronisasi Bank</span>
            <span className="font-body-md text-body-md text-on-surface-variant">Format batch disesuaikan otomatis dengan BCA Corporate Payroll & perhitungan PPh 21 TER 2024.</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-space-sm w-full lg:w-auto">
          <button className="flex-1 lg:flex-initial flex items-center justify-center gap-space-xs px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-sm hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[18px]">receipt</span>
            <span>Cetak Rekap PPh 21</span>
          </button>
          <button onClick={handleLockPeriod} className="flex-1 lg:flex-initial flex items-center justify-center gap-space-xs px-4 py-2.5 rounded-lg bg-surface-container-lowest text-error font-label-md text-label-md shadow-sm hover:bg-error-container transition-colors">
            <span className="material-symbols-outlined text-[18px]">lock</span>
            <span>Kunci Periode Gaji</span>
          </button>
          <button onClick={handleExportBca} className="flex-1 lg:flex-initial flex items-center justify-center gap-space-xs px-5 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md shadow-sm hover:opacity-90 transition-opacity font-semibold">
            <span className="material-symbols-outlined text-[20px]">download_for_offline</span>
            <span>Export BCA Payroll Batch (.csv)</span>
          </button>
        </div>
      </div>

      {/* Micro-interaction Notification Toast */}
      <div 
        className={`fixed bottom-6 right-6 z-50 bg-surface-container-lowest shadow-xl rounded-xl p-4 flex items-center gap-3 transform transition-all duration-300 pointer-events-none ${toastMessage ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}
      >
        {toastMessage && (
          <>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toastMessage.isError ? 'bg-error text-on-error' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'}`}>
              <span className="material-symbols-outlined text-[18px]">{toastMessage.icon}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-sm text-on-surface font-semibold">{toastMessage.title}</span>
              <span className="font-body-md text-xs text-on-surface-variant">{toastMessage.desc}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
