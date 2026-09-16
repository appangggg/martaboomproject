import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="bg-[#F8F9FA] font-body-md text-body-md text-on-surface antialiased flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-[260px] bg-white border-r border-gray-200 z-50 flex flex-col justify-between overflow-y-auto">
        <div className="flex flex-col w-full">
          {/* Logo Area */}
          <div className="h-16 px-6 flex items-center border-b border-gray-100">
            <span className="font-bold text-xl text-primary tracking-wide">MARTABOOM</span>
          </div>
          
          <nav className="flex flex-col gap-1 px-4 py-6">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all mb-4 ${
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">home</span>
              <span className="text-sm">Dashboard</span>
            </NavLink>

            {/* ATUR MENU */}
            <div className="mb-4">
              <div className="flex items-center justify-between px-4 py-2 text-xs font-bold text-gray-400 tracking-wider mb-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">menu_open</span>
                  <span>ATUR MENU</span>
                </div>
                <span className="material-symbols-outlined text-[16px]">expand_less</span>
              </div>
              
              <NavLink
                to="/admin/products"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-all ml-2 ${
                    isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                <span className="text-sm">Produk</span>
              </NavLink>

              <NavLink
                to="/admin/stock"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-all ml-2 ${
                    isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[18px]">shelves</span>
                <span className="text-sm">Stok</span>
              </NavLink>
            </div>

            {/* KEUANGAN */}
            <div className="mb-4">
              <div className="flex items-center justify-between px-4 py-2 text-xs font-bold text-primary tracking-wider mb-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">payments</span>
                  <span>KEUANGAN</span>
                </div>
                <span className="material-symbols-outlined text-[16px]">expand_less</span>
              </div>
              
              <NavLink
                to="/admin/daily-report"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-all ml-2 ${
                    isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                <span className="text-sm">Laporan Harian</span>
              </NavLink>

              <NavLink
                to="/admin/pettycash"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-all ml-2 ${
                    isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                <span className="text-sm">Sesi Kas & Petty Cash</span>
              </NavLink>
            </div>

            {/* PENGATURAN */}
            <div className="mb-4">
              <div className="flex items-center justify-between px-4 py-2 text-xs font-bold text-gray-400 tracking-wider mb-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                  <span>SISTEM</span>
                </div>
              </div>
              
              <NavLink
                to="/admin/employee"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-all ml-2 ${
                    isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[18px]">badge</span>
                <span className="text-sm">Karyawan</span>
              </NavLink>

              <NavLink
                to="/admin/branch"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-all ml-2 ${
                    isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[18px]">store</span>
                <span className="text-sm">Cabang</span>
              </NavLink>
            </div>

            {/* PENGATURAN ADMIN */}
            <div>
              <div className="flex items-center justify-between px-4 py-2 text-xs font-bold text-gray-400 tracking-wider mb-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">settings</span>
                  <span>PENGATURAN ADMIN</span>
                </div>
              </div>

              <NavLink
                to="/admin/settings"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-all ml-2 ${
                    isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[18px]">settings</span>
                <span className="text-sm">Pengaturan</span>
              </NavLink>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="pl-[260px] w-full flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-end px-8 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Owner Demo</span>
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded">owner</span>
            <button className="text-sm font-semibold text-error hover:text-red-700 transition-colors ml-2">
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#F8F9FA] p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

