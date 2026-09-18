import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function IngredientScreen() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    cost_per_unit: '',
    sku: '',
    supplier_name: '',
    min_stock_threshold: '',
    category: '',
    is_active: 1
  });

  const fetchIngredients = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await axios.get('/api/admin/ingredients');
      if (res.data.status === 'success') {
        setIngredients(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching ingredients", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleOpenAddModal = () => {
    setEditingIngredient(null);
    setFormData({
      name: '',
      unit: '',
      cost_per_unit: '',
      sku: '',
      supplier_name: '',
      min_stock_threshold: '',
      category: '',
      is_active: 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (ingredient) => {
    setEditingIngredient(ingredient);
    setFormData({
      name: ingredient.name || '',
      unit: ingredient.unit || '',
      cost_per_unit: ingredient.cost_per_unit || '',
      sku: ingredient.sku || '',
      supplier_name: ingredient.supplier_name || '',
      min_stock_threshold: ingredient.min_stock_threshold || '',
      category: ingredient.category || '',
      is_active: ingredient.is_active ? 1 : 0
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIngredient(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingIngredient) {
        await axios.put(`/api/admin/ingredients/${editingIngredient.id}`, formData);
      } else {
        await axios.post('/api/admin/ingredients', formData);
      }
      
      handleCloseModal();
      fetchIngredients(false);
    } catch (err) {
      console.error("Error saving ingredient", err);
      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat().join('\n');
        alert("Gagal menyimpan bahan baku:\n" + errorMessages);
      } else if (err.response && err.response.data && err.response.data.message) {
        alert("Gagal menyimpan bahan baku:\n" + err.response.data.message);
      } else {
        alert("Gagal menyimpan bahan baku. Periksa kembali isian Anda.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus bahan baku ini?")) {
      try {
        await axios.delete(`/api/admin/ingredients/${id}`);
        fetchIngredients(false);
      } catch (err) {
        console.error("Error deleting ingredient", err);
        alert("Gagal menghapus bahan baku.");
      }
    }
  };

  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (ingredient.sku && ingredient.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md py-space-md">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface font-bold">Bahan Baku</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">Kelola data bahan baku untuk keperluan stok opname dan resep.</p>
        </div>
        <div className="flex items-center gap-space-sm">
          <button 
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold shadow-sm hover:opacity-90 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tambah Bahan Baku
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container overflow-hidden">
        
        {/* Filters */}
        <div className="p-space-md border-b border-surface-container bg-surface-container-low/30">
          <div className="flex flex-col md:flex-row gap-space-md justify-between">
            {/* Search */}
            <div className="relative w-full md:max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
              <input 
                type="text" 
                placeholder="Cari berdasarkan nama atau SKU..." 
                className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-surface-container rounded-lg focus:outline-none focus:border-primary font-body-md text-on-surface"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-12 flex justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[40px] animate-spin">progress_activity</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                  <th className="py-3 px-4 w-[40px] text-center">No</th>
                  <th className="py-3 px-4">Nama Bahan</th>
                  <th className="py-3 px-4">Satuan</th>
                  <th className="py-3 px-4">Harga Modal</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredIngredients.length > 0 ? (
                  filteredIngredients.map((ingredient, index) => (
                    <tr key={ingredient.id} className="border-t border-surface-container hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3 px-4 text-center text-on-surface-variant font-body-table">{index + 1}</td>
                      <td className="py-3 px-4">
                        <p className="font-label-md text-label-md text-on-surface">{ingredient.name}</p>
                        {ingredient.sku && <p className="font-body-sm text-[11px] text-on-surface-variant">SKU: {ingredient.sku}</p>}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-body-md text-on-surface-variant">{ingredient.unit}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-body-md text-on-surface-variant">
                          Rp {Number(ingredient.cost_per_unit || 0).toLocaleString('id-ID')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-label-sm text-[11px] ${ingredient.is_active ? 'bg-tertiary/10 text-tertiary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                          {ingredient.is_active ? 'Aktif' : 'Non-aktif'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleOpenEditModal(ingredient)}
                            className="p-1.5 rounded-md hover:bg-secondary/10 text-on-surface-variant hover:text-secondary transition-colors"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button 
                            onClick={() => handleDelete(ingredient.id)}
                            className="p-1.5 rounded-md hover:bg-error/10 text-on-surface-variant hover:text-error transition-colors"
                            title="Hapus"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-on-surface-variant font-body-md">
                      Tidak ada bahan baku yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-surface-container">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                {editingIngredient ? 'Edit Bahan Baku' : 'Tambah Bahan Baku'}
              </h3>
              <button onClick={handleCloseModal} className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface">Nama Bahan Baku <span className="text-error">*</span></label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Misal: Tepung Terigu Segitiga Biru"
                  className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container rounded-lg focus:outline-none focus:border-primary font-body-md"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface">Satuan <span className="text-error">*</span></label>
                  <input 
                    type="text" 
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    placeholder="Misal: kg, liter, pcs"
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container rounded-lg focus:outline-none focus:border-primary font-body-md"
                    required
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface">Harga Modal per Satuan <span className="text-error">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-md">Rp</span>
                    <input 
                      type="number" 
                      name="cost_per_unit"
                      value={formData.cost_per_unit}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full pl-10 pr-3 py-2 bg-surface-container-lowest border border-surface-container rounded-lg focus:outline-none focus:border-primary font-body-md"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface">Kode SKU (Opsional)</label>
                <input 
                  type="text" 
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="Opsional, misal: BB-001"
                  className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container rounded-lg focus:outline-none focus:border-primary font-body-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface">Kategori (Opsional)</label>
                  <input 
                    type="text" 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Misal: Kering, Basah"
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container rounded-lg focus:outline-none focus:border-primary font-body-md"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface">Status</label>
                  <select
                    name="is_active"
                    value={formData.is_active}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-surface-container rounded-lg focus:outline-none focus:border-primary font-body-md"
                  >
                    <option value={1}>Aktif</option>
                    <option value={0}>Non-aktif</option>
                  </select>
                </div>
              </div>
            </form>
            
            <div className="p-4 border-t border-surface-container flex justify-end gap-3 bg-surface-container-lowest mt-auto">
              <button 
                type="button" 
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-lg font-label-md text-label-md font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                Batal
              </button>
              <button 
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg font-label-md text-label-md font-semibold bg-primary text-on-primary hover:opacity-90 shadow-sm transition-all"
              >
                Simpan Bahan Baku
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
