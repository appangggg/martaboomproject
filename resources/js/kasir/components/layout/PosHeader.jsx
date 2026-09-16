import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

export default function PosHeader() {
  const [cashier, setCashier] = useState(null);
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
    const walk = (x - navRef.current.startX) * 1.5; // scroll-speed
    navRef.current.scrollLeft = navRef.current.scrollLeftStart - walk;
  };

  useEffect(() => {
    const saved = localStorage.getItem('pos_cashier');
    if (saved) {
      setCashier(JSON.parse(saved));
    }
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_4px_20px_-4px_rgba(70,42,25,0.08)]">
      <div className="h-20 w-full px-space-lg flex items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md shrink-0">
          <img
            alt="Martaboom POS Brand Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1UQOtaXm8ZM52PSH8kPJRElEQ_Pfy3dgMMn-fyZ8_Rmt1Pl1XQb0uJaBCrQZaRKYTYCwM8uINgZNZxHiJ_oRP_bwkA6ii_s5uBI8Rxf2Ujl6GE-kQKJAyvJZs7j0LsKlUVro8V50X1Fy0oulYAUbtFov8LvgbbRP76m3-wUBu5JzvZ08fll8tLrYcPRliuBNaxOPrt0lXNe7IXrsZyqINLBqo_nan54NHiuG69MqmtTQPsUeHyi4aJUGrU"
          />
          <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-1.5 rounded-full shadow-[0_1px_4px_rgba(70,42,25,0.05)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary"></span>
            </span>
            <span className="font-label-md text-label-md text-on-surface">Cabang Tebet Barat</span>
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
          <div className="bg-secondary-fixed px-space-md py-1.5 rounded-full flex items-center gap-space-xs shadow-[0_2px_6px_rgba(121,89,0,0.12)]">
            <span className="font-label-sm text-label-sm uppercase text-on-secondary-fixed-variant">Antrean</span>
            <span className="font-title-lg text-title-lg text-on-secondary-fixed font-black tracking-tight">#042</span>
          </div>
          <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1 rounded-full shadow-[0_1px_4px_rgba(70,42,25,0.06)]">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
            <div className="flex flex-col text-left pr-space-xs">
              <span className="font-label-md text-label-md text-on-surface font-bold leading-tight">{cashier ? cashier.name : 'Kasir Utama'}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight">{cashier ? cashier.role : 'Kasir 01'}</span>
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
