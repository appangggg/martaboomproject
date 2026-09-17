import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminSettingsScreen() {
  const [activeTab, setActiveTab] = useState('menu-harga');
  const [paperSize, setPaperSize] = useState('80mm');
  const [menuItems, setMenuItems] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinTarget, setPinTarget] = useState(null); // { real_id, name }
  const [newPin, setNewPin] = useState('');
  const [pinSaving, setPinSaving] = useState(false);
  const [pinError, setPinError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, employeesRes] = await Promise.all([
        axios.get('/api/admin/products'),
        axios.get('/api/admin/employees')
      ]);
      
      if (productsRes.data.status === 'success') {
        const formattedProducts = productsRes.data.data.map(p => ({
          id: 'TB-' + p.id.toString().padStart(3, '0'),
          real_id: p.id,
          name: p.name,
          category_id: p.category_id,
          category: p.category ? p.category.name : 'Uncategorized',
          desc: p.description || 'Tidak ada deskripsi',
          image: 'https://placehold.co/400x300?text=' + encodeURIComponent(p.name),
          margin: 'Margin ' + (p.type === 'addon' ? '70%' : '60%'),
          price: 'Rp ' + p.base_price.toLocaleString('id-ID'),
          base_price: p.base_price,
          hpp: 'Rp ' + (p.base_price * 0.4).toLocaleString('id-ID'),
          status: p.is_active ? 'Aktif' : 'Nonaktif',
          statusColor: p.is_active ? 'text-tertiary' : 'text-error bg-error-container px-2 py-0.5 rounded',
          badgeColor: p.type === 'addon' ? 'bg-secondary' : 'bg-tertiary',
          ingredients: 'Bahan Terkunci',
          is_active: p.is_active,
          type: p.type
        }));
        setMenuItems(formattedProducts);
      }
      
      if (employeesRes.data.status === 'success') {
        const staffData = Array.isArray(employeesRes.data.data) ? employeesRes.data.data : employeesRes.data.data.data;
        const formattedStaff = staffData.map(e => ({
          id: e.employee_id || ('STF-' + e.id.toString().padStart(3, '0')),
          real_id: e.id,
          name: e.name,
          init: e.name.substring(0, 2).toUpperCase(),
          branch_id: e.branch_id,
          branch: e.branch ? e.branch.name : 'Semua Cabang',
          role: e.role,
          discount: e.role === 'owner' ? '100%' : '10%',
          status: e.pin ? 'Aktif' : 'Tanpa PIN',
          pinColor: e.pin ? 'text-tertiary' : 'text-error',
          pinIcon: e.pin ? 'lock_reset' : 'error',
          isExpired: !e.pin
        }));
        setStaffList(formattedStaff);
      }
    } catch (err) {
      console.error("Error fetching admin settings data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteProduct = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await axios.delete(`/api/admin/products/${id}`);
        fetchData();
      } catch (error) {
        console.error('Failed to delete product', error);
        alert('Gagal menghapus produk');
      }
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus staf ini?')) {
      try {
        await axios.delete(`/api/admin/employees/${id}`);
        fetchData();
      } catch (error) {
        console.error('Failed to delete employee', error);
        alert('Gagal menghapus staf');
      }
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // basic mapping for boolean/numeric
    const isActive = formData.get('is_active');
    formData.set('is_active', isActive === 'on' || isActive === '1' || isActive === 'true' ? 1 : 0);
    
    try {
      if (selectedProduct) {
        formData.append('_method', 'PUT');
        await axios.post(`/api/admin/products/${selectedProduct.real_id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('/api/admin/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setIsProductModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save product', error);
      alert('Gagal menyimpan produk');
    }
  };

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
      fetchData();
    } catch (error) {
      console.error('Failed to save employee', error);
      alert('Gagal menyimpan staf');
    }
  };

  const openPinModal = (staff) => {
    setPinTarget(staff);
    setNewPin('');
    setPinError('');
    setIsPinModalOpen(true);
  };

  const handlePinSave = async () => {
    if (!/^\d{6}$/.test(newPin)) {
      setPinError('PIN harus tepat 6 angka.');
      return;
    }
    setPinSaving(true);
    try {
      const res = await axios.post(`/api/admin/employees/${pinTarget.real_id}/reset-pin`, { pin: newPin });
      if (res.data.status === 'success') {
        setIsPinModalOpen(false);
        fetchData(); // refresh staff list to update pin status badge
        alert(`PIN berhasil diset untuk ${pinTarget.name}.`);
      } else {
        setPinError(res.data.message || 'Gagal menyimpan PIN.');
      }
    } catch (err) {
      setPinError(err.response?.data?.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setPinSaving(false);
    }
  };

  const handleClearPin = async (staff) => {
    if (!confirm(`Hapus PIN untuk ${staff.name}? Mereka tidak bisa login sampai PIN baru dibuat.`)) return;
    try {
      await axios.delete(`/api/admin/employees/${staff.real_id}/clear-pin`);
      fetchData();
    } catch (_) {
      alert('Gagal menghapus PIN.');
    }
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-high p-space-md mb-space-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm relative z-10">
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[22px]">tune</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface">Konfigurasi Sentral Martaboom</span>
              <span className="font-body-md text-body-md text-on-surface-variant">Sinkronisasi instan resep BOM, hierarki harga cabang, dan otoritas POS kasir aktif di 4 gerai.</span>
            </div>
          </div>
          <div className="flex items-center gap-space-sm self-start md:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              POS Gateway: Online
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container transition-all flex items-center gap-1.5 shadow-sm">
              <span className="material-symbols-outlined text-[16px] text-tertiary">history</span>
              Log Audit Perubahan
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-space-xs mb-space-lg no-scrollbar border-b-0">
        <button onClick={() => setActiveTab('menu-harga')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-md text-label-md transition-all shrink-0 ${activeTab === 'menu-harga' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container shadow-sm'}`}>
          <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
          <span>Menu & Harga</span>
          <span className={`px-1.5 py-0.5 rounded-full ${activeTab === 'menu-harga' ? 'bg-surface-container-lowest/20' : 'bg-surface-container'} font-label-sm text-[10px]`}>{menuItems.length} SKU</span>
        </button>
        <button onClick={() => setActiveTab('pengguna-pin')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-md text-label-md transition-all shrink-0 ${activeTab === 'pengguna-pin' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container shadow-sm'}`}>
          <span className="material-symbols-outlined text-[18px]">badge</span>
          <span>Pengguna & PIN Kasir</span>
          <span className="px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[10px]">{staffList.length} Staf</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'menu-harga' && (
        <div className="flex flex-col gap-space-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
            <div className="flex flex-wrap items-center gap-space-sm">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">search</span>
                <input type="text" placeholder="Cari martabak atau SKU..." className="pl-9 pr-4 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-on-surface-variant/60 focus:outline-none focus:bg-surface-container focus:text-on-surface w-64" />
              </div>
              <div className="flex items-center gap-1 overflow-x-auto">
                <button className="px-3 py-1.5 rounded-lg bg-primary-fixed text-on-primary-fixed font-label-md text-label-md transition-colors whitespace-nowrap">Semua Kategori</button>
                <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors whitespace-nowrap">Terang Bulan Klasik</button>
                <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors whitespace-nowrap">Terang Bulan Premium</button>
                <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors whitespace-nowrap">Martabak Telur Asin</button>
                <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors whitespace-nowrap">Minuman</button>
              </div>
            </div>
            <div className="flex items-center gap-space-sm self-end lg:self-auto shrink-0">
              <button className="px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1.5 transition-colors">
                <span className="material-symbols-outlined text-[16px]">file_download</span> Export Excel
              </button>
              <button onClick={() => { setSelectedProduct(null); setIsProductModalOpen(true); }} className="px-4 py-2 rounded-lg bg-primary hover:bg-surface-tint text-on-primary font-label-md text-label-md flex items-center gap-1.5 shadow-sm transition-all">
                <span className="material-symbols-outlined text-[18px]">add_circle</span> + Tambah Menu Baru
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-lg">
            {menuItems.map(item => (
              <div key={item.id} className="flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                <div className="relative h-44 w-full overflow-hidden bg-surface-container">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface font-label-sm text-label-sm flex items-center gap-1 shadow-sm">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.badgeColor || 'bg-tertiary'}`}></span>
                    {item.id}
                  </div>
                  <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-md ${item.marginColor || 'bg-tertiary-fixed text-on-tertiary-fixed-variant'} font-label-sm text-[10px] uppercase font-bold tracking-wider`}>
                    {item.margin}
                  </div>
                </div>
                <div className="p-space-md flex flex-col flex-1 justify-between gap-space-md">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{item.category}</span>
                      <span className={`font-label-sm text-label-sm ${item.statusColor || 'text-tertiary'} font-semibold flex items-center gap-0.5`}>
                        <span className="material-symbols-outlined text-[14px]">{item.statusIcon || 'check_circle'}</span> {item.status}
                      </span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">{item.name}</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">{item.desc}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-surface-container-low">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Harga Jual POS</span>
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold">{item.price}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">HPP Resep (BOM)</span>
                      <span className="font-headline-sm text-headline-sm text-primary font-bold">{item.hpp}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t-0">
                    <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[16px] text-tertiary">inventory</span>
                      <span>{item.ingredients}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setSelectedProduct(item); setIsProductModalOpen(true); }} className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button onClick={() => handleDeleteProduct(item.real_id)} className="p-1.5 rounded-lg text-error hover:bg-error-container hover:text-on-error-container transition-colors">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}



      {activeTab === 'pengguna-pin' && (
        <div className="flex flex-col gap-space-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
            <div className="flex items-center gap-space-sm">
              <div className="flex items-center gap-1 bg-surface-container p-1 rounded-lg">
                <button className="px-3 py-1.5 rounded bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-sm font-semibold">Semua Staf (14)</button>
                <button className="px-3 py-1.5 rounded text-on-surface-variant hover:text-on-surface font-label-md text-label-md">Kasir (6)</button>
                <button className="px-3 py-1.5 rounded text-on-surface-variant hover:text-on-surface font-label-md text-label-md">Koki (5)</button>
                <button className="px-3 py-1.5 rounded text-on-surface-variant hover:text-on-surface font-label-md text-label-md">Supervisor (3)</button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setSelectedEmployee(null); setIsEmployeeModalOpen(true); }} className="px-4 py-2 rounded-lg bg-primary hover:bg-surface-tint text-on-primary font-label-md text-label-md flex items-center gap-1.5 shadow-sm transition-all">
                <span className="material-symbols-outlined text-[18px]">person_add</span> + Tambah Akun Staf
              </button>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse tabular-nums">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                    <th className="py-3.5 px-space-md">Nama & Kredensial Staf</th>
                    <th className="py-3.5 px-space-md">Penugasan Cabang</th>
                    <th className="py-3.5 px-space-md">Role Otoritas</th>
                    <th className="py-3.5 px-space-md text-center">Batas Diskon Kasir</th>
                    <th className="py-3.5 px-space-md text-center">Status PIN 6-Digit</th>
                    <th className="py-3.5 px-space-md text-right">Tindakan Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y-0 text-on-surface font-body-md text-body-md">
                  {staffList.map((staff, idx) => (
                    <tr key={idx} className="hover:bg-surface-container/40 transition-colors border-t border-surface-container">
                      <td className="py-3.5 px-space-md">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full ${staff.isExpired ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'} flex items-center justify-center font-bold text-[13px]`}>
                            {staff.init}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-headline-sm text-headline-sm text-on-surface">{staff.name}</span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">ID: {staff.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-space-md">
                        <span className="px-2.5 py-1 rounded bg-surface-container font-label-sm text-label-sm text-on-surface">{staff.branch}</span>
                      </td>
                      <td className="py-3.5 px-space-md">
                        <span className="px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">{staff.role}</span>
                      </td>
                      <td className="py-3.5 px-space-md text-center">
                        <span className={`font-headline-sm text-headline-sm ${staff.isExpired ? 'text-on-surface' : 'text-primary'} font-bold`}>{staff.discount}</span>
                      </td>
                      <td className="py-3.5 px-space-md text-center">
                        <div className={`inline-flex items-center gap-1.5 ${staff.pinColor} font-label-sm text-label-sm`}>
                          <span className="material-symbols-outlined text-[16px]">{staff.pinIcon}</span> {staff.status}
                        </div>
                      </td>
                      <td className="py-3.5 px-space-md text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openPinModal(staff)} className={`px-2 py-1.5 rounded-lg ${staff.isExpired ? 'bg-error-container text-on-error-container' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'} font-label-md text-label-md inline-flex items-center gap-1 transition-colors`} title="Set PIN Baru">
                            <span className={`material-symbols-outlined text-[16px] ${staff.isExpired ? '' : 'text-primary'}`}>{staff.isExpired ? 'sync_lock' : 'key'}</span>
                            <span className="text-xs">{staff.isExpired ? 'Set PIN' : 'Ubah PIN'}</span>
                          </button>
                          <button onClick={() => { setSelectedEmployee(staff); setIsEmployeeModalOpen(true); }} className="px-2 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md inline-flex items-center gap-1 transition-colors" title="Edit Staf">
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          <button onClick={() => handleDeleteEmployee(staff.real_id)} className="px-2 py-1.5 rounded-lg text-error hover:bg-error-container hover:text-on-error-container font-label-md text-label-md inline-flex items-center gap-1 transition-colors" title="Hapus Staf">
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    {/* Modals */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-space-md">
          <div className="w-full max-w-lg rounded-2xl bg-surface-container-lowest shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-space-md bg-surface-container-low flex items-center justify-between sticky top-0 z-10 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">{selectedProduct ? 'edit' : 'add_circle'}</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">{selectedProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</span>
              </div>
              <button onClick={() => setIsProductModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <form onSubmit={handleProductSubmit} className="flex flex-col overflow-y-auto">
              <div className="p-space-md flex flex-col gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Nama Produk</label>
                  <input type="text" name="name" defaultValue={selectedProduct?.name} required className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Kategori</label>
                  <select name="category_id" defaultValue={selectedProduct?.category_id || 1} className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none">
                    <option value="1">Terang Bulan</option>
                    <option value="2">Martabak Telur</option>
                    <option value="3">Minuman</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Tipe (Base/Addon)</label>
                  <select name="type" defaultValue={selectedProduct?.type || 'base'} className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none">
                    <option value="base">Base (Menu Utama)</option>
                    <option value="addon">Addon / Topping</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Harga Jual (Rp)</label>
                  <input type="number" name="base_price" defaultValue={selectedProduct?.base_price} required className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Deskripsi (Opsional)</label>
                  <textarea name="description" defaultValue={selectedProduct?.desc !== 'Tidak ada deskripsi' ? selectedProduct?.desc : ''} className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none" rows="3"></textarea>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Gambar Produk (Opsional)</label>
                  <input type="file" name="image_url" accept="image/*" className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none" />
                  {selectedProduct && selectedProduct.image_url && (
                    <div className="mt-2 text-sm text-on-surface-variant">
                      Gambar saat ini sudah ada. Upload gambar baru untuk mengganti.
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" name="is_active" id="is_active" defaultChecked={selectedProduct ? selectedProduct.is_active : true} value="1" className="w-4 h-4 rounded text-primary focus:ring-primary" />
                  <label htmlFor="is_active" className="font-label-md text-label-md text-on-surface">Produk Aktif / Tersedia</label>
                </div>
              </div>
              <div className="p-space-md bg-surface-container-low flex justify-end gap-space-xs sticky bottom-0 border-t border-surface-container-high">
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high">Batal</button>
                <button type="submit" className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-on-primary-fixed-variant">Simpan Produk</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-space-md">
          <div className="w-full max-w-lg rounded-2xl bg-surface-container-lowest shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-space-md bg-surface-container-low flex items-center justify-between sticky top-0 z-10 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">{selectedEmployee ? 'edit' : 'person_add'}</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">{selectedEmployee ? 'Edit Akun Staf' : 'Tambah Akun Staf'}</span>
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
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Role Akses</label>
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
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">PIN Kasir (6 Angka)</label>
                  <input type="text" name="pin" maxLength="6" pattern="\d{6}" placeholder="Contoh: 123456" className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none" />
                  {selectedEmployee && <span className="text-[10px] text-on-surface-variant mt-1">Kosongkan jika tidak ingin mengubah PIN saat ini.</span>}
                </div>
              </div>
              <div className="p-space-md bg-surface-container-low flex justify-end gap-space-xs sticky bottom-0 border-t border-surface-container-high">
                <button type="button" onClick={() => setIsEmployeeModalOpen(false)} className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high">Batal</button>
                <button type="submit" className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-on-primary-fixed-variant">Simpan Akun</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PIN Set Modal */}
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
                Atur PIN baru untuk <strong className="text-on-surface">{pinTarget.name}</strong>. PIN digunakan untuk login kasir dan absensi.
              </p>
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant">PIN Baru (6 Angka)</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  pattern="\d{6}"
                  placeholder="Contoh: 123456"
                  value={newPin}
                  onChange={e => { setNewPin(e.target.value.replace(/\D/g, '').substring(0, 6)); setPinError(''); }}
                  className="w-full p-3 rounded-xl bg-surface-container-low text-on-surface font-mono text-xl text-center tracking-[0.5em] focus:outline-none focus:bg-surface-container letter-spacing-widest"
                  autoFocus
                />
                {/* PIN strength dots */}
                <div className="flex gap-2 justify-center mt-1">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full transition-all ${i < newPin.length ? 'bg-primary scale-110' : 'bg-surface-variant'}`}></div>
                  ))}
                </div>
                {pinError && (
                  <p className="font-label-sm text-label-sm text-error mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {pinError}
                  </p>
                )}
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
