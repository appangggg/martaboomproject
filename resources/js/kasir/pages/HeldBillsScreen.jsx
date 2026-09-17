import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PosHeader from '../components/layout/PosHeader';

export default function HeldBillsScreen() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    const [mockBills, setMockBills] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBills = async () => {
            setIsLoading(true);
            try {
                // If you have window.apiClient:
                const response = await window.apiClient.get('/transactions/pending');
                if (response.status === 'success') {
                    setMockBills(response.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBills();
    }, []);

    const filteredBills = mockBills.filter(bill => {
        const matchesFilter = filter === 'all' || (bill.orderType && bill.orderType.toLowerCase().includes(filter)) || (bill.type && bill.type === filter) || bill.id.includes(filter);
        const customerSafe = bill.customerName || bill.customer || '';
        const matchesSearch = customerSafe.toLowerCase().includes(search.toLowerCase()) || bill.id.includes(search);
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
                                        {mockBills.length} Pesanan Menunggu Diproses / Pembayaran Ditunda
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
                                    Semua ({mockBills.length})
                                </button>
                                <button onClick={() => setFilter('takeaway')} className={`px-4 py-2 rounded-full font-label-md text-label-md transition-all duration-150 ${filter === 'takeaway' ? 'bg-primary-container text-on-primary font-bold shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
                                    Bungkus
                                </button>
                                <button onClick={() => setFilter('dinein')} className={`px-4 py-2 rounded-full font-label-md text-label-md transition-all duration-150 ${filter === 'dinein' ? 'bg-primary-container text-on-primary font-bold shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
                                    Makan di Tempat
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Grid Utama Kartu Pesanan Ditahan */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-lg items-stretch">
                        {isLoading ? (
                            <div className="text-center col-span-full py-12 font-bold text-on-surface-variant">Memuat pesanan ditahan...</div>
                        ) : filteredBills.length === 0 ? (
                            <div className="text-center col-span-full py-12 font-bold text-on-surface-variant">Tidak ada pesanan ditahan.</div>
                        ) : (
                            filteredBills.map((bill) => {
                                const customerName = bill.customerName || bill.customer || 'Pelanggan';
                                const queueNumber = bill.queueNumber || bill.id;
                                const orderType = bill.orderType || bill.typeLabel || 'Bungkus';
                                const totalPrice = bill.totalPrice || bill.totalAmount || 0;
                                const totalItems = bill.totalItems || (bill.items ? bill.items.reduce((acc, i) => acc + i.qty, 0) : 0);

                                return (
                                    <div key={bill.id} className={`flex flex-col justify-between bg-surface-container-lowest rounded-[20px] p-space-lg shadow-[0_4px_16px_-2px_rgba(62,35,19,0.06),0_2px_6px_-1px_rgba(62,35,19,0.04)] hover:shadow-xl transition-all duration-200 ${bill.priority === 'Prioritas' ? 'border-2 border-tertiary/40' : ''}`}>
                                        <div className="flex flex-col gap-space-md">
                                            {/* Header Kartu */}
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-center gap-space-xs">
                                                    <div className="bg-secondary-container text-on-secondary-container font-headline-md text-headline-md px-3.5 py-1.5 rounded-full font-extrabold shadow-sm">
                                                        #{queueNumber}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-title-lg text-title-lg text-on-surface font-extrabold">{customerName}</span>
                                                            <span className={`inline-flex items-center gap-1 font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-bold ${bill.isDriver ? 'bg-tertiary-container/30 text-on-tertiary-container' : (orderType.toLowerCase().includes('meja') ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-surface-container-high text-on-surface-variant')}`}>
                                                                <span className="material-symbols-outlined text-[14px]">
                                                                    {orderType.toLowerCase() === 'bungkus' ? 'shopping_bag' : orderType.toLowerCase().includes('meja') ? 'table_restaurant' : 'two_wheeler'}
                                                                </span> 
                                                                {orderType}
                                                            </span>
                                                        </div>
                                                        <p className="font-label-sm text-label-sm text-outline flex items-center gap-1 mt-0.5">
                                                            <span className="material-symbols-outlined text-[15px]">schedule</span> {bill.time || 'Baru saja'}
                                                        </p>
                                                    </div>
                                                </div>
                                                {bill.priority === 'Prioritas' && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold animate-pulse">
                                                        Prioritas
                                                    </span>
                                                )}
                                                {bill.priority === 'Santai' && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">
                                                        Santai
                                                    </span>
                                                )}
                                                {bill.priority === 'Driver Standby' && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                                                        Driver Standby
                                                    </span>
                                                )}
                                            </div>

                                            {/* Daftar Menu */}
                                            <div className="bg-surface-container-low rounded-DEFAULT p-space-md flex flex-col gap-space-xs">
                                                {bill.items && bill.items.map((item, idx) => (
                                                    <React.Fragment key={idx}>
                                                        <div className="flex justify-between items-start font-body-md text-body-md text-on-surface">
                                                            <div>
                                                                <span className="font-bold text-primary">{item.qty}x</span> {item.name}
                                                                {item.options && item.options.length > 0 && (
                                                                    <div className="pl-4 font-label-sm text-label-sm text-on-surface-variant flex flex-col gap-0.5 mt-0.5">
                                                                        {item.options.map((opt, oIdx) => (
                                                                            <span key={oIdx} className="flex items-center gap-1">
                                                                                <span className={`w-1.5 h-1.5 rounded-full ${opt.color || 'bg-primary'}`}></span> {opt.text || opt}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                {item.notes && item.notes.length > 0 && (
                                                                    <div className="flex flex-wrap gap-1.5 mt-1.5 pl-4">
                                                                        {item.notes.map((note, j) => (
                                                                            <span key={j} className="flex items-center gap-1 text-[11px] font-bold text-on-surface-variant px-1.5 py-0.5 rounded bg-surface-variant/30">
                                                                                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                                                                {note}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <span className="font-label-md text-label-md font-semibold text-on-surface-variant">Rp {formatRupiah(item.price)}</span>
                                                        </div>
                                                        {idx < bill.items.length - 1 && <div className="h-px bg-surface-container-highest my-1"></div>}
                                                    </React.Fragment>
                                                ))}
                                            </div>

                                            {/* Catatan */}
                                            {bill.note && (
                                                <div className="flex items-start gap-2 p-2.5 rounded-DEFAULT bg-secondary-fixed/50 text-on-secondary-fixed">
                                                    <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5 text-secondary">info</span>
                                                    <p className="font-label-md text-label-md leading-snug">
                                                        <strong className="font-bold text-secondary">Catatan:</strong> {bill.note}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer & Aksi */}
                                        <div className="flex flex-col gap-space-md pt-space-md">
                                            <div className="flex items-baseline justify-between pt-1">
                                                <span className="font-label-md text-label-md text-on-surface-variant uppercase font-bold tracking-wider">Total Tagihan ({totalItems} Item)</span>
                                                <span className="font-headline-md text-headline-md text-primary font-black tracking-tight">Rp {formatRupiah(totalPrice)}</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <button className="w-14 h-14 rounded-DEFAULT bg-surface-container flex items-center justify-center text-error hover:bg-error-container hover:text-on-error-container active:scale-95 transition-all shrink-0" title="Batalkan Transaksi">
                                                    <span className="material-symbols-outlined text-[24px]">delete</span>
                                                </button>
                                                
                                                <button onClick={() => navigate('/order')} className="flex-1 h-14 rounded-DEFAULT bg-primary-container text-on-primary flex items-center justify-center gap-2 font-label-lg text-label-lg font-extrabold shadow-[0_4px_12px_rgba(217,142,63,0.35)] hover:bg-primary active:scale-95 transition-all">
                                                    <span className="material-symbols-outlined text-[24px]" style={{fontVariationSettings: "'FILL' 1"}}>play_arrow</span>
                                                    <span>Lanjutkan</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
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
                                        <span className="font-headline-lg text-headline-lg font-black text-primary tracking-tight">
                                            Rp {formatRupiah(mockBills.reduce((acc, bill) => acc + (bill.totalPrice || bill.totalAmount || 0), 0))}
                                        </span>
                                        <span className="font-body-md text-body-md text-on-secondary-container/70 font-normal">
                                            ({mockBills.reduce((acc, bill) => acc + (bill.totalItems || (bill.items ? bill.items.reduce((iAcc, item) => iAcc + item.qty, 0) : 0)), 0)} Item Tertunda)
                                        </span>
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
