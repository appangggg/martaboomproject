import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminSettingsScreen() {
  const [activeTab, setActiveTab] = useState('pengguna-pin');
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinTarget, setPinTarget] = useState(null);
  const [newPin, setNewPin] = useState('');
  const [pinSaving, setPinSaving] = useState(false);
  const [pinError, setPinError] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Konfigurasi sistem (lokal, bisa dihubungkan ke API nantinya)
  const [appName, setAppName] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pos_settings') || '{}').app_name || 'Martaboom POS'; } catch { return 'Martaboom POS'; }
  });
  const [printerSize, setPrinterSize] = useState('80mm');
  const [autoShiftClose, setAutoShiftClose] = useState(true);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/employees');
      if (res.data.status === 'success') {
        const data = Array.isArray(res.data.data) ? res.data.data : (res.data.data.data || []);
        setStaffList(data.map(e => ({
          id: e.employee_id || ('STF-' + e.id.toString().padStart(3, '0')),
          real_id: e.id,
          name: e.name,
          init: e.name.substring(0, 2).toUpperCase(),
          branch_id: e.branch_id,
          branch: e.branch ? e.branch.name : 'Semua Cabang',
          role: e.role,
          status: e.pin ? 'PIN Aktif' : 'Belum Ada PIN',
          hasPin: !!e.pin,
          isExpired: !e.pin
        })));
      }
    } catch (err) {
      console.error('Error fetching employees', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    try {
      if (selectedEmployee) {
        await axios.put(`/api/admin/employees/${selectedEmployee.real_id}`, data);
      } else {
        await axios.post('/api/admin/employees', data);
      }
      setIsEmployeeModalOpen(false);
      fetchEmployees();
    } catch (error) {
      alert('Gagal menyimpan akun staf. Cek console untuk detail.');
      console.error(error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!confirm('Yakin ingin menghapus akun staf ini?')) return;
    try {
      await axios.delete(`/api/admin/employees/${id}`);
      fetchEmployees();
    } catch {
      alert('Gagal menghapus staf.');
    }
  };

  const openPinModal = (staff) => {
    setPinTarget(staff);
    setNewPin('');
    setPinError('');
    setIsPinModalOpen(true);
  };

  const handlePinSave = async () => {
    if (!/^\d{6}$/.test(newPin)) { setPinError('PIN harus tepat 6 angka.'); return; }
    setPinSaving(true);
    try {
      const res = await axios.post(`/api/admin/employees/${pinTarget.real_id}/reset-pin`, { pin: newPin });
      if (res.data.status === 'success') {
        setIsPinModalOpen(false);
        fetchEmployees();
        alert(`PIN berhasil diset untuk ${pinTarget.name}.`);
      } else {
        setPinError(res.data.message || 'Gagal menyimpan PIN.');
      }
    } catch (err) {
      setPinError(err.response?.data?.message || 'Terjadi kesalahan.');
    } finally {
      setPinSaving(false);
    }
  };

  const handleClearPin = async (staff) => {
    if (!confirm(`Hapus PIN untuk ${staff.name}? Mereka tidak bisa login sampai PIN baru dibuat.`)) return;
    try {
      await axios.delete(`/api/admin/employees/${staff.real_id}/clear-pin`);
      fetchEmployees();
    } catch {
      alert('Gagal menghapus PIN.');
    }
  };

  const saveSystemSettings = () => {
    try {
      localStorage.setItem('pos_settings', JSON.stringify({ app_name: appName }));
      alert('Pengaturan sistem berhasil disimpan!');
    } catch {
      alert('Gagal menyimpan pengaturan.');
    }
  };

  const roleColors = {
    owner: 'bg-primary-fixed text-on-primary-fixed',
    supervisor: 'bg-secondary-fixed text-on-secondary-fixed-variant',
    cashier: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
    kitchen: 'bg-surface-container-high text-on-surface',
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Page Header */}
      <div className="mb-space-lg">
        <h1 className="font-headline-md text-headline-md text-on-surface font-bold">Pengaturan Sistem</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">Kelola akun staf, PIN kasir, dan konfigurasi aplikasi.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-space-lg overflow-x-auto">
        <button
          onClick={() => setActiveTab('pengguna-pin')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-md text-label-md transition-all shrink-0 shadow-sm ${activeTab === 'pengguna-pin' ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'}`}
        >
          <span className="material-symbols-outlined text-[18px]">badge</span>
          Pengguna & PIN Kasir
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'pengguna-pin' ? 'bg-white/20' : 'bg-surface-container'}`}>{staffList.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('sistem')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-md text-label-md transition-all shrink-0 shadow-sm ${activeTab === 'sistem' ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'}`}
        >
          <span className="material-symbols-outlined text-[18px]">settings</span>
          Konfigurasi Sistem
        </button>
      </div>

      {/* Tab: Pengguna & PIN */}
      {activeTab === 'pengguna-pin' && (
        <div className="flex flex-col gap-space-lg">
          <div className="flex items-center justify-between flex-wrap gap-space-md">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Kelola akun dan PIN login untuk seluruh staf kasir, dapur, dan supervisor.
            </p>
            <button
              onClick={() => { setSelectedEmployee(null); setIsEmployeeModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold shadow-sm hover:opacity-90 transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              Tambah Akun Staf
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[40px] block mb-2 animate-spin">progress_activity</span>
              Memuat data staf...
            </div>
          ) : (
            <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                      <th className="py-3.5 px-4">Nama Staf</th>
                      <th className="py-3.5 px-4">Cabang</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4 text-center">Status PIN</th>
                      <th className="py-3.5 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.map((staff, idx) => (
                      <tr key={idx} className="border-t border-surface-container hover:bg-surface-container/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${staff.isExpired ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>
                              {staff.init}
                            </div>
                            <div>
                              <p className="font-semibold text-on-surface">{staff.name}</p>
                              <p className="font-label-sm text-label-sm text-on-surface-variant">ID: {staff.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-on-surface">{staff.branch}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded font-label-sm text-label-sm font-semibold capitalize ${roleColors[staff.role] || 'bg-surface-container text-on-surface'}`}>
                            {staff.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold ${staff.hasPin ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : 'bg-error-container text-error'}`}>
                            <span className="material-symbols-outlined text-[14px]">{staff.hasPin ? 'lock' : 'lock_open'}</span>
                            {staff.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openPinModal(staff)}
                              className={`px-2 py-1.5 rounded-lg font-label-sm text-label-sm inline-flex items-center gap-1 transition-colors ${staff.isExpired ? 'bg-error-container text-on-error-container' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'}`}
                            >
                              <span className="material-symbols-outlined text-[15px]">{staff.isExpired ? 'key' : 'key'}</span>
                              {staff.isExpired ? 'Set PIN' : 'Ubah PIN'}
                            </button>
                            <button
                              onClick={() => { setSelectedEmployee(staff); setIsEmployeeModalOpen(true); }}
                              className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
                            >
                              <span className="material-symbols-outlined text-[17px]">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(staff.real_id)}
                              className="p-1.5 rounded-lg text-error hover:bg-error-container transition-colors"
                            >
                              <span className="material-symbols-outlined text-[17px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {staffList.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-12 text-center text-on-surface-variant">
                          <span className="material-symbols-outlined text-[40px] block mb-2 opacity-40">badge</span>
                          Belum ada staf terdaftar.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Konfigurasi Sistem */}
      {activeTab === 'sistem' && (
        <div className="flex flex-col gap-space-lg max-w-2xl">
          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Informasi Aplikasi</h3>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant">Nama Toko / Aplikasi POS</label>
              <input
                type="text"
                value={appName}
                onChange={e => setAppName(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container"
                placeholder="Contoh: Martaboom POS"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant">Ukuran Kertas Printer Struk</label>
              <select
                value={printerSize}
                onChange={e => setPrinterSize(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none"
              >
                <option value="58mm">58mm (Struk Kecil)</option>
                <option value="80mm">80mm (Struk Standar)</option>
              </select>
            </div>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Pengaturan Shift</h3>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-body-md text-body-md text-on-surface font-medium">Tutup Shift Otomatis</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Shift otomatis ditutup pada pukul 00:00 WIB jika kasir lupa menutup</p>
              </div>
              <button
                onClick={() => setAutoShiftClose(!autoShiftClose)}
                className={`w-12 h-6 rounded-full transition-all relative ${autoShiftClose ? 'bg-primary' : 'bg-surface-container-high'}`}
              >
                <span className={`w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-all ${autoShiftClose ? 'left-6' : 'left-0.5'}`}></span>
              </button>
            </div>
          </div>

          <button
            onClick={saveSystemSettings}
            className="px-6 py-3 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-sm hover:opacity-90 transition-all self-start flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">save</span>
            Simpan Pengaturan
          </button>
        </div>
      )}

      {/* Modal: Form Staf */}
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-space-md">
          <div className="w-full max-w-lg rounded-2xl bg-surface-container-lowest shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-space-md bg-surface-container-low flex items-center justify-between sticky top-0 z-10 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">{selectedEmployee ? 'edit' : 'person_add'}</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">{selectedEmployee ? 'Edit Akun Staf' : 'Tambah Akun Staf Baru'}</span>
              </div>
              <button onClick={() => setIsEmployeeModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <form onSubmit={handleEmployeeSubmit} className="flex flex-col overflow-y-auto">
              <div className="p-space-md flex flex-col gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Nama Lengkap</label>
                  <input type="text" name="name" defaultValue={selectedEmployee?.name} required className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Role / Jabatan</label>
                  <select name="role" defaultValue={selectedEmployee?.role || 'cashier'} className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none">
                    <option value="owner">Owner</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="cashier">Kasir</option>
                    <option value="kitchen">Koki / Dapur</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Penempatan Cabang</label>
                  <select name="branch_id" defaultValue={selectedEmployee?.branch_id || ''} className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none">
                    <option value="">Semua Cabang (Global)</option>
                    <option value="1">Cabang Tebet</option>
                    <option value="2">Cabang Kemang</option>
                    <option value="3">Cabang BSD</option>
                  </select>
                </div>
                {!selectedEmployee && (
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-label-sm text-on-surface-variant">PIN Awal (6 Angka, Opsional)</label>
                    <input type="password" name="pin" maxLength="6" pattern="\d{6}" placeholder="Bisa diset nanti" className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none" />
                    <span className="text-[11px] text-on-surface-variant">Bisa diset setelah akun dibuat via tombol "Set PIN"</span>
                  </div>
                )}
              </div>
              <div className="p-space-md bg-surface-container-low flex justify-end gap-space-xs sticky bottom-0 border-t border-surface-container-high">
                <button type="button" onClick={() => setIsEmployeeModalOpen(false)} className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high">Batal</button>
                <button type="submit" className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:opacity-90">Simpan Akun</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Set PIN */}
      {isPinModalOpen && pinTarget && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-space-md">
          <div className="w-full max-w-sm rounded-2xl bg-surface-container-lowest shadow-xl overflow-hidden flex flex-col">
            <div className="p-space-md bg-surface-container-low flex items-center justify-between border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">key</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">Set PIN Kasir</span>
              </div>
              <button onClick={() => setIsPinModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="p-space-md flex flex-col gap-space-sm">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Atur PIN baru untuk <strong className="text-on-surface">{pinTarget.name}</strong>. PIN digunakan untuk login kasir.
              </p>
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant">PIN Baru (6 Angka)</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="••••••"
                  value={newPin}
                  onChange={e => { setNewPin(e.target.value.replace(/\D/g, '').substring(0, 6)); setPinError(''); }}
                  className="w-full p-3 rounded-xl bg-surface-container-low text-on-surface font-mono text-xl text-center tracking-[0.5em] focus:outline-none focus:bg-surface-container"
                  autoFocus
                />
                <div className="flex gap-2 justify-center mt-1">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full transition-all ${i < newPin.length ? 'bg-primary scale-110' : 'bg-surface-variant'}`}></div>
                  ))}
                </div>
                {pinError && <p className="font-label-sm text-label-sm text-error mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span>{pinError}</p>}
              </div>
            </div>
            <div className="p-space-md bg-surface-container-low flex justify-end gap-space-xs border-t border-surface-container-high">
              <button type="button" onClick={() => handleClearPin(pinTarget)} className="px-space-md py-2 rounded-lg bg-error-container text-on-error-container font-label-md text-label-md hover:opacity-90 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">lock_open</span>
                Hapus PIN
              </button>
              <button type="button" onClick={() => setIsPinModalOpen(false)} className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high">Batal</button>
              <button
                type="button"
                onClick={handlePinSave}
                disabled={newPin.length !== 6 || pinSaving}
                className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:opacity-90 disabled:opacity-40 flex items-center gap-1"
              >
                {pinSaving ? <><span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span> Menyimpan...</> : 'Simpan PIN'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
