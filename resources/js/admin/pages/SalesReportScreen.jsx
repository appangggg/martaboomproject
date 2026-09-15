import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SalesReportScreen() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    branch_id: '',
    status: '',
    start_date: '',
    end_date: ''
  });

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.branch_id) queryParams.append('branch_id', filters.branch_id);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.start_date) queryParams.append('start_date', filters.start_date);
      if (filters.end_date) queryParams.append('end_date', filters.end_date);

      const res = await axios.get(`/api/admin/transactions?${queryParams.toString()}`);
      if (res.data.status === 'success') {
        setTransactions(res.data.data.data); // data.data because it's paginated
      }
    } catch (err) {
      console.error("Error fetching transactions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const openModal = (transaction) => {
    setModalData(transaction);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Top Banner */}
      <section className="flex flex-col gap-space-md pt-space-md mb-space-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md">
          <div className="flex flex-col">
            <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">Laporan Transaksi Kasir</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Laporan dan detail transaksi yang tersinkronisasi langsung dari seluruh cabang.</p>
          </div>
          <div className="flex items-center gap-space-sm">
            <button 
              onClick={fetchTransactions}
              className="flex items-center gap-space-xs px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md shadow-sm transition-all" 
            >
              <span className="material-symbols-outlined text-[18px]">sync</span>
              <span>Segarkan</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-wrap items-end gap-space-md">
          <div className="flex flex-col gap-1 w-48">
            <label className="font-label-sm text-label-sm text-on-surface-variant">Status Pembayaran</label>
            <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full h-10 px-3 bg-surface-container-low rounded-lg text-on-surface">
              <option value="">Semua Status</option>
              <option value="paid">Lunas (Paid)</option>
              <option value="pending">Menunggu (Pending)</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-48">
            <label className="font-label-sm text-label-sm text-on-surface-variant">Mulai Tanggal</label>
            <input type="date" name="start_date" value={filters.start_date} onChange={handleFilterChange} className="w-full h-10 px-3 bg-surface-container-low rounded-lg text-on-surface" />
          </div>
          <div className="flex flex-col gap-1 w-48">
            <label className="font-label-sm text-label-sm text-on-surface-variant">Sampai Tanggal</label>
            <input type="date" name="end_date" value={filters.end_date} onChange={handleFilterChange} className="w-full h-10 px-3 bg-surface-container-low rounded-lg text-on-surface" />
          </div>
        </div>
      </section>

      {/* Transactions Table */}
      <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
        {loading ? (
          <div className="p-8 text-center text-on-surface">Loading transactions...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-table text-body-table">
              <thead>
                <tr className="bg-surface-container-low text-on-surface font-label-sm text-label-sm">
                  <th className="py-4 px-4">Waktu Transaksi</th>
                  <th className="py-4 px-4">No. Order</th>
                  <th className="py-4 px-4">Cabang</th>
                  <th className="py-4 px-4">Kasir</th>
                  <th className="py-4 px-4">Pembayaran</th>
                  <th className="py-4 px-4 text-right">Total Transaksi</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y border-surface-container-high text-on-surface">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-on-surface-variant">Belum ada transaksi ditemukan.</td>
                  </tr>
                ) : (
                  transactions.map(trx => (
                    <tr key={trx.id} className="hover:bg-surface-container-low/70 transition-colors border-b border-surface-container-high">
                      <td className="py-3.5 px-4 font-medium whitespace-nowrap">{new Date(trx.created_at).toLocaleString('id-ID')}</td>
                      <td className="py-3.5 px-4 font-mono">#{trx.id}</td>
                      <td className="py-3.5 px-4">{trx.branch ? trx.branch.name : '-'}</td>
                      <td className="py-3.5 px-4">{trx.user ? trx.user.name : '-'}</td>
                      <td className="py-3.5 px-4 uppercase">{trx.payment_method || '-'}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-primary">Rp {trx.total.toLocaleString('id-ID')}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          trx.status === 'paid' ? 'bg-tertiary/20 text-tertiary' : 
                          trx.status === 'cancelled' ? 'bg-error/20 text-error' : 'bg-surface-container-highest text-on-surface'
                        }`}>
                          {trx.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button 
                          className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-primary hover:text-on-primary font-label-sm text-label-sm transition-colors"
                          onClick={() => openModal(trx)}
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Transaction Detail Modal */}
      {showModal && modalData && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-md rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            <div className="p-4 border-b border-surface-container-high flex items-center justify-between bg-surface-container-lowest">
              <div className="flex flex-col">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Detail Order #{modalData.id}</h3>
                <span className="text-xs text-on-surface-variant">{new Date(modalData.created_at).toLocaleString('id-ID')}</span>
              </div>
              <button className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant" onClick={closeModal}>
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex flex-col gap-4">
              <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-xs text-on-surface-variant">Cabang</span>
                  <span className="font-medium text-on-surface">{modalData.branch ? modalData.branch.name : '-'}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-xs text-on-surface-variant">Kasir</span>
                  <span className="font-medium text-on-surface">{modalData.user ? modalData.user.name : '-'}</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2 text-on-surface">Item Pesanan:</h4>
                <div className="flex flex-col gap-2">
                  {modalData.items && modalData.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-2 border-b border-surface-container-high last:border-0">
                      <div className="flex flex-col">
                        <span className="font-medium text-on-surface">{item.product ? item.product.name : 'Unknown Product'} x{item.quantity}</span>
                        {item.notes && <span className="text-xs text-on-surface-variant">Note: {item.notes}</span>}
                      </div>
                      <span className="font-semibold text-on-surface">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-2 flex flex-col gap-1 border-t border-surface-container-high pt-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span className="font-medium text-on-surface">Rp {modalData.subtotal.toLocaleString('id-ID')}</span>
                </div>
                {modalData.tax > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant">Pajak (PB1)</span>
                    <span className="font-medium text-on-surface">Rp {modalData.tax.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-lg mt-2 pt-2 border-t border-surface-container-high font-bold text-primary">
                  <span>Total Akhir</span>
                  <span>Rp {modalData.total.toLocaleString('id-ID')}</span>
                </div>
              </div>
              
              <div className="mt-2">
                <span className="text-xs text-on-surface-variant block mb-1">Metode Pembayaran:</span>
                <span className="px-2 py-1 rounded bg-surface-container-high font-medium text-sm text-on-surface uppercase inline-block">
                  {modalData.payment_method || '-'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
