import React, { useState, useEffect } from 'react';

export default function StockOpnameWasteScreen() {
  const [wastes, setWastes] = useState([]);
  const [opnames, setOpnames] = useState([]);
  const [branchId, setBranchId] = useState('all');
  const [isWasteModalOpen, setIsWasteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('opname');

  const loadWastes = async () => {
    try {
      const endpoint = branchId === 'all' ? '/waste-logs' : `/waste-logs?branch_id=${branchId}`;
      const res = await window.apiClient.get(endpoint);
      if (res.status === 'success') setWastes(res.data);
    } catch (error) {
      console.error('Error loading waste logs:', error);
    }
  };

  const loadOpnames = async () => {
    try {
      const endpoint = branchId === 'all' ? '/stock-opnames' : `/stock-opnames?branch_id=${branchId}`;
      const res = await window.apiClient.get(endpoint);
      if (res.status === 'success') setOpnames(res.data);
    } catch (error) {
      console.error('Error loading stock opnames:', error);
    }
  };

  useEffect(() => {
    loadWastes();
    loadOpnames();
  }, [branchId]);

  const totalSelisihItems = opnames.reduce((sum, o) => sum + o.items.filter(i => i.difference !== 0).length, 0);
  const totalBiayaWaste = wastes.reduce((sum, w) => sum + Number(w.estimated_cost), 0);
  const totalOpnameItems = opnames.reduce((sum, o) => sum + o.items.length, 0);

  const handleAddWasteSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    try {
      const res = await window.apiClient.post('/waste-logs', data);
      if (res.status === 'success') {
        alert('Waste berhasil ditambahkan');
        setIsWasteModalOpen(false);
        loadWastes();
      }
    } catch (err) {
      alert('Gagal menambah data waste');
    }
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md py-space-md">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface font-bold">Stok Opname & Waste</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">Pantau stok fisik dan pencatatan bahan rusak/terbuang</p>
        </div>
        <div className="flex items-center gap-space-sm flex-wrap">
          <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-2 rounded-lg shadow-sm">
            <span className="material-symbols-outlined text-[18px] text-primary">storefront</span>
            <select
              className="bg-transparent font-body-md text-on-surface focus:outline-none cursor-pointer"
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
            >
              <option value="all">Semua Cabang</option>
              <option value="1">Cabang Tebet</option>
              <option value="2">Cabang Kemang</option>
              <option value="3">Cabang BSD</option>
            </select>
          </div>
          <button
            onClick={() => setIsWasteModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold shadow-sm hover:opacity-90 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Catat Waste
          </button>
        </div>
      </div>

      {/* KPI Cards Simpel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md mb-space-lg">
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[24px]">inventory</span>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Total Item Dicek</p>
            <p className="font-headline-sm text-headline-sm text-on-surface font-bold">{totalOpnameItems} Bahan</p>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${totalSelisihItems > 0 ? 'bg-error/10 text-error' : 'bg-tertiary/10 text-tertiary'}`}>
            <span className="material-symbols-outlined text-[24px]">{totalSelisihItems > 0 ? 'warning' : 'check_circle'}</span>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Selisih Stok</p>
            <p className={`font-headline-sm text-headline-sm font-bold ${totalSelisihItems > 0 ? 'text-error' : 'text-tertiary'}`}>{totalSelisihItems} Item</p>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[24px]">delete_sweep</span>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Biaya Waste</p>
            <p className="font-headline-sm text-headline-sm text-on-surface font-bold">Rp {totalBiayaWaste.toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-space-md">
        <button
          onClick={() => setActiveTab('opname')}
          className={`px-4 py-2 rounded-lg font-label-md text-label-md font-semibold transition-all ${activeTab === 'opname' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container shadow-sm'}`}
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">inventory</span>
            Stok Opname
          </span>
        </button>
        <button
          onClick={() => setActiveTab('waste')}
          className={`px-4 py-2 rounded-lg font-label-md text-label-md font-semibold transition-all ${activeTab === 'waste' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container shadow-sm'}`}
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
            Catatan Waste
            {wastes.length > 0 && <span className="px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">{wastes.length}</span>}
          </span>
        </button>
      </div>

      {/* Tab: Stok Opname */}
      {activeTab === 'opname' && (
        <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden">
          <div className="p-4 bg-surface-container-low/40 flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Data Stok Opname</h2>
            <span className="font-label-sm text-label-sm text-on-surface-variant">{totalOpnameItems} total item</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                  <th className="py-3 px-4">Nama Bahan</th>
                  <th className="py-3 px-4">Cabang</th>
                  <th className="py-3 px-4 text-right">Stok Sistem</th>
                  <th className="py-3 px-4 text-right">Stok Fisik</th>
                  <th className="py-3 px-4 text-center">Selisih</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  {totalSelisihItems > 0 && <th className="py-3 px-4 text-center">Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {opnames.length > 0 ? opnames.flatMap((opname, oIdx) =>
                  opname.items.map((item, iIdx) => (
                    <tr key={`${oIdx}-${iIdx}`} className="border-t border-surface-container hover:bg-surface-container/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${item.difference < 0 ? 'bg-error' : item.difference > 0 ? 'bg-secondary' : 'bg-tertiary'}`}></span>
                          <span className="font-medium text-on-surface">ID: {item.ingredient_id}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-on-surface-variant font-label-sm text-label-sm">{opname.branch?.name || 'Cabang'}</td>
                      <td className="py-3.5 px-4 text-right font-medium text-on-surface">{item.system_qty}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-on-surface">{item.actual_qty}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-bold font-label-sm text-label-sm ${
                          item.difference < 0 ? 'bg-error-container text-error' :
                          item.difference > 0 ? 'bg-secondary-fixed text-on-secondary-fixed-variant' :
                          'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                        }`}>
                          {item.difference > 0 ? '+' : ''}{item.difference}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold ${
                          item.difference !== 0 ? 'bg-error-container text-error' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                        }`}>
                          {item.difference !== 0 ? 'Perlu Cek' : 'OK'}
                        </span>
                      </td>
                      {totalSelisihItems > 0 && (
                        <td className="py-3.5 px-4 text-center">
                          {item.difference !== 0 ? (
                            <button className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold transition-all">
                              Investigasi
                            </button>
                          ) : <span className="text-on-surface-variant">—</span>}
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-[40px] block mb-2 opacity-40">inventory</span>
                      Belum ada data stok opname.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-surface-container-low/30 flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Data opname dari semua shift</span>
            <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors">
              Cetak Laporan
            </button>
          </div>
        </div>
      )}

      {/* Tab: Waste Log */}
      {activeTab === 'waste' && (
        <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden">
          <div className="p-4 bg-surface-container-low/40 flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Catatan Waste & Kerusakan</h2>
            <button
              onClick={() => setIsWasteModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold shadow-sm hover:opacity-90 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              Tambah
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Cabang</th>
                  <th className="py-3 px-4">Nama Bahan</th>
                  <th className="py-3 px-4">Jumlah</th>
                  <th className="py-3 px-4">Alasan</th>
                  <th className="py-3 px-4">Petugas</th>
                  <th className="py-3 px-4 text-right">Biaya (Rp)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {wastes.length > 0 ? wastes.map(waste => (
                  <tr key={waste.id} className="border-t border-surface-container hover:bg-surface-container/30 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-on-surface whitespace-nowrap">
                      {new Date(waste.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-on-surface">{waste.branch?.name || 'Cabang'}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-on-surface">{waste.item_name}</td>
                    <td className="py-3.5 px-4 font-bold text-error">{waste.quantity} {waste.unit}</td>
                    <td className="py-3.5 px-4 text-on-surface-variant max-w-xs">
                      <p className="line-clamp-2">{waste.reason}</p>
                    </td>
                    <td className="py-3.5 px-4 text-on-surface">{waste.user?.name || '—'}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-on-surface">
                      {Number(waste.estimated_cost).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-semibold whitespace-nowrap">
                        {waste.status || 'Disetujui'}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-[40px] block mb-2 opacity-40">delete_sweep</span>
                      Belum ada data waste.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {wastes.length > 0 && (
            <div className="p-4 bg-surface-container-low/30 flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Total: <strong className="text-on-surface">Rp {totalBiayaWaste.toLocaleString('id-ID')}</strong></span>
              <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">file_download</span>
                Export Laporan
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal: Input Waste */}
      {isWasteModalOpen && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-space-md">
          <div className="w-full max-w-lg rounded-2xl bg-surface-container-lowest shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-space-md bg-surface-container-low flex items-center justify-between sticky top-0 z-10 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">add_circle</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">Catat Waste / Kerusakan Bahan</span>
              </div>
              <button onClick={() => setIsWasteModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <form onSubmit={handleAddWasteSubmit} className="flex flex-col overflow-y-auto">
              <div className="p-space-md flex flex-col gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Nama Bahan / Item</label>
                  <input type="text" name="item_name" required placeholder="Contoh: Tepung Terigu" className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Jumlah Rusak</label>
                  <div className="flex gap-2">
                    <input type="number" step="0.01" name="quantity" required placeholder="0" className="w-2/3 p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none" />
                    <select name="unit" className="w-1/3 p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none" required>
                      <option value="pcs">Pcs</option>
                      <option value="kg">Kg</option>
                      <option value="gr">Gram</option>
                      <option value="liter">Liter</option>
                      <option value="porsi">Porsi</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Alasan / Penyebab Kerusakan</label>
                  <textarea name="reason" className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none" rows="2" required placeholder="Contoh: Terbakar, kadaluarsa, tumpah..."></textarea>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Estimasi Biaya Kerugian (Rp)</label>
                  <input type="number" name="estimated_cost" required placeholder="0" className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Cabang</label>
                  <select name="branch_id" className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none" required>
                    <option value="1">Cabang Tebet</option>
                    <option value="2">Cabang Kemang</option>
                    <option value="3">Cabang BSD</option>
                  </select>
                </div>
              </div>
              <div className="p-space-md bg-surface-container-low flex justify-end gap-space-xs sticky bottom-0 border-t border-surface-container-high">
                <button type="button" onClick={() => setIsWasteModalOpen(false)} className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high">Batal</button>
                <button type="submit" className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:opacity-90">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
