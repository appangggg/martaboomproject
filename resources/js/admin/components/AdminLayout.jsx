import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-[260px] bg-surface-container-lowest border-r border-surface-container-high z-50 flex flex-col justify-between overflow-y-auto">
        <div className="flex flex-col w-full">
          <div className="h-16 px-space-md flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              {/* Using a generic icon for logo since image URL might be long/expire */}
              <div className="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center font-bold">M</div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface leading-tight tracking-tight">Martaboom</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant leading-none">Owner Control Hub</span>
              </div>
            </div>
          </div>
          <div className="px-space-md pt-space-sm pb-space-xs">
            <div className="p-3 bg-surface rounded-lg border border-surface-container-high cursor-pointer hover:bg-surface-container transition-colors">
              <div className="flex items-center justify-between mb-space-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[18px]">storefront</span>
                  <span className="font-label-md text-label-md text-on-surface">Semua Cabang</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm">4 Aktif</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant truncate">4 Cabang Terhubung</span>
                <span className="material-symbols-outlined text-on-surface-variant text-[16px]">expand_more</span>
              </div>
            </div>
          </div>
          
          <nav className="flex flex-col gap-0.5 px-space-md py-space-sm">
            {[
              { path: '/admin/dashboard', icon: 'grid_view', label: 'Overview' },
              { path: '/admin/sales', icon: 'point_of_sale', label: 'Penjualan' },
              { path: '/admin/profit', icon: 'trending_up', label: 'Laba Rugi Kotor' },
              { path: '/admin/discrepancy', icon: 'warning', label: 'Peringatan Selisih', badge: '3', badgeColor: 'bg-error text-on-error' },
              { path: '/admin/inventory', icon: 'inventory_2', label: 'Inventaris & BOM' },
              { path: '/admin/stock', icon: 'fact_check', label: 'Stok Opname & Waste' },
              { path: '/admin/pettycash', icon: 'payments', label: 'Kas Kecil' },
              { path: '/admin/employee', icon: 'badge', label: 'Karyawan & Absensi' },
              { path: '/admin/payroll', icon: 'receipt_long', label: 'Payroll & Komisi' },
              { path: '/admin/branch', icon: 'domain', label: 'Manajemen Cabang' },
              { path: '/admin/settings', icon: 'settings', label: 'Pengaturan' },
            ].map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg transition-all mb-1 ${
                    isActive
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`
                }
              >
                <div className="flex items-center gap-space-sm">
                  <span className={`material-symbols-outlined text-[20px] ${item.badge ? 'text-error' : ''}`}>{item.icon}</span>
                  <span className="font-body-md text-body-md">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded-full font-label-sm text-label-sm ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="p-space-md flex flex-col gap-2 mx-space-md mb-space-md border-t border-surface-container-high">
          <div className="flex items-center gap-space-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-tertiary animate-pulse">sync</span>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Sinkronisasi Terakhir</span>
              <span className="font-label-md text-label-md text-on-surface font-semibold">23:45 WIB</span>
            </div>
          </div>
          <a className="flex items-center justify-between pt-space-xs text-primary hover:text-on-primary-container font-label-md text-label-md" href="#">
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">help</span>Pusat Bantuan</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="pl-[260px] w-full flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-surface-container-lowest border-b border-surface-container-high z-40 flex items-center justify-between px-space-xl shrink-0">
          <div className="flex items-center gap-space-md">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
                <span>Konsolidasi Bisnis</span><span>/</span><span className="text-on-surface font-medium">Executive View</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Batch closing shift malam sedang berlangsung</span>
            </div>
          </div>
          <div className="flex items-center gap-space-lg">
            <div className="hidden md:flex items-center gap-space-xs px-3 py-1.5 rounded-full border border-surface-container-high bg-surface">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span>
              <span className="font-label-md text-label-md text-on-surface">Status Closing: 3/4 Cabang Selesai</span>
            </div>
            <div className="flex items-center gap-space-sm">
              <button aria-label="Theme Toggle" className="w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all">
                <span className="material-symbols-outlined text-[20px]">light_mode</span>
              </button>
              <button aria-label="Peringatan Selisih" className="relative w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-error text-on-error font-label-sm text-[10px] flex items-center justify-center font-bold">3</span>
              </button>
            </div>
            <div className="flex items-center gap-space-sm pl-space-sm border-l border-surface-container-high">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold">H</div>
              <div className="flex flex-col text-left">
                <span className="font-label-md text-label-md text-on-surface leading-tight font-semibold">Pak Hendra (Owner)</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant leading-none">Martaboom Group</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-surface p-space-xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
