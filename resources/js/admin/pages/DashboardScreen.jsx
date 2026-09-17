import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DashboardScreen() {
  const [stats, setStats] = useState({
    sales: { today: 0, trend: 0 },
    transactions: { today: 0, trend: 0 },
    waste: { today: 0 }, // Using this as void/waste for now
    recent_orders: []
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/dashboard');
      if (res.data.status === 'success') {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-medium">Memuat data dashboard...</div>;
  }

  // Get today's date formatted
  const today = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="flex flex-col w-full pb-8">
      
      {/* Header Area */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Dashboard</h1>
          <p className="text-sm text-slate-500">Ringkasan operasional hari ini</p>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-600 shadow-sm cursor-pointer hover:bg-gray-50">
          <span>{today}</span>
          <span className="material-symbols-outlined text-[16px]">calendar_today</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card 1: Total Pendapatan */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 font-medium mb-1">Total Pendapatan</span>
            <span className="text-2xl font-bold text-slate-800">Rp {stats.sales.today.toLocaleString('id-ID')}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
            <span className="material-symbols-outlined">payments</span>
          </div>
        </div>

        {/* Card 2: Total Transaksi */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 font-medium mb-1">Total Transaksi</span>
            <span className="text-2xl font-bold text-slate-800">{stats.transactions.today}</span>
            <span className="text-xs text-gray-400 mt-1">transaksi selesai</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
            <span className="material-symbols-outlined">receipt_long</span>
          </div>
        </div>

        {/* Card 3: Transaksi Void / Waste */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 font-medium mb-1">Bahan Terbuang (Waste)</span>
            <span className="text-2xl font-bold text-slate-800">Rp {stats.waste.today.toLocaleString('id-ID')}</span>
            <span className="text-xs text-gray-400 mt-1">tercatat hari ini</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center">
            <span className="material-symbols-outlined">monitoring</span>
          </div>
        </div>

      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700">Daftar Transaksi Terakhir</h2>
          <button onClick={fetchStats} className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">refresh</span> Segarkan
          </button>
        </div>
        
        {stats.recent_orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            Tidak ada transaksi pada hari ini
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-3 font-medium">Order ID</th>
                  <th className="px-6 py-3 font-medium">Cabang</th>
                  <th className="px-6 py-3 font-medium">Kasir</th>
                  <th className="px-6 py-3 font-medium text-right">Total</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-600">
                {stats.recent_orders.map(order => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">#{order.id}</td>
                    <td className="px-6 py-4">{order.branch ? order.branch.name : '-'}</td>
                    <td className="px-6 py-4">{order.user ? order.user.name : '-'}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 text-right">Rp {order.total.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'paid' 
                          ? 'bg-green-50 text-green-600' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {order.status === 'paid' ? 'Selesai' : order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
    </div>
  );
}
