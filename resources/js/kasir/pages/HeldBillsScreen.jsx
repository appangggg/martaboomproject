import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PosHeader from '../components/layout/PosHeader';

export default function HeldBillsScreen() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    const mockBills = [
        {
            id: '039',
            customer: 'Pak Joko',
            type: 'takeaway',
            typeLabel: 'Bungkus',
            typeIcon: 'shopping_bag',
            time: '19:30 WIB (12 menit lalu)',
            priority: true,
            totalItems: 3,
            totalPrice: 152000,
            note: 'Menunggu uang pas / ambil tunai di ATM sebelah Mandiri.',
            items: [
                {
                    qty: 2,
                    name: 'Martabak Telur Spesial Sapi',
                    price: 110000,
                    options: [
                        { text: 'Pedas Sedang', color: 'bg-tertiary' },
                        { text: '3 Telur Bebek Super', color: 'bg-primary-container' }
                    ]
                },
                {
                    qty: 1,
                    name: 'Terang Bulan Pandan Jagung Keju',
                    price: 42000,
                    options: [
                        { text: 'Mentega Wijsman Wangi', color: 'bg-secondary' }
                    ]
                }
            ]
        },
        {
            id: '040',
            customer: 'Bu Rina',
            type: 'dinein',
            typeLabel: 'Meja 4',
            typeIcon: 'table_restaurant',
            time: '19:35 WIB (7 menit lalu)',
            priority: false,
            totalItems: 3,
            totalPrice: 59000,
            note: 'Mau tambah pesanan martabak tipker coklat kacang nanti setelah makan.',
            items: [
                {
                    qty: 1,
                    name: 'Terang Bulan Red Velvet Keju',
                    price: 45000,
                    options: [
                        { text: 'Gula Setengah (Less Sugar)', color: 'bg-error' },
                        { text: 'Cream Cheese Topping', color: 'bg-secondary' }
                    ]
                },
                {
                    qty: 2,
                    name: 'Es Teh Manis Jumbo',
                    price: 14000,
                    options: [
                        { text: 'Es batu dipisah 1', color: 'bg-tertiary' }
                    ]
                }
            ]
        },
        {
            id: '041',
            customer: 'Ojol GrabFood',
            type: 'takeaway',
            typeLabel: 'Rudi',
            typeIcon: 'two_wheeler',
            time: '19:39 WIB (3 menit lalu)',
            priority: false,
            isDriver: true,
            totalItems: 2,
            totalPrice: 68000,
            note: 'Menunggu konfirmasi topping dari pelanggan via chat aplikasi ojol.',
            items: [
                {
                    qty: 1,
                    name: 'Martabak Telur Ayam Jamur',
                    price: 43000,
                    options: [
                        { text: 'Kuah Kari Manis Ekstra', color: 'bg-primary-container' }
                    ]
                },
                {
                    qty: 1,
                    name: 'Tipker Coklat Kacang',
                    price: 25000,
                    options: [
                        { text: 'Garing Ekstra Kering', color: 'bg-secondary' }
                    ]
                }
            ]
        }
    ];

    const filteredBills = mockBills.filter(bill => {
        const matchesFilter = filter === 'all' || bill.type === filter;
        const matchesSearch = bill.customer.toLowerCase().includes(search.toLowerCase()) || bill.id.includes(search);
        return matchesFilter && matchesSearch;
    });

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID').format(number);

    return (
        <div className="bg-background font-body-md text-on-surface antialiased min-h-screen select-none">
            <PosHeader />
            
            <main className="w-full pt-20 bg-background">
                <div className="flex flex-col w-full px-space-lg py-space-md gap-space-lg">
                    {/* Sub-bar Operasional Kasir & Filter Cepat */}
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md bg-surface-container-low p-space-md rounded-[20px] shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-space-md">
                            <div className="flex items-center gap-space-sm">
                                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-sm shrink-0">
                                    <span className="material-symbols-outlined text-[28px]" style={{fontVariationSettings: "'FILL' 1"}}>pause_circle</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-space-xs">
                                        <h1 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">Daftar Pesanan Ditahan</h1>
                                        <span className="bg-secondary text-on-secondary font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider">HOLD BILLS</span>
                                    </div>
                                    <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                                        <span className="inline-block w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                                        3 Pesanan Menunggu Diproses / Pembayaran Ditunda
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Search & Type Filters */}
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-space-sm">
                            <div className="relative w-full sm:w-72">
                                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
                                <input 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full h-12 pl-11 pr-4 bg-surface-container-lowest rounded-full font-body-md text-body-md text-on-surface placeholder:text-outline shadow-inner focus:outline-none focus:ring-2 focus:ring-primary-container transition-all" 
                                    placeholder="Cari nama atau #antrean..." 
                                    type="text" 
                                />
                            </div>
                            
                            <div className="flex items-center bg-surface-container-highest/60 p-1 rounded-full gap-1 shrink-0">
                                <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-full font-label-md text-label-md transition-all duration-150 ${filter === 'all' ? 'bg-primary-container text-on-primary font-bold shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
                                    Semua (3)
                                </button>
                                <button onClick={() => setFilter('takeaway')} className={`px-4 py-2 rounded-full font-label-md text-label-md transition-all duration-150 ${filter === 'takeaway' ? 'bg-primary-container text-on-primary font-bold shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
                                    Bungkus (2)
                                </button>
                                <button onClick={() => setFilter('dinein')} className={`px-4 py-2 rounded-full font-label-md text-label-md transition-all duration-150 ${filter === 'dinein' ? 'bg-primary-container text-on-primary font-bold shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
                                    Makan di Tempat (1)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Grid Utama Kartu Pesanan Ditahan */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-lg items-stretch">
                        {filteredBills.map((bill) => (
                            <div key={bill.id} className="flex flex-col justify-between bg-surface-container-lowest rounded-[20px] p-space-lg shadow-[0_4px_16px_-2px_rgba(62,35,19,0.06),0_2px_6px_-1px_rgba(62,35,19,0.04)] hover:shadow-xl transition-all duration-200">
                                <div className="flex flex-col gap-space-md">
                                    {/* Header Kartu */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-space-xs">
                                            <div className="bg-secondary-container text-on-secondary-container font-headline-md text-headline-md px-3.5 py-1.5 rounded-full font-extrabold shadow-sm">
                                                #{bill.id}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-title-lg text-title-lg text-on-surface font-extrabold">{bill.customer}</span>
                                                    <span className={`inline-flex items-center gap-1 font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-bold ${bill.isDriver ? 'bg-tertiary-container/30 text-on-tertiary-container' : (bill.type === 'dinein' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-surface-container-high text-on-surface-variant')}`}>
                                                        <span className="material-symbols-outlined text-[14px]">{bill.typeIcon}</span> {bill.typeLabel}
                                                    </span>
                                                </div>
                                                <p className="font-label-sm text-label-sm text-outline flex items-center gap-1 mt-0.5">
                                                    <span className="material-symbols-outlined text-[15px]">schedule</span> {bill.time}
                                                </p>
                                            </div>
                                        </div>
                                        {bill.priority && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold animate-pulse">
                                                Prioritas
                                            </span>
                                        )}
                                        {!bill.priority && bill.type === 'dinein' && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">
                                                Santai
                                            </span>
                                        )}
                                        {bill.isDriver && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                                                Driver Standby
                                            </span>
                                        )}
                                    </div>

                                    {/* Daftar Menu */}
                                    <div className="bg-surface-container-low rounded-DEFAULT p-space-md flex flex-col gap-space-xs">
                                        {bill.items.map((item, idx) => (
                                            <React.Fragment key={idx}>
                                                <div className="flex justify-between items-start font-body-md text-body-md text-on-surface">
                                                    <div>
                                                        <span className="font-bold text-primary">{item.qty}x</span> {item.name}
                                                        <div className="pl-4 font-label-sm text-label-sm text-on-surface-variant flex flex-col gap-0.5 mt-0.5">
                                                            {item.options.map((opt, oIdx) => (
                                                                <span key={oIdx} className="flex items-center gap-1">
                                                                    <span className={`w-1.5 h-1.5 rounded-full ${opt.color}`}></span> {opt.text}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <span className="font-label-md text-label-md font-semibold text-on-surface-variant">Rp {formatRupiah(item.price)}</span>
                                                </div>
                                                {idx < bill.items.length - 1 && <div className="h-px bg-surface-container-highest my-1"></div>}
                                            </React.Fragment>
                                        ))}
                                    </div>

                                    {/* Catatan */}
                                    <div className={`flex items-start gap-2 p-2.5 rounded-DEFAULT ${bill.isDriver ? 'bg-secondary-fixed/50 text-on-secondary-fixed' : (bill.type === 'dinein' ? 'bg-primary-fixed/40 text-on-primary-fixed' : 'bg-secondary-fixed/50 text-on-secondary-fixed')}`}>
                                        <span className={`material-symbols-outlined text-[20px] shrink-0 mt-0.5 ${bill.type === 'dinein' ? 'text-primary' : 'text-secondary'}`}>
                                            {bill.isDriver ? 'chat' : (bill.type === 'dinein' ? 'edit_note' : 'info')}
                                        </span>
                                        <p className="font-label-md text-label-md leading-snug">
                                            <strong className={`font-bold ${bill.type === 'dinein' ? 'text-primary' : 'text-secondary'}`}>Catatan:</strong> {bill.note}
                                        </p>
                                    </div>
                                </div>

                                {/* Footer & Aksi */}
                                <div className="flex flex-col gap-space-md pt-space-md">
                                    <div className="flex items-baseline justify-between pt-1">
                                        <span className="font-label-md text-label-md text-on-surface-variant uppercase font-bold tracking-wider">Total Tagihan ({bill.totalItems} Item)</span>
                                        <span className="font-headline-md text-headline-md text-primary font-black tracking-tight">Rp {formatRupiah(bill.totalPrice)}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <button className="w-14 h-14 rounded-DEFAULT bg-surface-container flex items-center justify-center text-error hover:bg-error-container hover:text-on-error-container active:scale-95 transition-all shrink-0" title="Batalkan Transaksi">
                                            <span className="material-symbols-outlined text-[24px]">delete</span>
                                        </button>
                                        
                                        {!bill.isDriver && bill.type !== 'dinein' && (
                                            <button className="h-14 px-3.5 rounded-DEFAULT bg-surface-container-high text-on-surface flex items-center justify-center gap-1.5 font-label-md text-label-md font-bold hover:bg-surface-variant active:scale-95 transition-all shrink-0" title="Cetak Slip Sementara">
                                                <span className="material-symbols-outlined text-[20px]">print</span>
                                                <span className="hidden sm:inline">Cetak</span>
                                            </button>
                                        )}
                                        
                                        {bill.type === 'dinein' && (
                                            <button className="h-14 px-3.5 rounded-DEFAULT bg-surface-container-high text-on-surface flex items-center justify-center gap-1.5 font-label-md text-label-md font-bold hover:bg-surface-variant active:scale-95 transition-all shrink-0" title="Tambah Menu ke Order">
                                                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                                                <span className="hidden sm:inline">Tambah Menu</span>
                                            </button>
                                        )}

                                        <button onClick={() => navigate('/order')} className="flex-1 h-14 rounded-DEFAULT bg-primary-container text-on-primary flex items-center justify-center gap-2 font-label-lg text-label-lg font-extrabold shadow-[0_4px_12px_rgba(217,142,63,0.35)] hover:bg-primary active:scale-95 transition-all">
                                            <span className="material-symbols-outlined text-[24px]" style={{fontVariationSettings: "'FILL' 1"}}>play_arrow</span>
                                            <span>{bill.isDriver ? 'Lanjutkan Transaksi' : 'Lanjutkan'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Floating Summary & Quick Actions Dock */}
                    <div className="sticky bottom-4 z-20 w-full bg-surface-container-low/95 backdrop-blur-md rounded-[20px] p-space-md shadow-[0_10px_24px_-4px_rgba(62,35,19,0.12)] flex flex-col md:flex-row items-center justify-between gap-space-md">
                        <div className="flex items-center gap-space-md w-full md:w-auto justify-between md:justify-start">
                            <div className="flex items-center gap-space-sm">
                                <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed shadow-sm">
                                    <span className="material-symbols-outlined text-[26px]">account_balance_wallet</span>
                                </div>
                                <div>
                                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Total Nilai Tertahan</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-headline-lg text-headline-lg font-black text-primary tracking-tight">Rp 279.000</span>
                                        <span className="font-label-md text-label-md text-on-surface-variant font-semibold">(8 Item Tertunda)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-full">
                                <span className="material-symbols-outlined text-secondary text-[18px]">timelapse</span>
                                <span className="font-label-sm text-label-sm text-on-surface font-semibold">Tertua: 12 menit</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-space-sm w-full md:w-auto">
                            <button onClick={() => navigate('/order')} className="flex-1 md:flex-initial h-14 px-space-lg rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center gap-2 font-label-lg text-label-lg font-bold hover:bg-surface-variant active:scale-95 transition-all shadow-sm">
                                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                                <span>Kembali ke Kasir</span>
                            </button>
                            <button onClick={() => navigate('/order')} className="flex-1 md:flex-initial h-14 px-space-lg rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center gap-2 font-label-lg text-label-lg font-extrabold hover:bg-secondary-fixed active:scale-95 transition-all shadow-[0_4px_12px_rgba(121,89,0,0.18)]">
                                <span className="material-symbols-outlined text-[22px]">pause</span>
                                <span>Tahan Pesanan Baru (+)</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
