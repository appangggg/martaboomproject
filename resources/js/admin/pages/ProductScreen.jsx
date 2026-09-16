import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProductScreen() {
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
    <div className="flex flex-col w-full pb-8">
      {/* Header Area */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Daftar Produk</h1>
          <p className="text-sm text-slate-500">Kelola menu dan produk yang dijual di kasir</p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white transition-colors text-sm font-semibold shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Tambah Produk
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium">Memuat data produk...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-4 font-medium">Nama Produk</th>
                  <th className="px-6 py-4 font-medium">Kategori</th>
                  <th className="px-6 py-4 font-medium">Tipe</th>
                  <th className="px-6 py-4 font-medium">Harga Dasar</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-600">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-gray-400">Belum ada produk.</td>
                  </tr>
                ) : (
                  products.map(product => (
                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800">{product.name}</span>
                          {product.description && <span className="text-xs text-gray-400 mt-0.5">{product.description}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">{product.category ? product.category.name : '-'}</td>
                      <td className="px-6 py-4 capitalize">{product.type || 'main'}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">Rp {product.base_price.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${product.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                          {product.is_active ? 'Aktif' : 'Non-aktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleOpenModal(product)} className="p-1.5 rounded-md text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors" title="Edit">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Hapus">
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
        )}
      </div>

      {/* Modal Form (Simplified UI) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-lg">
                {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Nama Produk</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  placeholder="Misal: Terang Bulan Red Velvet"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Kategori</label>
                <select 
                  name="category_id" 
                  value={formData.category_id} 
                  onChange={handleChange} 
                  required
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                >
                  <option value="">-- Pilih Kategori --</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Harga Dasar (Rp)</label>
                <input 
                  type="number" 
                  name="base_price" 
                  value={formData.base_price} 
                  onChange={handleChange} 
                  required
                  min="0"
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Tipe Produk</label>
                  <select 
                    name="type" 
                    value={formData.type} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  >
                    <option value="main">Utama</option>
                    <option value="addon">Topping (Addon)</option>
                    <option value="variant">Varian</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Status</label>
                  <select 
                    name="is_active" 
                    value={formData.is_active} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  >
                    <option value={1}>Aktif</option>
                    <option value={0}>Non-aktif</option>
                  </select>
                </div>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Deskripsi Singkat (Opsional)</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                ></textarea>
              </div>
              
              <div className="mt-6 flex items-center justify-end gap-3">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
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
