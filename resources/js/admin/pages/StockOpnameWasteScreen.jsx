import React, { useState, useEffect } from 'react';

export default function StockOpnameWasteScreen() {
  const [wastes, setWastes] = useState([]);
  const [opnames, setOpnames] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [isWasteModalOpen, setIsWasteModalOpen] = useState(false);
  const [isOpnameModalOpen, setIsOpnameModalOpen] = useState(false);
  const [isInvestigasiModalOpen, setIsInvestigasiModalOpen] = useState(false);
  const [selectedInvestigasiItem, setSelectedInvestigasiItem] = useState(null);
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

  const loadInventory = async () => {
    try {
      const endpoint = branchId === 'all' ? '/kitchen/inventory' : `/kitchen/inventory?branch_id=${branchId}`;
      const res = await window.apiClient.get(endpoint);
      if (res.status === 'success') setInventory(res.data);
    } catch (error) {
      console.error('Error loading inventory:', error);
    }
  };

  const loadBranches = async () => {
    try {
      const res = await window.apiClient.get('/admin/branches');
      // BranchController returns the array directly, so res might be the array itself
      const branchData = Array.isArray(res) ? res : (res.data?.data || res.data || []);
      setBranches(branchData);
    } catch (error) {
      console.error('Error loading branches:', error);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const filteredOpnames = filterDate 
    ? opnames.filter(o => new Date(o.created_at).toISOString().split('T')[0] === filterDate)
    : opnames;

  const filteredWastes = filterDate
    ? wastes.filter(w => new Date(w.created_at).toISOString().split('T')[0] === filterDate)
    : wastes;

  useEffect(() => {
    loadWastes();
    loadOpnames();
    loadInventory();
  }, [branchId]);

  const totalSelisihItems = filteredOpnames.reduce((sum, o) => sum + o.items.filter(i => i.difference !== 0).length, 0);
  const totalBiayaWaste = filteredWastes.reduce((sum, w) => sum + Number(w.cost_loss || w.estimated_cost || 0), 0);
  const totalOpnameItems = filteredOpnames.reduce((sum, o) => sum + o.items.length, 0);

  const handleAddWasteSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Get user_id from localStorage or fallback to 1
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    data.user_id = currentUser?.id || 1;
    
    if (data.item_id) {
        const selectedItem = inventory.find(i => i.id == data.item_id);
        if (selectedItem) {
            data.item_type = 'ingredient';
            data.item_name = selectedItem.name;
        }
    }

    try {
      const res = await window.apiClient.post('/waste-logs', data);
      if (res.status === 'success') {
        alert('Waste berhasil ditambahkan');
        setIsWasteModalOpen(false);
        loadWastes();
      }
    } catch (err) {
      alert('Gagal menambah data waste: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAddOpnameSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    
    const data = {
        branch_id: formData.get('branch_id'),
        user_id: currentUser?.id || 1,
        status: 'completed',
        notes: formData.get('notes') || '',
        items: []
    };

    inventory.forEach(item => {
        const actualQty = formData.get(`actual_qty_${item.id}`);
        if (actualQty !== null && actualQty !== '') {
            const systemQty = item.stocks?.length > 0 ? item.stocks[0].current_stock : 0;
            data.items.push({
                ingredient_id: item.id,
                system_qty: systemQty,
                actual_qty: parseFloat(actualQty),
                notes: ''
            });
        }
    });

    if (data.items.length === 0) {
        alert("Harap isi setidaknya satu stok fisik bahan baku.");
        return;
    }

    try {
      const res = await window.apiClient.post('/stock-opnames', data);
      if (res.status === 'success') {
        alert('Stok Opname berhasil dicatat');
        setIsOpnameModalOpen(false);
        loadOpnames();
      }
    } catch (err) {
      alert('Gagal mencatat stok opname: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleInvestigasiClick = (item, opname) => {
    setSelectedInvestigasiItem({ ...item, opname });
    setIsInvestigasiModalOpen(true);
  };

  const handleSelesaikanInvestigasi = () => {
    // Update local state so it immediately reflects in the UI
    setOpnames(prevOpnames => prevOpnames.map(opname => {
      if (opname.id === selectedInvestigasiItem.opname.id) {
        return {
          ...opname,
          items: opname.items.map(item => {
            if (item.ingredient_id === selectedInvestigasiItem.ingredient_id) {
              return { ...item, is_resolved: true };
            }
            return item;
          })
        };
      }
      return opname;
    }));

    setIsInvestigasiModalOpen(false);
    setSelectedInvestigasiItem(null);
  };

  const handleCetakLaporan = () => {
    window.print();
  };

  const handleExportWaste = () => {
    if (filteredWastes.length === 0) return;
    
    const headers = ['Tanggal', 'Cabang', 'Bahan Baku', 'Jumlah', 'Satuan', 'Alasan', 'Petugas', 'Biaya', 'Status'];
    const csvData = filteredWastes.map(w => [
      new Date(w.created_at).toLocaleDateString('id-ID'),
      w.branch?.name || '-',
      w.ingredient?.name || '-',
      w.quantity,
      w.unit,
      `"${(w.description || '').replace(/"/g, '""')}"`,
      w.user?.name || '-',
      w.estimated_cost,
      w.status || 'Disetujui'
    ]);
    
    const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Waste_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <span className="material-symbols-outlined text-[18px] text-primary">calendar_today</span>
            <input 
              type="date" 
              className="bg-transparent font-body-md text-on-surface focus:outline-none cursor-pointer"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
            {filterDate && (
                <button onClick={() => setFilterDate('')} className="material-symbols-outlined text-[16px] text-error hover:opacity-80">close</button>
            )}
          </div>
          <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-2 rounded-lg shadow-sm">
            <span className="material-symbols-outlined text-[18px] text-primary">storefront</span>
            <select
              className="bg-transparent font-body-md text-on-surface focus:outline-none cursor-pointer"
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
            >
              <option value="all">Semua Cabang</option>
              {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
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
            {filteredWastes.length > 0 && <span className="px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">{filteredWastes.length}</span>}
          </span>
        </button>
      </div>

      {/* Tab: Stok Opname */}
      {activeTab === 'opname' && (
        <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden">
          <div className="p-4 bg-surface-container-low/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Data Stok Opname</h2>
              <span className="font-label-sm text-label-sm text-on-surface-variant px-2 py-0.5 bg-surface-container rounded-full">{totalOpnameItems} total item</span>
            </div>
            <button
              onClick={() => setIsOpnameModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md font-semibold shadow-sm hover:opacity-90 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">inventory</span>
              Tambah
            </button>
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
                {filteredOpnames.length > 0 ? filteredOpnames.flatMap((opname, oIdx) =>
                  opname.items.map((item, iIdx) => (
                    <tr key={`${oIdx}-${iIdx}`} className="border-t border-surface-container hover:bg-surface-container/30 transition-colors">
                      <td className="py-3.5 px-4 min-w-[150px]">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${item.difference < 0 ? 'bg-error' : item.difference > 0 ? 'bg-secondary' : 'bg-tertiary'}`}></span>
                          <span className="font-medium text-on-surface">{item.ingredient?.name || `ID: ${item.ingredient_id}`}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block whitespace-nowrap px-2.5 py-1 rounded-md bg-surface-container-high/50 font-label-sm text-label-sm text-on-surface-variant font-medium">{opname.branch?.name || 'Cabang'}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-on-surface whitespace-nowrap">{Number(item.system_stock || 0)} {item.ingredient?.unit}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-on-surface whitespace-nowrap">{Number(item.actual_stock || 0)} {item.ingredient?.unit}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block whitespace-nowrap px-2 py-0.5 rounded-full font-bold font-label-sm text-label-sm ${
                          item.difference < 0 ? 'bg-error-container text-error' :
                          item.difference > 0 ? 'bg-secondary-fixed text-on-secondary-fixed-variant' :
                          'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                        }`}>
                          {item.difference > 0 ? '+' : ''}{item.difference}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block whitespace-nowrap px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold ${
                          item.difference !== 0 && !item.is_resolved ? 'bg-error-container text-error' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                        }`}>
                          {item.difference !== 0 && !item.is_resolved ? 'Perlu Cek' : 'OK (Selesai)'}
                        </span>
                      </td>
                      {totalSelisihItems > 0 && (
                        <td className="py-3.5 px-4 text-center">
                          {item.difference !== 0 && !item.is_resolved ? (
                            <button 
                              onClick={() => handleInvestigasiClick(item, opname)}
                              className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold transition-all">
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
            <button 
              onClick={handleCetakLaporan}
              className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors">
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
                {filteredWastes.length > 0 ? filteredWastes.map(waste => (
                  <tr key={waste.id} className="border-t border-surface-container hover:bg-surface-container/30 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-on-surface whitespace-nowrap">
                      {new Date(waste.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block whitespace-nowrap px-2.5 py-1 rounded-md bg-surface-container-high/50 font-label-sm text-label-sm text-on-surface font-medium">{waste.branch?.name || 'Cabang'}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-on-surface min-w-[150px]">{waste.ingredient?.name || '—'}</td>
                    <td className="py-3.5 px-4 font-bold text-error whitespace-nowrap">{waste.quantity} {waste.unit}</td>
                    <td className="py-3.5 px-4 text-on-surface-variant min-w-[150px]">
                      <p className="line-clamp-2 leading-relaxed">{waste.description}</p>
                    </td>
                    <td className="py-3.5 px-4 text-on-surface whitespace-nowrap">{waste.user?.name || '—'}</td>
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
          {filteredWastes.length > 0 && (
            <div className="p-4 bg-surface-container-low/30 flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Total: <strong className="text-on-surface">Rp {totalBiayaWaste.toLocaleString('id-ID')}</strong></span>
              <button 
                onClick={handleExportWaste}
                className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors flex items-center gap-1.5">
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
                  <select name="item_id" required className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container">
                    <option value="">Pilih Bahan Baku...</option>
                    {inventory.map(item => (
                      <option key={item.id} value={item.id}>{item.name} ({item.unit})</option>
                    ))}
                  </select>
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
                  <select name="branch_id" className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none" required defaultValue={branchId !== 'all' ? branchId : ''}>
                    <option value="" disabled>Pilih Cabang</option>
                    {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
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

      {/* Modal: Input Stok Opname */}
      {isOpnameModalOpen && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-space-md">
          <div className="w-full max-w-4xl rounded-2xl bg-surface-container-lowest shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-space-md bg-surface-container-low flex items-center justify-between sticky top-0 z-10 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">inventory</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">Catat Stok Opname</span>
              </div>
              <button onClick={() => setIsOpnameModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <form onSubmit={handleAddOpnameSubmit} className="flex flex-col overflow-y-auto">
              <div className="p-space-md flex flex-col gap-space-md">
                <div className="flex flex-col gap-1 w-1/3">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Cabang</label>
                  <select name="branch_id" className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none" required defaultValue={branchId !== 'all' ? branchId : ''}>
                    <option value="" disabled>Pilih Cabang</option>
                    {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1 w-2/3">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Catatan Tambahan (Opsional)</label>
                  <input type="text" name="notes" placeholder="Misal: Opname akhir bulan" className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none" />
                </div>
                
                <table className="w-full text-left border-collapse mt-2">
                    <thead>
                        <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                            <th className="py-2 px-3">Bahan Baku</th>
                            <th className="py-2 px-3 text-right">Stok Sistem</th>
                            <th className="py-2 px-3">Stok Fisik</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map(item => {
                            const sysQty = item.stocks?.length > 0 ? Number(item.stocks[0].current_stock) : 0;
                            return (
                                <tr key={item.id} className="border-t border-surface-container">
                                    <td className="py-2 px-3 text-on-surface font-medium">{item.name}</td>
                                    <td className="py-2 px-3 text-right text-on-surface-variant">{sysQty} {item.unit}</td>
                                    <td className="py-2 px-3">
                                        <div className="flex items-center gap-2 w-32">
                                            <input type="number" step="0.01" name={`actual_qty_${item.id}`} placeholder="0" className="w-full p-1.5 rounded bg-surface-container-low text-on-surface text-sm border focus:border-primary focus:outline-none" />
                                            <span className="text-on-surface-variant text-sm">{item.unit}</span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
              </div>
              <div className="p-space-md bg-surface-container-low flex justify-end gap-space-xs sticky bottom-0 border-t border-surface-container-high">
                <button type="button" onClick={() => setIsOpnameModalOpen(false)} className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high">Batal</button>
                <button type="submit" className="px-space-md py-2 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md font-semibold hover:opacity-90">Simpan Opname</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Investigasi */}
      {isInvestigasiModalOpen && selectedInvestigasiItem && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-space-md">
          <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest shadow-xl overflow-hidden flex flex-col">
            <div className="p-space-md bg-surface-container-low flex items-center justify-between border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-[22px]">warning</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">Investigasi Selisih</span>
              </div>
              <button onClick={() => setIsInvestigasiModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="p-space-md flex flex-col gap-4">
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Bahan Baku</p>
                <p className="font-body-lg text-on-surface font-semibold">{selectedInvestigasiItem.ingredient?.name}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-surface-container-lowest border border-surface-container">
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Sistem</p>
                  <p className="font-body-md text-on-surface font-medium">{Number(selectedInvestigasiItem.system_stock || 0)}</p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Fisik</p>
                  <p className="font-body-md text-on-surface font-bold">{Number(selectedInvestigasiItem.actual_stock || 0)}</p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Selisih</p>
                  <p className={`font-body-md font-bold ${selectedInvestigasiItem.difference < 0 ? 'text-error' : 'text-secondary'}`}>
                    {selectedInvestigasiItem.difference > 0 ? '+' : ''}{selectedInvestigasiItem.difference}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant">Catatan Investigasi / Tindakan</label>
                <textarea className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none" rows="3" placeholder="Contoh: Barang ditemukan di gudang belakang..."></textarea>
              </div>
            </div>
            <div className="p-space-md bg-surface-container-low flex justify-end gap-space-xs border-t border-surface-container-high">
              <button onClick={() => setIsInvestigasiModalOpen(false)} className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high">Tutup</button>
              <button onClick={handleSelesaikanInvestigasi} className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:opacity-90">Tandai Selesai</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
