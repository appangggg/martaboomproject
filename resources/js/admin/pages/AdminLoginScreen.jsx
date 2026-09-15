import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle, loading, success
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('loading');

    // Simulate API call
    setTimeout(() => {
      setSubmitStatus('success');
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/admin/dashboard');
      }, 1000);
    }, 1200);
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center p-space-md bg-surface">
      <div className="flex flex-col w-full">
        {/* Subtle decorative ambient elements */}
        <div className="relative w-full flex flex-col items-center justify-center min-h-[calc(100vh-2rem)] py-space-xl">
          {/* Top-Right Controls */}
          <div className="absolute top-0 right-0 flex items-center gap-space-sm z-20">
            <button
              aria-label="Ganti Mode Tampilan"
              className="flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container hover:bg-surface-container-high rounded-full shadow-sm text-on-surface transition-all duration-200"
              onClick={() => document.documentElement.classList.toggle('dark')}
            >
              <span className="material-symbols-outlined text-primary text-[18px]">routine</span>
              <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Mode Tema</span>
            </button>
            <div className="flex items-center gap-1.5 px-space-md py-space-xs bg-surface-container-low rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              <span className="font-label-sm text-label-sm font-medium text-tertiary">Server Aktif</span>
            </div>
          </div>
          
          {/* Soft Ambient Warm Caramel Glows */}
          <div className="absolute top-1/4 -left-16 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
          <div className="absolute bottom-1/4 -right-16 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
          
          {/* Main Container: Asymmetric Split Architecture */}
          <div className="w-full max-w-5xl bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden flex flex-col lg:flex-row relative z-10">
            {/* Left Column: Martaboom Brand Narrative & Live Multi-Branch Metrics */}
            <div className="lg:w-5/12 bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-high p-space-xl lg:p-10 flex flex-col justify-between relative overflow-hidden">
              {/* SVG Pattern Texture */}
              <svg className="absolute -right-12 -top-12 opacity-15 pointer-events-none text-primary" fill="currentColor" height="280" viewBox="0 0 100 100" width="280">
                <circle cx="50" cy="50" fill="none" r="46" stroke="currentColor" strokeDasharray="4 2" strokeWidth="3"></circle>
                <circle cx="50" cy="50" fill="currentColor" fillOpacity="0.12" r="36"></circle>
                <line stroke="currentColor" strokeWidth="2" x1="28" x2="28" y1="20" y2="80"></line>
                <line stroke="currentColor" strokeWidth="2" x1="42" x2="42" y1="12" y2="88"></line>
                <line stroke="currentColor" strokeWidth="2" x1="58" x2="58" y1="12" y2="88"></line>
                <line stroke="currentColor" strokeWidth="2" x1="72" x2="72" y1="20" y2="80"></line>
                <line stroke="currentColor" strokeWidth="2" x1="20" x2="80" y1="28" y2="28"></line>
                <line stroke="currentColor" strokeWidth="2" x1="12" x2="88" y1="42" y2="42"></line>
                <line stroke="currentColor" strokeWidth="2" x1="12" x2="88" y1="58" y2="58"></line>
                <line stroke="currentColor" strokeWidth="2" x1="20" x2="80" y1="72" y2="72"></line>
              </svg>

              <div className="flex flex-col items-start gap-space-sm relative z-10">
                <div className="h-12 flex items-center justify-start text-primary font-bold text-3xl">
                  {/* Text Logo instead of img for robustness */}
                  Martaboom
                </div>
                <p className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Portal Manajemen &amp; Multi-Cabang
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Pusat kendali operasional, audit stok loyang harian, dan rekonsiliasi kasir martabak &amp; terang bulan secara tersinkronisasi.
                </p>
              </div>

              <div className="my-space-lg flex flex-col gap-space-md relative z-10">
                <div className="p-space-md rounded-lg bg-surface-container-lowest/80 backdrop-blur shadow-sm flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Status Operasional Malam Ini</span>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
                    </span>
                  </div>
                  <div className="flex items-baseline gap-space-xs mt-0.5">
                    <span className="font-headline-kpi text-headline-kpi text-primary leading-none">4</span>
                    <span className="font-body-md text-body-md text-on-surface font-medium">Cabang Buka</span>
                    <span className="text-outline-variant mx-1">•</span>
                    <span className="font-headline-kpi text-headline-kpi text-tertiary leading-none">3</span>
                    <span className="font-body-md text-body-md text-on-surface font-medium">Lapor Closing</span>
                  </div>
                  <div className="w-full bg-surface-variant rounded-full h-1.5 mt-1 overflow-hidden">
                    <div className="bg-primary-container h-1.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-space-sm">
                  <div className="p-space-sm bg-surface-container-lowest/70 rounded-lg shadow-sm flex items-center gap-space-sm">
                    <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-[18px]">skillet</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-sm text-label-sm text-on-surface-variant truncate">Yield Loyang</span>
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold">98.4%</span>
                    </div>
                  </div>
                  <div className="p-space-sm bg-surface-container-lowest/70 rounded-lg shadow-sm flex items-center gap-space-sm">
                    <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
                      <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-sm text-label-sm text-on-surface-variant truncate">Audit Kasir</span>
                      <span className="font-headline-sm text-headline-sm text-tertiary font-bold">Nol Selisih</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative rounded-lg overflow-hidden h-36 shadow-sm hidden sm:block">
                {/* Fallback pattern bg */}
                <div className="bg-cover bg-center w-full h-full transform hover:scale-105 transition-transform duration-500 bg-surface-container-high"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/30 to-transparent flex items-end p-space-md">
                  <span className="font-label-md text-label-md text-inverse-on-surface font-medium">Standar Rasa &amp; Kecepatan Saji Terintegrasi</span>
                </div>
              </div>
            </div>

            {/* Right Column: Authentication Form */}
            <div className="lg:w-7/12 p-space-xl sm:p-10 flex flex-col justify-between bg-surface-container-lowest">
              <div>
                <div className="flex flex-col gap-1 mb-space-lg">
                  <span className="font-label-sm text-label-sm font-bold uppercase tracking-widest text-primary">Autentikasi Pemilik</span>
                  <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">Masuk ke Martaboom</h1>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                    Kelola cabang pusat, pantau persediaan adonan, serta buku besar harian.
                  </p>
                </div>

                <form className="flex flex-col gap-space-md" onSubmit={handleLogin}>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between" htmlFor="identifier">
                      <span>Email Pemilik / No. WhatsApp</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Terdaftar di Pusat</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px] pointer-events-none">contact_phone</span>
                      <input 
                        className="w-full pl-10 pr-space-md py-2.5 bg-surface rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline/70 focus:outline-none focus:ring-2 focus:ring-primary-container focus:bg-surface-container-lowest transition-all" 
                        id="identifier" name="identifier" placeholder="contoh: budi@martaboom.id atau 081234567890" required type="text" 
                        defaultValue="owner@martaboom.id"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="ownerPin">
                        Kata Sandi / PIN 6-Digit Owner
                      </label>
                      <a className="font-label-md text-label-md text-primary hover:text-on-primary-container transition-colors" href="#">
                        Lupa Kata Sandi?
                      </a>
                    </div>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px] pointer-events-none">lock</span>
                      <input 
                        className="w-full pl-10 pr-10 py-2.5 bg-surface rounded-lg text-on-surface font-body-md text-body-md placeholder:text-outline/70 focus:outline-none focus:ring-2 focus:ring-primary-container focus:bg-surface-container-lowest transition-all" 
                        id="ownerPin" maxLength="32" name="ownerPin" placeholder="Masukkan 6-digit PIN atau kata sandi" required 
                        type={showPassword ? "text" : "password"} 
                        defaultValue="123456"
                      />
                      <button 
                        aria-label="Tampilkan Kata Sandi" 
                        className="absolute right-3 text-on-surface-variant hover:text-on-surface focus:outline-none" 
                        onClick={() => setShowPassword(!showPassword)} 
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input defaultChecked className="w-4 h-4 text-primary bg-surface rounded focus:ring-primary focus:ring-2 accent-primary" id="rememberMe" name="rememberMe" type="checkbox"/>
                      <span className="font-body-md text-body-md text-on-surface">Ingat sesi di perangkat ini</span>
                    </label>
                    <div className="flex items-center gap-1 text-tertiary">
                      <span className="material-symbols-outlined text-[16px]">lock_clock</span>
                      <span className="font-label-sm text-label-sm font-medium">Sesi 14 Hari</span>
                    </div>
                  </div>
                  
                  <button 
                    className={`w-full mt-space-sm py-3 px-space-md rounded-lg font-headline-sm text-headline-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-space-xs active:scale-[0.99] ${
                      submitStatus === 'success' 
                        ? 'bg-tertiary text-on-tertiary' 
                        : 'bg-primary-container hover:bg-[#c57e32] text-on-primary'
                    }`} 
                    disabled={isSubmitting} 
                    type="submit"
                  >
                    {submitStatus === 'idle' && (
                      <>
                        <span>Masuk ke Dashboard Owner</span>
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                      </>
                    )}
                    {submitStatus === 'loading' && (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                        <span>Memvalidasi Akses...</span>
                      </>
                    )}
                    {submitStatus === 'success' && (
                      <>
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        <span>Akses Terverifikasi</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="mt-space-lg pt-space-md flex flex-col gap-space-sm">
                <div className="p-space-sm bg-surface-container-low rounded-lg flex items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-[14px]">
                      <span className="material-symbols-outlined text-[18px]">support_agent</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">Kendala Akses Kasir &amp; Owner?</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Tim Support Martaboom siaga 24/7</span>
                    </div>
                  </div>
                  <a className="inline-flex items-center gap-1 px-space-sm py-1.5 bg-surface-container-lowest hover:bg-surface-container text-primary font-label-sm text-label-sm font-bold rounded-lg shadow-sm transition-colors" href="#">
                    <span>Hubungi WA</span>
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                  </a>
                </div>
                <div className="flex items-center justify-center gap-space-xs text-outline font-label-sm text-label-sm py-1">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">security</span>
                  <span>Enkripsi Data Kasir &amp; Laporan Keuangan Terproteksi SHA-256</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-space-md text-center">
            <p className="font-label-sm text-label-sm text-outline-variant">
              Sistem Operasi Ritel Kuliner Martaboom v4.2.0 • Hak Cipta Terpelihara
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
