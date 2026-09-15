import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function InventoryBOMScreen() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    base_price: '',
    description: '',
    type: 'main',
    is_active: 1
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/products');
      if (res.data.status === 'success') {
        setProducts(res.data.data);
      }
      
      // We can also fetch categories for the select dropdown, assuming we have an endpoint or we can extract from products
      // For now, let's just hardcode some categories or we should fetch them.
      // Let's assume categories can be fetched from POS endpoints for now.
      const catRes = await axios.get('/api/products');
      if (catRes.data.status === 'success') {
        setCategories(catRes.data.data);
      }
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category_id: product.category_id,
        base_price: product.base_price,
        description: product.description || '',
        type: product.type || 'main',
        is_active: product.is_active ? 1 : 0
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category_id: categories.length > 0 ? categories[0].id : '',
        base_price: '',
        description: '',
        type: 'main',
        is_active: 1
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        is_active: parseInt(formData.is_active)
      };

      if (editingProduct) {
        await axios.put(`/api/admin/products/${editingProduct.id}`, payload);
      } else {
        await axios.post('/api/admin/products', payload);
      }
      
      handleCloseModal();
      fetchProducts();
    } catch (err) {
      console.error("Error saving product", err);
      alert("Gagal menyimpan produk.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await axios.delete(`/api/admin/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error("Error deleting product", err);
        alert("Gagal menghapus produk.");
      }
    }
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pt-space-md mb-space-lg">
        <div className="flex flex-col">
          <h1 className="font-headline-kpi text-headline-kpi text-on-surface">Manajemen Menu & Produk</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Kelola daftar produk, harga, dan ketersediaan yang langsung terhubung ke kasir.</p>
        </div>
        
        <div className="flex items-center gap-space-sm">
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span className="font-label-md text-label-md">Tambah Produk</span>
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-surface-container-high overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-on-surface">Loading products...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-sm border-b border-surface-container-high">
                <th className="p-4 font-medium">Nama Produk</th>
                <th className="p-4 font-medium">Kategori</th>
                <th className="p-4 font-medium">Tipe</th>
                <th className="p-4 font-medium">Harga Dasar</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-on-surface-variant">Belum ada produk.</td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} className="border-b border-surface-container-high hover:bg-surface-container-lowest">
                    <td className="p-4 font-medium text-on-surface">
                      <div className="flex flex-col">
                        <span>{product.name}</span>
                        {product.description && <span className="text-xs text-on-surface-variant font-normal">{product.description}</span>}
                      </div>
                    </td>
                    <td className="p-4 text-on-surface">{product.category ? product.category.name : '-'}</td>
                    <td className="p-4 text-on-surface capitalize">{product.type || 'main'}</td>
                    <td className="p-4 font-bold text-on-surface">Rp {product.base_price.toLocaleString('id-ID')}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${product.is_active ? 'bg-tertiary/10 text-tertiary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                        {product.is_active ? 'Aktif' : 'Non-aktif'}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button onClick={() => handleOpenModal(product)} className="px-3 py-1 rounded bg-surface-container-high hover:bg-primary-container text-on-surface-variant hover:text-on-primary-container transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="px-3 py-1 rounded bg-error/10 hover:bg-error text-error hover:text-on-error transition-colors">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-surface-container-high flex items-center justify-between bg-surface-container-lowest">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h3>
              <button onClick={handleCloseModal} className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4 overflow-y-auto">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface font-medium">Nama Produk</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-surface-container-high focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md"
                  placeholder="Misal: Terang Bulan Red Velvet"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface font-medium">Kategori</label>
                <select 
                  name="category_id" 
                  value={formData.category_id} 
                  onChange={handleChange} 
                  required
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-surface-container-high focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md"
                >
                  <option value="">-- Pilih Kategori --</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface font-medium">Harga Dasar (Rp)</label>
                <input 
                  type="number" 
                  name="base_price" 
                  value={formData.base_price} 
                  onChange={handleChange} 
                  required
                  min="0"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-surface-container-high focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface font-medium">Tipe Produk</label>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-surface-container-high focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md"
                >
                  <option value="main">Main (Menu Utama)</option>
                  <option value="addon">Addon (Topping/Tambahan)</option>
                  <option value="variant">Variant</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface font-medium">Status Aktif</label>
                <select 
                  name="is_active" 
                  value={formData.is_active} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-surface-container-high focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md"
                >
                  <option value={1}>Aktif (Tampil di Kasir)</option>
                  <option value={0}>Non-aktif</option>
                </select>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface font-medium">Deskripsi (Opsional)</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-surface-container-high focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md"
                ></textarea>
              </div>
              
              <div className="mt-4 flex items-center justify-end gap-3 pt-4 border-t border-surface-container-high">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-lg font-label-md text-label-md bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
