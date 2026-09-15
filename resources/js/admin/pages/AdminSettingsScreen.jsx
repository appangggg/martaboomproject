import React, { useState } from 'react';

export default function AdminSettingsScreen() {
  const [activeTab, setActiveTab] = useState('menu-harga');
  const [paperSize, setPaperSize] = useState('80mm');

  const menuItems = [
    {
      id: 'TB-001',
      name: 'Martabak Black Forest Cream Cheese',
      category: 'Terang Bulan Premium',
      desc: 'Adonan cokelat pekat khas Belanda dengan lelehan cream cheese Anchor dan taburan parutan dark chocolate Callebaut.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5R83vwadjEz_z2tRE3-mRgWDJiJVM8kZgbbwSF0DtCE8TCkao0xVx6WLnPt8i7-FnTiIgSVZdP6o_AZ3nqKQv3qIpvnSkwt3VxHiR7arKK6MSE3PwHScoS2pvH6zU5OpCKD7xjzqvCni-vr3afZtetypr2lsbBQ-OVmlTqqOjvahX4QXNhVsgknHmLIvOLh0Wtav8R5c2CPxUWdbQanSIKWamYHiv8NBx65V2ssfai3LWxgoAaSs22A',
      margin: 'Margin 64.2%',
      price: 'Rp 68.000',
      hpp: 'Rp 24.340',
      status: 'Aktif di Semua Cabang',
      ingredients: '12 Bahan Terkunci'
    },
    {
      id: 'MT-004',
      name: 'Martabak Telur Bebek Spesial Daging Sapi',
      category: 'Martabak Telur Asin',
      desc: 'Kulit martabak renyah ganda berisi 3 butir telur bebek segar, cincangan daging sapi lada hitam, dan kuah cuka cuko rempah.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOX9POMOyErR2w3gwQ6uiTI1kVXt4Dug8SQ3HI_puqcY-dZoTkDi_-Q7-0Ey_59prEmCHiRmzmo8FT-rO9nRO7AvBOVpYzWexUzEoovkMLv7Pe4kycrc5Taa8UtglKMrHSVbQOAvJgn0mGBwV--bfEAUSziMpotffEi6pL14xuIJ5g57or1-xRKZynn4lurxkyZgwCxmDw6cLpRtN7BP_ar77UkHC1kFNjm81pw-YLfOLxNWy5QP0EPA',
      margin: 'Margin 58.0%',
      marginColor: 'bg-secondary-fixed text-on-secondary-fixed-variant',
      badgeColor: 'bg-secondary',
      price: 'Rp 62.000',
      hpp: 'Rp 26.040',
      status: 'Aktif di Semua Cabang',
      ingredients: '8 Bahan Terkunci'
    },
    {
      id: 'TB-009',
      name: 'Terang Bulan Pandan Jagung Keju',
      category: 'Terang Bulan Klasik',
      desc: 'Adonan pandan wangi Suji asli berpadu pipilan jagung manis kukus, susu kental manis, dan keju cheddar tebal.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE-dUDuhpRDnhmDwn0j3_KkC_GFNXMi1JVABcuasDrn9Mpq-kd_pM5ADt6j5VvyBIsrEKJev5OzqAzscWCL-WYwasj_vbtnF5Cdy34mJfe0Cyz7YN0e46hY_2VC1L5ct_0A_AqsePcBYJCFH1KtE4DEeVXjFtldv9oz1fDDUVtQk2J-qMKdg1PTtsJQS04ZXxj16sjM0UAj2P0nfxoYtFpXMk8BbsqgNp349UyW3JBwyxc0KGO3yQ5nw',
      margin: 'Margin 67.5%',
      badgeColor: 'bg-error',
      price: 'Rp 48.000',
      hpp: 'Rp 15.600',
      status: 'Nonaktif di Cabang Dago',
      statusColor: 'text-error bg-error-container px-2 py-0.5 rounded',
      statusIcon: 'block',
      ingredients: '10 Bahan Terkunci'
    }
  ];

  const staffList = [
    { id: 'STF-DPU-001', name: 'Budi Utomo', init: 'BU', branch: 'Cabang Dipatiukur', role: 'Kasir Utama', discount: '10%', status: 'Aktif (Terakhir 3 hari lalu)', pinColor: 'text-tertiary', pinIcon: 'lock_reset' },
    { id: 'STF-DGO-004', name: 'Siti Aminah', init: 'SA', branch: 'Cabang Dago', role: 'Supervisor (SPV)', discount: '25% (Otoritas VOID)', status: 'Aktif (Terakhir kemarin)', pinColor: 'text-tertiary', pinIcon: 'lock_reset' },
    { id: 'STF-BUA-002', name: 'Agus Riyadi', init: 'AR', branch: 'Cabang Buah Batu', role: 'Koki Martabak', discount: '0% (Tidak Ada Otoritas)', status: 'KDS Only (Display)', pinColor: 'text-on-surface-variant', pinIcon: 'lock_clock' },
    { id: 'STF-CBR-005', name: 'Deni Nugraha', init: 'DN', branch: 'Cabang Cibiru', role: 'Kasir Magang', discount: '5%', status: 'PIN Kadaluarsa', pinColor: 'text-error', pinIcon: 'error', isExpired: true },
  ];

  const resetPin = (name) => {
    alert(`Reset PIN untuk ${name} berhasil. Cek email / WA untuk PIN baru.`);
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
          <span className={`px-1.5 py-0.5 rounded-full ${activeTab === 'menu-harga' ? 'bg-surface-container-lowest/20' : 'bg-surface-container'} font-label-sm text-[10px]`}>24 SKU</span>
        </button>
        <button onClick={() => setActiveTab('modifier-topping')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-md text-label-md transition-all shrink-0 ${activeTab === 'modifier-topping' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container shadow-sm'}`}>
          <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
          <span>Modifier & Topping</span>
          <span className={`px-1.5 py-0.5 rounded-full ${activeTab === 'modifier-topping' ? 'bg-surface-container-lowest/20' : 'bg-surface-container'} font-label-sm text-[10px]`}>18 Item</span>
        </button>
        <button onClick={() => setActiveTab('printer-struk')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-md text-label-md transition-all shrink-0 ${activeTab === 'printer-struk' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container shadow-sm'}`}>
          <span className="material-symbols-outlined text-[18px]">print</span>
          <span>Printer & Struk</span>
        </button>
        <button onClick={() => setActiveTab('pengguna-pin')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-md text-label-md transition-all shrink-0 ${activeTab === 'pengguna-pin' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container shadow-sm'}`}>
          <span className="material-symbols-outlined text-[18px]">badge</span>
          <span>Pengguna & PIN Kasir</span>
          <span className="px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[10px]">14 Staf</span>
        </button>
        <button onClick={() => setActiveTab('integrasi-kasir')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-md text-label-md transition-all shrink-0 ${activeTab === 'integrasi-kasir' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container shadow-sm'}`}>
          <span className="material-symbols-outlined text-[18px]">hub</span>
          <span>Integrasi Kasir</span>
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
              <button className="px-4 py-2 rounded-lg bg-primary hover:bg-surface-tint text-on-primary font-label-md text-label-md flex items-center gap-1.5 shadow-sm transition-all">
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
                      <button className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button className="p-1.5 rounded-lg text-error hover:bg-error-container hover:text-on-error-container transition-colors">
                        <span className="material-symbols-outlined text-[18px]">toggle_on</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'modifier-topping' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          <div className="lg:col-span-7 flex flex-col gap-space-lg">
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">layers</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Pilihan Base Adonan Martabak</h3>
                </div>
                <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">add</span> Base Baru
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-tertiary/20 flex items-center justify-center text-tertiary">
                      <span className="material-symbols-outlined text-[18px]">eco</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">Base Original Pandan Wangi</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Default standar adonan terang bulan</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-label-md text-label-md text-on-surface-variant font-medium">+Rp 0 (Standar)</span>
                    <span className="material-symbols-outlined text-[20px] text-tertiary">check_circle</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-error/20 flex items-center justify-center text-error">
                      <span className="material-symbols-outlined text-[18px]">palette</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">Base Red Velvet Creamy</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Adonan bit merah organik & kakao premium</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-label-md text-label-md text-primary font-bold">+Rp 5.000</span>
                    <span className="material-symbols-outlined text-[20px] text-tertiary">toggle_on</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-on-surface/10 flex items-center justify-center text-on-surface">
                      <span className="material-symbols-outlined text-[18px]">cookie</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">Base Black Forest Kakao Belanda</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Bubuk dark chocolate Van Houten 100%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-label-md text-label-md text-primary font-bold">+Rp 6.000</span>
                    <span className="material-symbols-outlined text-[20px] text-tertiary">toggle_on</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">icecream</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Pilihan Topping & Tambahan Add-ons</h3>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Auto-deduct stok pada POS</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">Keju Kraft Parut</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Porsi 75 gr (+BOM Rp 3.800)</span>
                  </div>
                  <span className="font-label-md text-label-md text-primary font-bold">+Rp 8.000</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">Cokelat Meises Ceres</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Porsi 60 gr (+BOM Rp 2.200)</span>
                  </div>
                  <span className="font-label-md text-label-md text-primary font-bold">+Rp 6.000</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">Cream Cheese Anchor</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Porsi 50 gr (+BOM Rp 5.500)</span>
                  </div>
                  <span className="font-label-md text-label-md text-primary font-bold">+Rp 12.000</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">KitKat Green Tea Remah</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">2 Bar kitkat crush (+BOM Rp 6.800)</span>
                  </div>
                  <span className="font-label-md text-label-md text-primary font-bold">+Rp 14.000</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">sticky_note_2</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Catatan Cepat Kasir (One-Tap Instructions)</h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">Preset tombol instan layar kasir POS agar staf tidak perlu mengetik instruksi pesanan kustom manual.</p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">check</span> "Adonan Tipis Kering"
                  <button className="text-on-surface-variant hover:text-error ml-1"><span className="material-symbols-outlined text-[14px]">close</span></button>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">check</span> "Gula Sedikit (Less Sugar)"
                  <button className="text-on-surface-variant hover:text-error ml-1"><span className="material-symbols-outlined text-[14px]">close</span></button>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">check</span> "Potong 12 Kotak"
                  <button className="text-on-surface-variant hover:text-error ml-1"><span className="material-symbols-outlined text-[14px]">close</span></button>
                </span>
                <button className="px-3 py-1.5 rounded-lg bg-primary-fixed text-on-primary-fixed font-label-md text-label-md hover:bg-secondary-fixed transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">add</span> Tambah Preset
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-space-md">
            <div className="sticky top-20 bg-surface-container p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between border-b-0 pb-1">
                <span className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-primary">touch_app</span>
                  Simulasi Tampilan Layar Kasir POS
                </span>
                <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-semibold">Live Preview</span>
              </div>
              
              <div className="bg-surface-container-lowest p-4 rounded-lg shadow-sm flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-headline-sm text-headline-sm text-on-surface">Terang Bulan Spesial Mix</h5>
                    <span className="font-body-md text-body-md text-on-surface-variant">Pilih varian modifikasi adonan & topping</span>
                  </div>
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">Rp 45.000</span>
                </div>
                
                <div className="flex flex-col gap-2 pt-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Base Dipilih:</label>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="p-2 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm cursor-pointer hover:opacity-90">Pandan (+0)</div>
                    <div className="p-2 rounded bg-primary text-on-primary font-label-sm text-label-sm font-semibold cursor-pointer shadow-sm">Red Velvet (+5k)</div>
                    <div className="p-2 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm cursor-pointer hover:opacity-90">Black Forest (+6k)</div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Topping Tambahan Aktif:</label>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-1 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm flex items-center gap-1">
                      + Cream Cheese Anchor (+12k) <span className="material-symbols-outlined text-[12px]">check</span>
                    </span>
                    <span className="px-2 py-1 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm flex items-center gap-1">
                      + Keju Kraft (+8k) <span className="material-symbols-outlined text-[12px]">check</span>
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Instruksi Koki:</label>
                  <div className="p-2.5 rounded bg-surface-container-low font-body-md text-body-md text-on-surface italic">
                    "Adonan Tipis Kering, Gula Sedikit (Less Sugar)"
                  </div>
                </div>
                
                <div className="pt-3 border-t-0 flex items-center justify-between border-surface-variant">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Subtotal Tagihan POS</span>
                    <span className="font-headline-kpi text-headline-kpi text-on-surface leading-tight font-bold">Rp 70.000</span>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-tertiary text-on-tertiary font-label-md text-label-md flex items-center gap-1.5 shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span> Masuk Keranjang
                  </button>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-surface-container-high/60 flex items-start gap-2 text-on-surface-variant font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-primary text-[18px] shrink-0">info</span>
                <span>Perubahan modifikasi harga akan langsung terdorong ke 4 mesin POS cabang setelah tombol Simpan Perubahan ditekan.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'printer-struk' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          <div className="lg:col-span-7 flex flex-col gap-space-lg">
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">receipt</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Format Kertas Thermal Kasir</h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">Pilih lebar kertas default sesuai printer Bluetooth/Ethernet yang terpasang di masing-masing kasir cabang.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-2">
                <label className={`relative flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all ${paperSize === '58mm' ? 'bg-surface-container border-2 border-primary/40 shadow-sm' : 'bg-surface-container-low hover:bg-surface-container'}`}>
                  <input type="radio" name="paper_size" value="58mm" checked={paperSize === '58mm'} onChange={() => setPaperSize('58mm')} className="mt-1 text-primary focus:ring-0" />
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">58mm Thermal</span>
                    <span className="font-body-md text-body-md text-on-surface-variant mt-1">Standar printer portabel kasir mobile (32 karakter/baris).</span>
                  </div>
                </label>
                <label className={`relative flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all ${paperSize === '80mm' ? 'bg-surface-container border-2 border-primary/40 shadow-sm' : 'bg-surface-container-low hover:bg-surface-container'}`}>
                  <input type="radio" name="paper_size" value="80mm" checked={paperSize === '80mm'} onChange={() => setPaperSize('80mm')} className="mt-1 text-primary focus:ring-0" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold">80mm Thermal</span>
                      <span className="px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-[10px] font-bold">REKOMENDASI</span>
                    </div>
                    <span className="font-body-md text-body-md text-on-surface-variant mt-1">Standar industri Epson TM-T82 (48 karakter/baris), cetak lebih rapi.</span>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">edit_note</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Redaksi Teks Header & Footer Struk</h3>
              </div>
              <div className="flex flex-col gap-space-sm">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Teks Judul Header Struk (Tengah)</label>
                <input type="text" defaultValue="MARTABOOM - MARTABAK & TERANG BULAN SPESIAL" className="px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container focus:text-on-surface border border-transparent focus:border-outline-variant" />
                <span className="font-label-sm text-label-sm text-on-surface-variant/80">Alamat cabang dan nomor invoice otomatis digenerate per transaksi.</span>
              </div>
              <div className="flex flex-col gap-space-sm pt-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Pesan Penutup Footer Struk</label>
                <textarea rows="3" defaultValue="Terima kasih telah menikmati cita rasa legit Martaboom! Follow IG @martaboom.id. Komplain & Kritik WA: 0812-3456-7890." className="p-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container focus:text-on-surface border border-transparent focus:border-outline-variant"></textarea>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className={`w-full max-w-[${paperSize === '80mm' ? '340px' : '280px'}] bg-surface-container-lowest p-6 rounded-lg shadow-lg flex flex-col font-mono text-[12px] leading-relaxed text-on-surface relative`}>
              <div className="text-center font-bold text-[14px] uppercase mb-1 tracking-wider">
                MARTABOOM - MARTABAK & TERANG BULAN SPESIAL
              </div>
              <div className="text-center text-[10px] text-on-surface-variant pb-2 border-b-2 border-dashed border-outline-variant">
                Cabang Dipatiukur - Bandung<br/>
                Telp: (022) 8940-1122 | Kasir: Budi Utomo
              </div>
              <div className="flex justify-between text-[11px] py-2 border-b border-dashed border-outline-variant">
                <span>26/10/2024 21:14</span>
                <span>TRX#MB-98241</span>
              </div>
              
              <div className="flex flex-col gap-2 py-3 border-b-2 border-dashed border-outline-variant">
                <div className="flex flex-col">
                  <div className="flex justify-between font-bold">
                    <span>1x TB Black Forest C.Cheese</span>
                    <span>68.000</span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant pl-3">* Base Black Forest Kakao</span>
                  <span className="text-[10px] text-on-surface-variant pl-3">* Top: KitKat Green Tea (+14.000)</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between font-bold">
                    <span>1x Martabak Telur Bebek</span>
                    <span>62.000</span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant pl-3">* Note: Kuah cuka dipisah</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-1 py-2 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>144.000</span>
                </div>
                <div className="flex justify-between">
                  <span>PB1 Resto (10%):</span>
                  <span>14.400</span>
                </div>
                <div className="flex justify-between font-bold text-[13px] pt-1">
                  <span>TOTAL BAYAR:</span>
                  <span>Rp 158.400</span>
                </div>
                <div className="flex justify-between text-[10px] text-on-surface-variant">
                  <span>Metode: QRIS BCA Dinamis</span>
                  <span>LUNAS</span>
                </div>
              </div>
              
              <div className="text-center text-[10px] text-on-surface-variant pt-2 border-t border-dashed border-outline-variant mt-2">
                Terima kasih telah menikmati cita rasa legit Martaboom! Follow IG @martaboom.id. Komplain & Kritik WA: 0812-3456-7890.
              </div>
            </div>
            
            <button className="mt-4 px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1.5 transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[18px]">print</span> Uji Cetak Struk Contoh
            </button>
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
              <button className="px-4 py-2 rounded-lg bg-primary hover:bg-surface-tint text-on-primary font-label-md text-label-md flex items-center gap-1.5 shadow-sm transition-all">
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
                        <button onClick={() => resetPin(staff.name)} className={`px-3 py-1.5 rounded-lg ${staff.isExpired ? 'bg-error-container text-on-error-container' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'} font-label-md text-label-md inline-flex items-center gap-1 transition-colors`}>
                          <span className={`material-symbols-outlined text-[16px] ${staff.isExpired ? '' : 'text-primary'}`}>{staff.isExpired ? 'sync_lock' : 'key'}</span> {staff.isExpired ? 'Buat Baru' : 'Reset PIN'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'integrasi-kasir' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between gap-space-md">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm text-on-surface">Pawoon POS Bridge API</span>
                <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-bold">TERHUBUNG</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">Sinkronisasi mutasi transaksi tunai, void penjualan, dan laporan closing harian secara live per gerai.</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t-0">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Koneksi ID: PWN-MB-90218</span>
              <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md">Kelola Token</button>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between gap-space-md">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm text-on-surface">Moka POS Direct Sync</span>
                <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-bold">STANDBY</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">Koneksi cadangan jika tablet POS utama offline, data order disalurkan via batch sync lokal.</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t-0">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Status: Siaga Operasional</span>
              <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md">Konfigurasi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
