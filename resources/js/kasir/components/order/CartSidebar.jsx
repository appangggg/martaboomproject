import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CartSidebar({ cartItems, onClearCart, onIncrease, onDecrease }) {
  const navigate = useNavigate();
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="flex flex-col h-full">
      {/* CART HEADER */}
      <div className="flex items-center justify-between pb-space-md border-b-0">
        <div className="flex items-center gap-space-sm">
          <div className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shadow-sm">
            <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-title-md text-title-md text-on-surface font-black tracking-tight">Pesanan Aktif</span>
              <span className="bg-surface-container px-2 py-0.5 rounded-full font-label-sm text-label-sm text-primary font-bold">Dine In / Takeaway</span>
            </div>
            <span className="font-label-md text-label-md text-on-surface-variant">Nomor Antrean: <strong className="text-secondary font-black">#042</strong></span>
          </div>
        </div>
        <button 
          className="w-10 h-10 rounded-xl bg-error-container/60 hover:bg-error-container text-error flex items-center justify-center transition-colors active:scale-95" 
          onClick={onClearCart}
          title="Reset Keranjang" 
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
        </button>
      </div>

      {/* CART ITEMS LIST */}
      <div className="flex flex-col divide-y divide-surface-container-low my-space-sm flex-1 overflow-y-auto pr-1 select-none no-scrollbar">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] opacity-20 mb-2">shopping_cart</span>
            <p className="font-title-md">Keranjang Kosong</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="py-space-sm flex flex-col gap-1.5">
              <div className="flex items-start justify-between gap-space-xs">
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-title-md text-title-md text-on-surface font-bold truncate">
                    {item.quantity}x {item.name}
                  </span>
                  <span className={`font-label-sm text-label-sm ${item.colorClass} flex items-center gap-1 mt-0.5`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.bgClass}`}></span>
                    {item.modifiers}
                  </span>
                </div>
                <span className="font-title-md text-title-md text-on-surface font-extrabold shrink-0">
                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <button className="text-outline text-label-sm font-label-sm hover:text-error flex items-center gap-1 transition-colors" type="button">
                  <span className="material-symbols-outlined text-[14px]">edit_note</span> Edit Mod
                </button>
                <div className="flex items-center gap-2 bg-surface-container-low px-2 py-1 rounded-full">
                  <button onClick={() => onDecrease(item.id)} className="w-7 h-7 rounded-full bg-surface-container-lowest hover:bg-primary-fixed flex items-center justify-center text-on-surface shadow-xs active:scale-90" type="button">
                    <span className="material-symbols-outlined text-[16px]">remove</span>
                  </button>
                  <span className="font-num-keypad text-[16px] text-on-surface w-5 text-center font-bold">{item.quantity}</span>
                  <button onClick={() => onIncrease(item.id)} className="w-7 h-7 rounded-full bg-surface-container-lowest hover:bg-primary-fixed flex items-center justify-center text-on-surface shadow-xs active:scale-90" type="button">
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* VOUCHER & CATATAN SHORTCUT */}
      <div className="grid grid-cols-2 gap-space-xs my-space-xs pt-space-xs shrink-0">
        <button className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-surface-container-low hover:bg-surface-container rounded-xl text-on-surface font-label-md text-label-md transition-colors" type="button">
          <span className="material-symbols-outlined text-[18px] text-secondary">confirmation_number</span>
          <span>Promo / Kupon</span>
        </button>
        <button className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-surface-container-low hover:bg-surface-container rounded-xl text-on-surface font-label-md text-label-md transition-colors" type="button">
          <span className="material-symbols-outlined text-[18px] text-outline">note_alt</span>
          <span>Catatan Khusus</span>
        </button>
      </div>

      {/* KALKULASI RINGKASAN HARGA */}
      <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col gap-2 my-space-sm shrink-0">
        <div className="flex justify-between items-center text-on-surface-variant font-body-md text-body-md">
          <span>Subtotal ({totalItems} item)</span>
          <span className="font-bold text-on-surface">Rp {subtotal.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between items-center text-on-surface-variant font-body-md text-body-md">
          <div className="flex items-center gap-1">
            <span>Pajak Resto (PB1 10%)</span>
            <span className="material-symbols-outlined text-[14px] text-outline cursor-help" title="Pajak Pembangunan 1 Daerah">info</span>
          </div>
          <span className="font-bold text-on-surface">Rp {tax.toLocaleString('id-ID')}</span>
        </div>
        <div className="h-[1px] bg-surface-container-highest my-1"></div>
        <div className="flex justify-between items-end pt-1">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-extrabold">Total Tagihan</span>
            <span className="font-label-md text-label-md text-secondary font-bold">Sudah Termasuk PB1</span>
          </div>
          <span className="font-num-display text-num-display text-primary font-black tracking-tight leading-none">
            Rp {total.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="grid grid-cols-12 gap-space-xs mt-space-xs shrink-0">
        <button className="col-span-4 h-16 rounded-2xl bg-secondary-container hover:bg-secondary-fixed-dim text-on-secondary-container font-label-lg text-label-lg flex flex-col items-center justify-center gap-0.5 shadow-sm transition-transform active:scale-95" type="button">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">pause_circle</span>
            <span>Tahan</span>
          </div>
          <span className="bg-surface-container-lowest/80 text-on-secondary-container px-2 py-0.2 rounded-full text-[10px] font-extrabold">
            3 ditahan
          </span>
        </button>
        
        <button 
          className="col-span-8 h-16 rounded-2xl bg-primary-container hover:bg-primary text-on-primary flex items-center justify-between px-space-lg shadow-[0_8px_20px_rgba(217,142,63,0.4)] transition-all transform active:scale-98"
          type="button"
          onClick={() => {
            if (total > 0) {
              navigate('/payment', { state: { cartItems, subtotal, tax, total } });
            }
          }}
        >
          <div className="flex flex-col text-left">
            <span className="font-headline-md text-headline-md font-black tracking-wide leading-tight">BAYAR</span>
            <span className="font-label-sm text-label-sm opacity-90">Tunai / QRIS / Debit</span>
          </div>
          <div className="flex items-center gap-1.5 font-headline-md text-headline-md font-black">
            <span>Rp {total.toLocaleString('id-ID')}</span>
            <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
          </div>
        </button>
      </div>
      
      {/* QUICK CASH SHORTCUTS */}
      <div className="flex items-center justify-between gap-1.5 mt-space-sm pt-space-xs shrink-0">
        <span className="font-label-sm text-label-sm text-outline font-bold shrink-0">Uang Pas:</span>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button className="px-2.5 py-1 rounded-lg bg-surface-container font-label-sm text-label-sm font-bold text-on-surface hover:bg-surface-container-high transition-colors" type="button">Rp {total.toLocaleString('id-ID')}</button>
          <button className="px-2.5 py-1 rounded-lg bg-surface-container font-label-sm text-label-sm font-bold text-on-surface hover:bg-surface-container-high transition-colors" type="button">Rp 150.000</button>
          <button className="px-2.5 py-1 rounded-lg bg-surface-container font-label-sm text-label-sm font-bold text-on-surface hover:bg-surface-container-high transition-colors" type="button">Rp 200.000</button>
        </div>
      </div>
    </div>
  );
}
