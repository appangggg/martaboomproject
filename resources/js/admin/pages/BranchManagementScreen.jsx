import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function BranchManagementScreen() {
  const [branches, setBranches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ id: null, code: '', name: '', address: '', phone: '', is_active: true });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('/api/admin/branches');
      setBranches(res.data);
    } catch (err) {
      console.error(err);
      alert('Gagal mengambil data cabang.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (branch = null) => {
    if (branch) {
      setFormData({
        id: branch.id,
        code: branch.code || '',
        name: branch.name || '',
        address: branch.address || '',
        phone: branch.phone || '',
        is_active: branch.is_active === 1 || branch.is_active === true
      });
      setIsEditing(true);
    } else {
      setFormData({ id: null, code: '', name: '', address: '', phone: '', is_active: true });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/admin/branches/${formData.id}`, formData);
      } else {
        await axios.post('/api/admin/branches', formData);
      }
      setIsModalOpen(false);
      fetchBranches();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan cabang.');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus cabang ini?')) {
      try {
        await axios.delete(`/api/admin/branches/${id}`);
        fetchBranches();
      } catch (err) {
        console.error(err);
        alert('Gagal menghapus cabang.');
      }
    }
  };

  return (
    <div className="flex flex-col w-full pb-space-xl p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md py-space-md mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-on-surface">Manajemen Cabang</h1>
          <p className="text-on-surface-variant">Kelola daftar cabang, kode outlet, dan status operasional.</p>
        </div>
        <div className="flex flex-wrap items-center gap-space-sm">
          <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-on-primary shadow-sm hover:bg-primary/90 transition-all font-medium">
            <span className="material-symbols-outlined text-[18px]">add_business</span>
            Tambah Cabang
          </button>
        </div>
      </div>

      {/* Branch Table */}
      <div className="bg-surface rounded-xl border border-surface-container-high overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant text-sm border-b border-surface-container-high">
              <th className="p-4 font-medium">Kode</th>
              <th className="p-4 font-medium">Nama Cabang</th>
              <th className="p-4 font-medium">Alamat</th>
              <th className="p-4 font-medium">Telepon</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isLoading ? (
              <tr><td colSpan="6" className="p-6 text-center text-on-surface-variant">Loading...</td></tr>
            ) : branches.length === 0 ? (
              <tr><td colSpan="6" className="p-6 text-center text-on-surface-variant">Belum ada data cabang.</td></tr>
            ) : (
              branches.map(branch => (
                <tr key={branch.id} className="border-b border-surface-container-high hover:bg-surface-container-lowest">
                  <td className="p-4 font-medium text-on-surface">{branch.code}</td>
                  <td className="p-4 font-bold text-on-surface">{branch.name}</td>
                  <td className="p-4 text-on-surface-variant max-w-[200px] truncate">{branch.address || '-'}</td>
                  <td className="p-4 text-on-surface-variant">{branch.phone || '-'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${branch.is_active ? 'bg-tertiary/10 text-tertiary' : 'bg-error/10 text-error'}`}>
                      {branch.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal(branch)} className="p-1.5 rounded hover:bg-surface-container text-primary transition-colors">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button onClick={() => handleDelete(branch.id)} className="p-1.5 rounded hover:bg-error/10 text-error transition-colors">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface shadow-xl flex flex-col overflow-hidden border border-surface-container-high">
            <div className="flex items-center justify-between p-4 border-b border-surface-container-high bg-surface-container-lowest">
              <h3 className="font-bold text-lg text-on-surface">{isEditing ? 'Edit Cabang' : 'Tambah Cabang Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-5 flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-on-surface-variant block mb-1">Kode Cabang</label>
                <input 
                  type="text" 
                  value={formData.code} 
                  onChange={(e) => setFormData({...formData, code: e.target.value})} 
                  placeholder="Contoh: TB01" 
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-sm outline-none border border-surface-container-high focus:border-primary" 
                  required 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-on-surface-variant block mb-1">Nama Cabang</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="Contoh: Cabang Tebet" 
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-sm outline-none border border-surface-container-high focus:border-primary" 
                  required 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-on-surface-variant block mb-1">Alamat</label>
                <textarea 
                  value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})} 
                  placeholder="Alamat lengkap..." 
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-sm outline-none border border-surface-container-high focus:border-primary min-h-[80px]" 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-on-surface-variant block mb-1">Nomor Telepon</label>
                <input 
                  type="text" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  placeholder="0812xxxx" 
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-sm outline-none border border-surface-container-high focus:border-primary" 
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={formData.is_active} 
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})} 
                  className="w-4 h-4 text-primary bg-surface-container-low border-surface-container-high rounded focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-sm text-on-surface-variant cursor-pointer">Cabang Aktif</label>
              </div>
              
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-container-high mt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg hover:bg-surface-container text-on-surface-variant text-sm font-medium transition-colors">
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-medium hover:bg-primary/90 transition-colors">
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
