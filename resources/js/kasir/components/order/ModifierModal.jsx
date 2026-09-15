import React, { useState, useEffect } from 'react';

export default function ModifierModal({ isOpen, onClose, product }) {
    const basePrice = product?.price || 35000;
    
    const [doughExtra, setDoughExtra] = useState(0);
    const [selectedToppings, setSelectedToppings] = useState({ keju: true, meses: true });
    const [quantity, setQuantity] = useState(1);
    const [quickTags, setQuickTags] = useState([]);
    
    // Default topping prices for calculation
    const toppingPrices = {
        keju: 8000,
        meses: 6000,
        kacang: 4000,
        wijen: 2000,
        pisang: 5000,
        nutella: 10000
    };

    const toppingsTotal = Object.entries(selectedToppings).reduce((total, [key, isSelected]) => {
        return isSelected ? total + toppingPrices[key] : total;
    }, 0);

    const singlePrice = basePrice + doughExtra + toppingsTotal;
    const totalPrice = singlePrice * quantity;
    const formattedPrice = 'Rp ' + totalPrice.toLocaleString('id-ID');

    const handleToppingToggle = (topping, price) => {
        setSelectedToppings(prev => ({
            ...prev,
            [topping]: !prev[topping]
        }));
    };

    const handleTagToggle = (tag) => {
        setQuickTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            {/* TOUCH-OPTIMIZED MODAL CONTAINER (750px Wide for landscape terminal) */}
            <div className="relative w-full max-w-[760px] max-h-[942px] flex flex-col bg-surface rounded-lg shadow-[0_24px_48px_-8px_rgba(70,42,25,0.30)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                {/* MODAL HEADER */}
                <div className="px-space-lg py-space-md bg-surface-container-low flex items-center justify-between shrink-0 shadow-sm z-10">
                    <div className="flex items-center gap-space-md">
                        {/* Item Golden Honeycomb Pores Thumbnail */}
                        <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 shadow-sm ring-2 ring-primary-container/40">
                            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSETv_k8f4nDX5uuYRe0P1zR-ty9Lqi3Qen3d81avK0Yh3nK2Wb5S8HWcVc23qcwym7XzPEySeqAefQTQR5QfLghqp4QGudcaQ9OteEJ8v8dKYHxzyP_4-gqKhwlS4qK0w9SWD63x83C85aCx7e126fW4kz_5f0eXDVzYISs7qLUTbbWrc4BzDr-y-eppXhRng1ybJ7pivRw9ely977AAE17G7xngj8M18MhIInPVq4rkxKrWgUOla" alt="Product" />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <h2 className="font-headline-md text-headline-md text-on-surface leading-tight">{product?.name || "Terang Bulan Spesial"}</h2>
                                <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold">Base 28cm</span>
                            </div>
                            <div className="flex items-center gap-space-sm mt-0.5">
                                <span className="font-title-md text-title-md text-primary font-bold">Rp {basePrice.toLocaleString('id-ID')}</span>
                                <span className="text-outline text-xs">•</span>
                                <span className="font-body-md text-body-md text-on-surface-variant">Pilih adonan, topping & catatan masak</span>
                            </div>
                        </div>
                    </div>
                    {/* Touch-Friendly Close Button [X] */}
                    <button onClick={onClose} aria-label="Tutup Modul Modifikasi" className="w-12 h-12 rounded-full bg-surface-container-high hover:bg-surface-variant active:scale-90 text-on-surface-variant flex items-center justify-center transition-all duration-150 shrink-0" type="button">
                        <span className="material-symbols-outlined text-[24px]">close</span>
                    </button>
                </div>

                {/* MODAL SCROLLABLE BODY WITH TOUCH-FRIENDLY OPTIONS */}
                <div className="flex-1 overflow-y-auto p-space-lg space-y-space-lg">
                    {/* BAGIAN 1: PILIH ADONAN / BASE (Single Select) */}
                    <section className="space-y-space-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-sm text-label-sm font-bold">1</span>
                                <h3 className="font-title-lg text-title-lg text-on-surface uppercase tracking-tight">Pilih Adonan / Base</h3>
                            </div>
                            <span className="font-label-sm text-label-sm uppercase text-primary font-bold bg-primary-fixed px-2.5 py-1 rounded-full">Wajib Pilih 1</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-space-sm">
                            <button onClick={() => setDoughExtra(0)} className={`dough-chip group h-14 px-space-md rounded-full text-left flex items-center justify-between shadow-sm transition-all duration-150 active:scale-[0.98] ${doughExtra === 0 ? 'bg-primary-fixed text-on-primary-fixed shadow-md' : 'bg-surface-container-lowest'}`} type="button">
                                <div className="flex items-center gap-3">
                                    <span className={`dough-icon material-symbols-outlined text-[22px] ${doughExtra === 0 ? 'text-primary' : 'text-on-surface-variant'}`} style={{fontVariationSettings: doughExtra === 0 ? "'FILL' 1" : "'FILL' 0"}}>
                                        {doughExtra === 0 ? 'radio_button_checked' : 'radio_button_unchecked'}
                                    </span>
                                    <span className="font-label-lg text-label-lg font-bold">Original Klasik</span>
                                </div>
                                <span className="font-label-md text-label-md text-primary font-extrabold bg-surface px-2 py-0.5 rounded-full">Default</span>
                            </button>
                            
                            <button onClick={() => setDoughExtra(4000)} className={`dough-chip group h-14 px-space-md rounded-full text-left flex items-center justify-between shadow-sm transition-all duration-150 active:scale-[0.98] ${doughExtra === 4000 ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant hover:bg-tertiary-fixed-dim'}`} type="button">
                                <div className="flex items-center gap-3">
                                    <span className={`dough-icon material-symbols-outlined text-[22px] ${doughExtra === 4000 ? 'text-primary' : 'text-tertiary'}`}>
                                        {doughExtra === 4000 ? 'radio_button_checked' : 'radio_button_unchecked'}
                                    </span>
                                    <div className="flex flex-col">
                                        <span className="font-label-lg text-label-lg font-bold text-on-tertiary-container">Pandan Wangi Asli</span>
                                        <span className="font-label-sm text-label-sm text-tertiary">Ekstrak Daun Suji</span>
                                    </div>
                                </div>
                                <span className="font-label-md text-label-md font-bold bg-surface/80 px-2 py-0.5 rounded-full text-tertiary">+Rp 4.000</span>
                            </button>
                            
                            <button onClick={() => setDoughExtra(6000)} className={`dough-chip group h-14 px-space-md rounded-full text-left flex items-center justify-between shadow-sm transition-all duration-150 active:scale-[0.98] ${doughExtra === 6000 ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-error-container text-on-error-container hover:bg-error-container/80'}`} type="button">
                                <div className="flex items-center gap-3">
                                    <span className={`dough-icon material-symbols-outlined text-[22px] ${doughExtra === 6000 ? 'text-primary' : 'text-error'}`}>
                                        {doughExtra === 6000 ? 'radio_button_checked' : 'radio_button_unchecked'}
                                    </span>
                                    <div className="flex flex-col">
                                        <span className="font-label-lg text-label-lg font-bold text-error">Red Velvet Gourmet</span>
                                        <span className="font-label-sm text-label-sm text-on-error-container/80">Aroma Vanila Cokelat</span>
                                    </div>
                                </div>
                                <span className="font-label-md text-label-md font-bold bg-surface/80 px-2 py-0.5 rounded-full text-error">+Rp 6.000</span>
                            </button>
                            
                            <button onClick={() => setDoughExtra(5000)} className={`dough-chip group h-14 px-space-md rounded-full text-left flex items-center justify-between shadow-sm transition-all duration-150 active:scale-[0.98] ${doughExtra === 5000 ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'}`} type="button">
                                <div className="flex items-center gap-3">
                                    <span className={`dough-icon material-symbols-outlined text-[22px] ${doughExtra === 5000 ? 'text-primary' : 'text-on-surface-variant'}`}>
                                        {doughExtra === 5000 ? 'radio_button_checked' : 'radio_button_unchecked'}
                                    </span>
                                    <div className="flex flex-col">
                                        <span className="font-label-lg text-label-lg font-bold text-on-surface">Black Charcoal</span>
                                        <span className="font-label-sm text-label-sm text-on-surface-variant">Bambu Jepang Alami</span>
                                    </div>
                                </div>
                                <span className="font-label-md text-label-md font-bold bg-surface px-2 py-0.5 rounded-full text-on-surface-variant">+Rp 5.000</span>
                            </button>
                        </div>
                    </section>
                    
                    {/* BAGIAN 2: PILIH TOPPING (Multi Select Pills) */}
                    <section className="space-y-space-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-label-sm text-label-sm font-bold">2</span>
                                <h3 className="font-title-lg text-title-lg text-on-surface uppercase tracking-tight">Pilih Topping</h3>
                            </div>
                            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold bg-surface-container-high px-2.5 py-1 rounded-full">Bisa Lebih Dari Satu</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-space-sm">
                            <button onClick={() => handleToppingToggle('keju')} className={`topping-card p-space-sm h-16 rounded-lg flex items-center justify-between transition-all duration-150 active:scale-[0.98] shadow-sm ${selectedToppings.keju ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'}`} type="button">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${selectedToppings.keju ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'}`}>
                                        <span className="material-symbols-outlined text-[20px]">{selectedToppings.keju ? 'check' : 'add'}</span>
                                    </div>
                                    <div className="text-left flex flex-col">
                                        <span className="font-title-md text-title-md font-bold leading-tight">Keju Cheddar Kraft</span>
                                        <span className={`font-label-sm text-label-sm ${selectedToppings.keju ? 'text-on-secondary-fixed-variant' : 'text-on-surface-variant'}`}>Parutan Melimpah</span>
                                    </div>
                                </div>
                                <span className={`font-title-md text-title-md font-extrabold shrink-0 ${selectedToppings.keju ? 'text-on-secondary-fixed' : 'text-primary'}`}>+Rp 8.000</span>
                            </button>
                            
                            <button onClick={() => handleToppingToggle('meses')} className={`topping-card p-space-sm h-16 rounded-lg flex items-center justify-between transition-all duration-150 active:scale-[0.98] shadow-sm ${selectedToppings.meses ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'}`} type="button">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${selectedToppings.meses ? 'bg-primary-container text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                                        <span className="material-symbols-outlined text-[20px]">{selectedToppings.meses ? 'check' : 'add'}</span>
                                    </div>
                                    <div className="text-left flex flex-col">
                                        <span className="font-title-md text-title-md font-bold leading-tight">Meses Cokelat Ceres</span>
                                        <span className={`font-label-sm text-label-sm ${selectedToppings.meses ? 'text-on-primary-fixed-variant' : 'text-on-surface-variant'}`}>Cokelat Murni Wangi</span>
                                    </div>
                                </div>
                                <span className={`font-title-md text-title-md font-extrabold shrink-0 ${selectedToppings.meses ? 'text-on-primary-fixed' : 'text-primary'}`}>+Rp 6.000</span>
                            </button>
                            
                            <button onClick={() => handleToppingToggle('kacang')} className={`topping-card p-space-sm h-16 rounded-lg flex items-center justify-between transition-all duration-150 active:scale-[0.98] shadow-sm ${selectedToppings.kacang ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'}`} type="button">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${selectedToppings.kacang ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'}`}>
                                        <span className="material-symbols-outlined text-[20px]">{selectedToppings.kacang ? 'check' : 'add'}</span>
                                    </div>
                                    <div className="text-left flex flex-col">
                                        <span className="font-title-md text-title-md font-bold leading-tight">Kacang Sangrai Cincang</span>
                                        <span className={`font-label-sm text-label-sm ${selectedToppings.kacang ? 'text-on-secondary-fixed-variant' : 'text-on-surface-variant'}`}>Gurih Renyah</span>
                                    </div>
                                </div>
                                <span className={`font-title-md text-title-md font-extrabold shrink-0 ${selectedToppings.kacang ? 'text-on-secondary-fixed' : 'text-primary'}`}>+Rp 4.000</span>
                            </button>
                            
                            <button onClick={() => handleToppingToggle('wijen')} className={`topping-card p-space-sm h-16 rounded-lg flex items-center justify-between transition-all duration-150 active:scale-[0.98] shadow-sm ${selectedToppings.wijen ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'}`} type="button">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${selectedToppings.wijen ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'}`}>
                                        <span className="material-symbols-outlined text-[20px]">{selectedToppings.wijen ? 'check' : 'add'}</span>
                                    </div>
                                    <div className="text-left flex flex-col">
                                        <span className="font-title-md text-title-md font-bold leading-tight">Wijen Sangrai Gurih</span>
                                        <span className={`font-label-sm text-label-sm ${selectedToppings.wijen ? 'text-on-secondary-fixed-variant' : 'text-on-surface-variant'}`}>Aroma Wangi Toasted</span>
                                    </div>
                                </div>
                                <span className={`font-title-md text-title-md font-extrabold shrink-0 ${selectedToppings.wijen ? 'text-on-secondary-fixed' : 'text-primary'}`}>+Rp 2.000</span>
                            </button>
                            
                            <button onClick={() => handleToppingToggle('pisang')} className={`topping-card p-space-sm h-16 rounded-lg flex items-center justify-between transition-all duration-150 active:scale-[0.98] shadow-sm ${selectedToppings.pisang ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'}`} type="button">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${selectedToppings.pisang ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'}`}>
                                        <span className="material-symbols-outlined text-[20px]">{selectedToppings.pisang ? 'check' : 'add'}</span>
                                    </div>
                                    <div className="text-left flex flex-col">
                                        <span className="font-title-md text-title-md font-bold leading-tight">Pisang Raja Manis</span>
                                        <span className={`font-label-sm text-label-sm ${selectedToppings.pisang ? 'text-on-secondary-fixed-variant' : 'text-on-surface-variant'}`}>Irisan Matang Caramel</span>
                                    </div>
                                </div>
                                <span className={`font-title-md text-title-md font-extrabold shrink-0 ${selectedToppings.pisang ? 'text-on-secondary-fixed' : 'text-primary'}`}>+Rp 5.000</span>
                            </button>
                            
                            <button onClick={() => handleToppingToggle('nutella')} className={`topping-card p-space-sm h-16 rounded-lg flex items-center justify-between transition-all duration-150 active:scale-[0.98] shadow-sm ${selectedToppings.nutella ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'}`} type="button">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${selectedToppings.nutella ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'}`}>
                                        <span className="material-symbols-outlined text-[20px]">{selectedToppings.nutella ? 'check' : 'add'}</span>
                                    </div>
                                    <div className="text-left flex flex-col">
                                        <span className="font-title-md text-title-md font-bold leading-tight">Nutella Hazelnut Swirl</span>
                                        <span className={`font-label-sm text-label-sm ${selectedToppings.nutella ? 'text-on-secondary-fixed-variant' : 'text-on-surface-variant'}`}>Selai Cokelat Asli</span>
                                    </div>
                                </div>
                                <span className={`font-title-md text-title-md font-extrabold shrink-0 ${selectedToppings.nutella ? 'text-on-secondary-fixed' : 'text-primary'}`}>+Rp 10.000</span>
                            </button>
                        </div>
                    </section>

                    {/* BAGIAN 3: CATATAN KHUSUS KOKI (Kitchen Quick Instruction Tags) */}
                    <section className="space-y-space-sm pb-10">
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center font-label-sm text-label-sm font-bold">3</span>
                            <h3 className="font-title-lg text-title-lg text-on-surface uppercase tracking-tight">Catatan Khusus Koki</h3>
                        </div>
                        
                        {/* Fast Quick Tag Pills */}
                        <div className="flex flex-wrap gap-2">
                            {['Matang Kering', 'Mentega Wijsman Banyak', 'Mentega Sedikit', 'Potong 12 Kotak', 'Pisah Kuah / Top'].map(tag => (
                                <button 
                                    key={tag}
                                    onClick={() => handleTagToggle(tag)}
                                    className={`quick-tag h-10 px-4 rounded-full font-label-md text-label-md font-bold transition-all active:scale-95 ${quickTags.includes(tag) ? 'bg-secondary-fixed text-on-secondary-fixed-variant' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'}`}
                                    type="button"
                                >
                                    {quickTags.includes(tag) ? '✓ ' : ''}{tag}
                                </button>
                            ))}
                        </div>
                        
                        {/* Freeform Cashier Note Input */}
                        <div className="relative mt-2">
                            <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-outline text-[20px]">edit_note</span>
                            <input className="w-full h-12 pl-11 pr-4 rounded-lg bg-surface-container-low text-on-surface font-body-lg text-body-lg focus:outline-none focus:bg-surface-container-lowest focus:shadow-md transition-all placeholder:text-outline" placeholder="Ketik instruksi pelanggan tambahan..." type="text" />
                        </div>
                    </section>
                </div>

                {/* FOOTER MODAL: STEPPER & ADD TO CART ACTION */}
                <div className="p-space-lg bg-surface-container-low shrink-0 shadow-[0_-4px_16px_rgba(70,42,25,0.06)] flex items-center justify-between gap-space-lg">
                    {/* Touch Quantity Stepper */}
                    <div className="flex items-center bg-surface-container-lowest rounded-full p-1.5 shadow-sm">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Kurangi Jumlah" className="w-12 h-12 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center text-title-lg active:scale-90 transition-transform" type="button">
                            <span className="material-symbols-outlined text-[24px]">remove</span>
                        </button>
                        <div className="px-5 text-center min-w-[90px]">
                            <span className="font-title-lg text-title-lg text-on-surface font-extrabold block">{quantity} Porsi</span>
                        </div>
                        <button onClick={() => setQuantity(quantity + 1)} aria-label="Tambah Jumlah" className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-title-lg active:scale-90 transition-transform shadow-sm" type="button">
                            <span className="material-symbols-outlined text-[24px]">add</span>
                        </button>
                    </div>
                    
                    {/* Live Price Summary Pill (Glanceable) */}
                    <div className="hidden sm:flex flex-col text-right">
                        <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">Kalkulasi Cepat</span>
                        <span className="font-headline-md text-headline-md text-on-surface font-black">{formattedPrice}</span>
                    </div>
                    
                    {/* Sticky Large Caramel Add Button (60px high) */}
                    <button onClick={onClose} className="flex-1 max-w-[340px] h-[60px] bg-primary-container hover:bg-primary text-on-primary rounded-full px-space-lg flex items-center justify-between shadow-[0_8px_20px_rgba(217,142,63,0.35)] active:scale-[0.98] transition-all duration-150 cursor-pointer" type="button">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
                            <span className="font-title-lg text-title-lg font-bold">Tambah Pesanan</span>
                        </div>
                        <span className="font-title-lg text-title-lg font-extrabold bg-surface-container-lowest/20 px-3 py-1 rounded-full">{formattedPrice}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
