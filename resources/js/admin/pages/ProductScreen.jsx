import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProductScreen() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    base_price: '',
    description: '',
    type: 'main',
    is_active: 1
  });

  const fetchProducts = async (showLoading = true) => {
    if (showLoading) setLoading(true);
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
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `/storage/${url}`;
  };

  const handleOpenModal = (product = null) => {
    setImageFile(null);
    if (product) {
      setEditingProduct(product);
      setImagePreview(getImageUrl(product.image_url));
      setFormData({
        name: product.name,
        category_id: product.category_id,
        base_price: product.base_price ? parseInt(product.base_price).toString() : '',
        description: product.description || '',
        type: product.type || 'main',
        is_active: product.is_active ? 1 : 0
      });
    } else {
      setEditingProduct(null);
      setImagePreview(null);
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
    setImagePreview(null);
    setImageFile(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setFormData({ ...formData, base_price: rawValue });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('category_id', formData.category_id);
      fd.append('base_price', formData.base_price);
      fd.append('description', formData.description);
      fd.append('type', formData.type);
      fd.append('is_active', parseInt(formData.is_active));
      if (imageFile) fd.append('image_url', imageFile);

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (editingProduct) {
        fd.append('_method', 'PUT');
        await axios.post(`/api/admin/products/${editingProduct.id}`, fd, config);
      } else {
        await axios.post('/api/admin/products', fd, config);
      }
      
      handleCloseModal();
      fetchProducts(false);
    } catch (err) {
      console.error("Error saving product", err);
      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat().join('\n');
        alert("Gagal menyimpan produk:\n" + errorMessages);
      } else if (err.response && err.response.data && err.response.data.message) {
        alert("Gagal menyimpan produk:\n" + err.response.data.message);
      } else {
        alert("Gagal menyimpan produk. Periksa kembali isian Anda.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await axios.delete(`/api/admin/products/${id}`);
        fetchProducts(false);
      } catch (err) {
        console.error("Error deleting product", err);
        alert("Gagal menghapus produk.");
      }
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || product.category_id.toString() === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-6 gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface font-bold">Daftar Produk & Menu</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">Kelola produk, harga, dan gambar menu yang tampil di kasir</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
            <input 
              type="text" 
              placeholder="Cari produk..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-surface-container focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
            />
          </div>
          
          {/* Category Filter */}
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 rounded-lg bg-white border border-surface-container focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
          >
            <option value="">Semua Kategori</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary hover:opacity-90 transition-colors font-label-md text-label-md font-semibold shadow-sm w-full sm:w-auto whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Tambah Produk
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[40px] animate-spin">progress_activity</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider border-b border-surface-container">
                  <th className="px-4 py-3.5 text-center w-24">Gambar</th>
                  <th className="px-4 py-3.5 text-left">Nama Produk</th>
                  <th className="px-4 py-3.5 text-left w-36">Kategori</th>
                  <th className="px-4 py-3.5 text-center w-24">Tipe</th>
                  <th className="px-4 py-3.5 text-left w-36">Harga</th>
                  <th className="px-4 py-3.5 text-center w-32">Status</th>
                  <th className="px-4 py-3.5 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-body-md text-on-surface">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-[40px] block mb-2 opacity-40">restaurant_menu</span>
                      {products.length === 0 ? 'Belum ada produk. Klik "Tambah Produk" untuk memulai.' : 'Produk tidak ditemukan.'}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(product => (
                    <tr key={product.id} className="border-b border-surface-container hover:bg-surface-container/30 transition-colors last:border-0">
                      <td className="px-4 py-3 text-center">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-container flex items-center justify-center shadow-sm mx-auto">
                          {product.image_url ? (
                            <img 
                              src={getImageUrl(product.image_url)} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/100x100?text=No+Image';
                              }}
                            />
                          ) : (
                            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">image</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-on-surface">{product.name}</p>
                        {product.description && <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5 line-clamp-1">{product.description}</p>}
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant">{product.category ? product.category.name : '—'}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-on-surface font-medium">
                          {{'main': 'Utama', 'addon': 'Topping', 'variant': 'Varian'}[product.type || 'main']}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-left font-bold text-on-surface whitespace-nowrap">Rp {parseFloat(product.base_price).toLocaleString('id-ID')}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold whitespace-nowrap ${product.is_active ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : 'bg-surface-container text-on-surface-variant'}`}>
                          {product.is_active ? 'Aktif' : 'Non-aktif'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleOpenModal(product)} className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors" title="Edit">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container transition-colors" title="Hapus">
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
                <label className="text-sm font-semibold text-slate-700">Nama Produk <span className="text-red-500">*</span></label>
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
                <label className="text-sm font-semibold text-slate-700">Kategori <span className="text-red-500">*</span></label>
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
                <label className="text-sm font-semibold text-slate-700">Harga Dasar (Rp) <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="base_price" 
                  value={formData.base_price === '' || formData.base_price === null ? '' : parseInt(formData.base_price).toLocaleString('id-ID')} 
                  onChange={handlePriceChange} 
                  required
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Tipe Produk <span className="text-red-500">*</span></label>
                  <select 
                    name="type" 
                    value={formData.type} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm mb-1"
                  >
                    <option value="main">Utama (Menu Standar)</option>
                    <option value="addon">Topping (Tambahan)</option>
                    <option value="variant">Varian (Ukuran/Rasa)</option>
                  </select>
                  <p className="text-[11px] text-gray-500 leading-tight">
                    Pisahkan mana menu yang dijual langsung & mana yang hanya jadi pelengkap.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Status <span className="text-red-500">*</span></label>
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

              {/* Input Gambar */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Gambar Produk (Opsional)</label>
                {imagePreview && (
                  <div className="w-full h-40 rounded-lg overflow-hidden bg-gray-100 mb-2 relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImagePreview(null); setImageFile(null); }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-900/50 text-white flex items-center justify-center hover:bg-slate-900/70 transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                )}
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <span className="material-symbols-outlined text-gray-400 text-[28px] mb-1">cloud_upload</span>
                  <span className="text-sm text-gray-500">{imagePreview ? 'Ganti gambar' : 'Klik untuk upload gambar'}</span>
                  <span className="text-xs text-gray-400 mt-0.5">JPG, PNG, WEBP maks. 2MB</span>
                  <input type="file" name="image_url" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
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
