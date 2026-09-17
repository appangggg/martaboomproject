import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

export default function PosHeader() {
  const [cashier, setCashier] = useState(null);
  const [branch, setBranch] = useState(null);
  const [appName, setAppName] = useState('Martaboom POS');
  const navRef = useRef(null);

  const handleWheel = (e) => {
    if (navRef.current) {
      navRef.current.scrollLeft += e.deltaY;
    }
  };

  const handleMouseDown = (e) => {
    if (navRef.current) {
      navRef.current.isDown = true;
      navRef.current.startX = e.pageX - navRef.current.offsetLeft;
      navRef.current.scrollLeftStart = navRef.current.scrollLeft;
      navRef.current.classList.add('cursor-grabbing');
    }
  };

  const handleMouseLeave = () => {
    if (navRef.current) {
      navRef.current.isDown = false;
      navRef.current.classList.remove('cursor-grabbing');
    }
  };

  const handleMouseUp = () => {
    if (navRef.current) {
      navRef.current.isDown = false;
      navRef.current.classList.remove('cursor-grabbing');
    }
  };

  const handleMouseMove = (e) => {
    if (!navRef.current || !navRef.current.isDown) return;
    e.preventDefault();
    const x = e.pageX - navRef.current.offsetLeft;
    const walk = (x - navRef.current.startX) * 1.5;
    navRef.current.scrollLeft = navRef.current.scrollLeftStart - walk;
  };

  useEffect(() => {
    // Load cashier from localStorage
    const saved = localStorage.getItem('pos_cashier');
    if (saved) {
      const cashierData = JSON.parse(saved);
      setCashier(cashierData);

      // Load branch based on cashier's branch_id
      const branchId = cashierData?.branch_id || 1;
      loadBranch(branchId);
    } else {
      loadBranch(1);
    }

    // Load app name from settings
    const savedSettings = localStorage.getItem('pos_settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings?.app_name) setAppName(settings.app_name);
      } catch (_) { /* ignore */ }
    }
  }, []);

  const loadBranch = async (branchId) => {
    // First check cache
    const cached = localStorage.getItem('pos_branch');
    if (cached) {
      try {
        const data = JSON.parse(cached);
        if (data.id === branchId) {
          setBranch(data);
          return;
        }
      } catch (_) { /* ignore */ }
    }

    try {
      const res = await fetch(`/api/branches/current?branch_id=${branchId}`, {
        headers: { 'Accept': 'application/json' },
      });
      const json = await res.json();
      if (json.status === 'success' && json.data) {
        setBranch(json.data);
        localStorage.setItem('pos_branch', JSON.stringify(json.data));
      }
    } catch (err) {
      console.error('Failed to load branch info', err);
    }
  };

  const branchName = branch?.name || 'Memuat Cabang...';
  const branchAddress = branch?.address || '';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_4px_20px_-4px_rgba(70,42,25,0.08)]">
      <div className="h-20 w-full px-space-lg flex items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md shrink-0">
          {/* Brand Logo + Name */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md shrink-0">
              <span className="material-symbols-outlined text-on-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>store</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-label-sm text-label-sm text-on-surface font-black uppercase tracking-widest leading-none">
                {appName}
              </span>
              <span className="font-label-sm text-[10px] text-on-surface-variant leading-none tracking-wide">
                POS System
              </span>
            </div>
          </div>

          {/* Branch Chip */}
          <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-1.5 rounded-full shadow-[0_1px_4px_rgba(70,42,25,0.05)]">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary"></span>
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-label-md text-label-md text-on-surface leading-tight">{branchName}</span>
              {branchAddress && (
                <span className="font-label-sm text-[10px] text-on-surface-variant leading-none max-w-[160px] truncate">{branchAddress}</span>
              )}
            </div>
            <span className="font-label-sm text-label-sm text-tertiary bg-tertiary-fixed px-1.5 py-0.5 rounded-full font-bold">Online</span>
          </div>
        </div>

        <nav
          ref={navRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="hidden lg:flex items-center gap-space-xs bg-surface-container-low p-1.5 rounded-full shadow-inner overflow-x-auto cursor-grab"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <NavLink to="/order" className={({ isActive }) => `px-space-md py-2 rounded-full font-bold transition-all duration-150 active:scale-95 whitespace-nowrap ${isActive ? 'bg-primary-container text-on-primary shadow-[0_2px_8px_rgba(217,142,63,0.35)]' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}>Kasir Utama</NavLink>
          <NavLink to="/held-bills" className={({ isActive }) => `px-space-md py-2 rounded-full font-label-lg text-label-lg transition-all duration-150 active:scale-95 whitespace-nowrap ${isActive ? 'bg-primary-container text-on-primary font-bold shadow-[0_2px_8px_rgba(217,142,63,0.35)]' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}>Daftar Pesanan</NavLink>
          <NavLink to="/petty-cash" className={({ isActive }) => `px-space-md py-2 rounded-full font-label-lg text-label-lg transition-all duration-150 active:scale-95 whitespace-nowrap ${isActive ? 'bg-primary-container text-on-primary font-bold shadow-[0_2px_8px_rgba(217,142,63,0.35)]' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}>Kas Kecil &amp; Shift</NavLink>
          <NavLink to="/kitchen-production" className={({ isActive }) => `px-space-md py-2 rounded-full font-label-lg text-label-lg transition-all duration-150 active:scale-95 whitespace-nowrap ${isActive ? 'bg-primary-container text-on-primary font-bold shadow-[0_2px_8px_rgba(217,142,63,0.35)]' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}>Dapur &amp; KOT</NavLink>
          <NavLink to="/waste-record" className={({ isActive }) => `px-space-md py-2 rounded-full font-label-lg text-label-lg transition-all duration-150 active:scale-95 whitespace-nowrap ${isActive ? 'bg-primary-container text-on-primary font-bold shadow-[0_2px_8px_rgba(217,142,63,0.35)]' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}>Waste &amp; Rusak</NavLink>
          <NavLink to="/attendance" className={({ isActive }) => `px-space-md py-2 rounded-full font-label-lg text-label-lg transition-all duration-150 active:scale-95 whitespace-nowrap ${isActive ? 'bg-primary-container text-on-primary font-bold shadow-[0_2px_8px_rgba(217,142,63,0.35)]' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}>Absensi</NavLink>
          <NavLink to="/shift" className={({ isActive }) => `px-space-md py-2 rounded-full font-label-lg text-label-lg transition-all duration-150 active:scale-95 whitespace-nowrap ${isActive ? 'bg-primary-container text-on-primary font-bold shadow-[0_2px_8px_rgba(217,142,63,0.35)]' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}>Buka Shift</NavLink>
        </nav>

        <div className="flex items-center gap-space-sm shrink-0">
          {/* Cashier info */}
          <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1 rounded-full shadow-[0_1px_4px_rgba(70,42,25,0.06)]">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
              <span className="font-label-sm text-label-sm text-on-primary font-bold">
                {cashier ? cashier.name.substring(0, 2).toUpperCase() : 'KS'}
              </span>
            </div>
            <div className="flex flex-col text-left pr-space-xs">
              <span className="font-label-md text-label-md text-on-surface font-bold leading-tight">{cashier ? cashier.name : 'Kasir'}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight capitalize">{cashier ? cashier.role : 'kasir'}</span>
            </div>
          </div>
          <NavLink to="/settings" aria-label="Pengaturan POS" className={({ isActive }) => `w-10 h-10 rounded-full flex items-center justify-center transition-colors active:scale-95 ${isActive ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`} type="button">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </NavLink>
          <button aria-label="Toggle Light/Dark Theme" className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors active:scale-95" type="button">
            <span className="material-symbols-outlined text-[20px]">light_mode</span>
          </button>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-low text-tertiary" title="WiFi Status: Online">
            <span className="material-symbols-outlined text-[20px]">wifi</span>
          </div>
        </div>
      </div>
    </header>
  );
}
