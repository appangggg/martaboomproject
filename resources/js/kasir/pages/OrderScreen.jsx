import React, { useState, useEffect } from 'react';
import PosHeader from '../components/layout/PosHeader';
import CategoryPill from '../components/order/CategoryPill';
import ProductCard from '../components/order/ProductCard';
import CartSidebar from '../components/order/CartSidebar';
import apiClient from '../utils/apiClient';

export default function OrderScreen() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        setIsLoading(true);
        // Fetch categories with nested products
        const catResponse = await apiClient.get('/products');
        if (catResponse.status === 'success') {
          const apiCategories = catResponse.data;
          
          let totalProducts = 0;
          let flatProducts = [];
          
          // Map categories for CategoryPill
          const mappedCategories = apiCategories.map((c, index) => {
            const count = c.products ? c.products.length : 0;
            totalProducts += count;
            
            // assign random icons/colors for demo
            const icons = ['cake', 'cookie', 'egg_alt', 'local_cafe', 'restaurant_menu'];
            const colors = ['text-secondary', 'text-primary', 'text-on-primary-fixed-variant', 'text-tertiary', ''];
            
            if (c.products) {
              c.products.forEach(p => {
                flatProducts.push({
                  id: p.id,
                  categoryId: c.id,
                  name: p.name,
                  description: p.description,
                  price: parseFloat(p.base_price),
                  image: p.image_url || 'https://via.placeholder.com/150',
                  badge: p.is_featured ? { text: 'Pilihan', icon: 'star', bgClass: 'bg-secondary-container text-on-secondary-container' } : null,
                  label: p.kitchen_station
                });
              });
            }

            return {
              id: c.id,
              name: c.name,
              count: count,
              icon: icons[index % icons.length],
              colorClass: colors[index % colors.length]
            };
          });

          // Add 'all' category at the beginning
          mappedCategories.unshift({
            id: 'all',
            name: 'Semua',
            count: totalProducts,
            icon: 'restaurant_menu',
            colorClass: ''
          });

          setCategories(mappedCategories);
          setProducts(flatProducts);
        }
      } catch (error) {
        console.error("Failed to load POS data", error);
        alert("Gagal memuat data produk dari server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMasterData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.categoryId === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        quantity: 1,
        modifiers: 'Standar',
        colorClass: 'text-on-surface-variant',
        bgClass: 'bg-on-surface-variant'
      }];
    });
  };

  const increaseQty = (id) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const decreaseQty = (id) => {
    setCart(prev => {
      const item = prev.find(i => i.id === id);
      if (item.quantity === 1) {
        return prev.filter(i => i.id !== id);
      }
      return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };

  const clearCart = () => {
    if (confirm('Kosongkan keranjang?')) {
      setCart([]);
    }
  };

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen select-none">
      <PosHeader />
      
      <main className="w-full pt-20 bg-background">
        <div className="flex flex-col w-full">
          <div className="grid grid-cols-12 gap-space-lg p-space-lg w-full max-w-[1720px] mx-auto items-start">
            
            {/* SISI KIRI (70% WIDTH) */}
            <div className="col-span-12 xl:col-span-8 flex flex-col gap-space-md min-w-0">
              
              {/* TOP CONTROL: SEARCH BAR */}
              <div className="flex items-center gap-space-sm bg-surface-container-lowest p-space-sm rounded-2xl shadow-[0_4px_16px_-2px_rgba(70,42,25,0.06)]">
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[26px]">search</span>
                </div>
                <input 
                  className="w-full bg-transparent font-title-md text-title-md text-on-surface placeholder:text-outline focus:outline-none px-space-xs" 
                  placeholder="Cari menu martabak & minuman segar..." 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    className="w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface transition-colors shrink-0" 
                    type="button"
                    onClick={() => setSearchQuery('')}
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                )}
                <div className="h-8 w-[1.5px] bg-surface-container-highest shrink-0 mx-1"></div>
                <button className="px-space-md py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-1.5 shrink-0 transition-transform active:scale-95" type="button">
                  <span className="material-symbols-outlined text-[18px] text-primary">barcode_scanner</span>
                  <span>Scan Barcode</span>
                </button>
              </div>

              {/* KATEGORI CHIPS */}
              <div className="flex items-center gap-space-xs overflow-x-auto pb-1 select-none no-scrollbar">
                {categories.map(category => (
                  <CategoryPill
                    key={category.id}
                    name={category.name}
                    count={category.count}
                    icon={category.icon}
                    colorClass={category.colorClass}
                    isActive={activeCategory === category.id}
                    onClick={() => setActiveCategory(category.id)}
                  />
                ))}
              </div>

              {/* GRID MENU CARDS RESPONSIVE */}
              {isLoading ? (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-on-surface-variant gap-4">
                   <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                   <p className="font-title-md">Memuat Menu dari Database...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-space-md">
                  {filteredProducts.map(product => (
                    <ProductCard 
                      key={product.id}
                      product={product}
                      onAdd={addToCart}
                    />
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="col-span-full py-12 text-center text-on-surface-variant">
                      Pencarian tidak ditemukan
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* SISI KANAN (30% WIDTH) - PANEL KERANJANG BELANJA AKTIF */}
            <div className="col-span-12 xl:col-span-4 flex flex-col bg-surface-container-lowest rounded-3xl p-space-lg shadow-[0_10px_24px_-4px_rgba(70,42,25,0.10)] sticky top-24 h-[calc(100vh-120px)]">
              <CartSidebar 
                cartItems={cart}
                onIncrease={increaseQty}
                onDecrease={decreaseQty}
                onClearCart={clearCart}
              />
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
