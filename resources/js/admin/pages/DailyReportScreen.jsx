import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DailyReportScreen() {
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
    <div className="flex flex-col w-full pb-8">
      {/* Header Area */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Laporan Harian & Transaksi</h1>
          <p className="text-sm text-slate-500">Lihat semua riwayat transaksi dari seluruh cabang</p>
        </div>
        
        <button 
          onClick={fetchTransactions}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 shadow-sm transition-colors font-medium"
        >
          <span className="material-symbols-outlined text-[18px]">sync</span>
          Segarkan Data
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-wrap items-end gap-4 mb-8">
        <div className="flex flex-col gap-1.5 w-full sm:w-48">
          <label className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Status Pembayaran</label>
          <select 
            name="status" 
            value={filters.status} 
            onChange={handleFilterChange} 
            className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-slate-700 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="">Semua Status</option>
            <option value="paid">Lunas (Paid)</option>
            <option value="pending">Menunggu (Pending)</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5 w-full sm:w-48">
          <label className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Dari Tanggal</label>
          <input 
            type="date" 
            name="start_date" 
            value={filters.start_date} 
            onChange={handleFilterChange} 
            className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-slate-700 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" 
          />
        </div>
        <div className="flex flex-col gap-1.5 w-full sm:w-48">
          <label className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Sampai Tanggal</label>
          <input 
            type="date" 
            name="end_date" 
            value={filters.end_date} 
            onChange={handleFilterChange} 
            className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-slate-700 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" 
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium">Memuat data transaksi...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-4 font-medium">Waktu Transaksi</th>
                  <th className="px-6 py-4 font-medium">No. Order</th>
                  <th className="px-6 py-4 font-medium">Cabang</th>
                  <th className="px-6 py-4 font-medium">Kasir</th>
                  <th className="px-6 py-4 font-medium">Pembayaran</th>
                  <th className="px-6 py-4 font-medium text-right">Total Transaksi</th>
                  <th className="px-6 py-4 font-medium text-center">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-600">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-12 text-center text-gray-400">Belum ada transaksi ditemukan.</td>
                  </tr>
                ) : (
                  transactions.map(trx => (
                    <tr key={trx.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium whitespace-nowrap">{new Date(trx.created_at).toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 font-mono font-medium text-slate-800">#{trx.id}</td>
                      <td className="px-6 py-4">{trx.branch ? trx.branch.name : '-'}</td>
                      <td className="px-6 py-4">{trx.user ? trx.user.name : '-'}</td>
                      <td className="px-6 py-4 uppercase">{trx.payment_method || '-'}</td>
                      <td className="px-6 py-4 text-right font-bold text-slate-800">Rp {trx.total.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          trx.status === 'paid' ? 'bg-green-50 text-green-600' : 
                          trx.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {trx.status === 'paid' ? 'Selesai' : trx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          className="px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-primary/10 hover:text-primary text-gray-600 text-xs font-semibold transition-colors border border-gray-200 hover:border-primary/20"
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
      </div>

      {/* Transaction Detail Modal */}
      {showModal && modalData && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="font-bold text-slate-800 text-lg">Detail Order #{modalData.id}</h3>
                <span className="text-xs text-gray-500">{new Date(modalData.created_at).toLocaleString('id-ID')}</span>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors" onClick={closeModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex flex-col gap-6">
              <div className="flex justify-between items-center bg-gray-50 border border-gray-100 p-4 rounded-xl">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Cabang</span>
                  <span className="font-medium text-slate-800">{modalData.branch ? modalData.branch.name : '-'}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Kasir</span>
                  <span className="font-medium text-slate-800">{modalData.user ? modalData.user.name : '-'}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-700 mb-3 uppercase tracking-wider">Item Pesanan</h4>
                <div className="flex flex-col gap-3">
                  {modalData.items && modalData.items.map(item => (
                    <div key={item.id} className="flex justify-between items-start pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800">{item.product ? item.product.name : 'Unknown Product'} <span className="text-gray-400">x{item.quantity}</span></span>
                        {item.notes && <span className="text-xs text-gray-500 mt-1 bg-gray-100 px-2 py-1 rounded inline-block w-max">Note: {item.notes}</span>}
                      </div>
                      <span className="font-semibold text-slate-800">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-slate-800">Rp {modalData.subtotal.toLocaleString('id-ID')}</span>
                </div>
                {modalData.tax > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Pajak (PB1)</span>
                    <span className="font-medium text-slate-800">Rp {modalData.tax.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-lg mt-3 pt-3 border-t border-gray-200 font-bold text-primary">
                  <span>Total Akhir</span>
                  <span>Rp {modalData.total.toLocaleString('id-ID')}</span>
                </div>
              </div>
              
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Metode Pembayaran</span>
                <span className="px-3 py-1.5 rounded-lg bg-gray-100 font-bold text-sm text-slate-700 uppercase inline-block border border-gray-200">
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
