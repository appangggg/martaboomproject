import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DashboardScreen() {
  const [stats, setStats] = useState({
    sales: { today: 0, trend: 0 },
    transactions: { today: 0, trend: 0 },
    waste: { today: 0 },
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
    return <div className="p-8 text-center text-on-surface">Loading dashboard...</div>;
  }

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* System Alert Banner */}
      <div className="relative w-full rounded-xl bg-surface-container-high p-space-md shadow-sm mb-space-lg overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-container"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm pl-space-xs">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_sync</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface">Data Real-time Hari Ini</span>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Menampilkan data penjualan secara dinamis dari API.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-xs shrink-0 self-end sm:self-auto">
            <button onClick={fetchStats} className="px-3 py-1 rounded-lg bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-all font-label-md text-label-md flex items-center gap-1 shadow-sm">
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              Segarkan Data
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-space-xl">
        {/* Card 1 */}
        <div className="bg-surface rounded-xl p-4 border border-surface-container-high flex flex-col gap-2">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-medium text-sm">Total Penjualan Hari Ini</span>
            <span className="material-symbols-outlined text-[18px]">point_of_sale</span>
          </div>
          <div className="text-2xl font-bold text-on-surface">
            Rp {stats.sales.today.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className={`font-medium flex items-center ${stats.sales.trend >= 0 ? 'text-primary' : 'text-error'}`}>
              <span className="material-symbols-outlined text-[14px]">
                {stats.sales.trend >= 0 ? 'arrow_upward' : 'arrow_downward'}
              </span> 
              {Math.abs(stats.sales.trend)}%
            </span>
            <span className="text-on-surface-variant">vs Kemarin</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface rounded-xl p-4 border border-surface-container-high flex flex-col gap-2">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-medium text-sm">Total Transaksi Hari Ini</span>
            <span className="material-symbols-outlined text-[18px]">receipt</span>
          </div>
          <div className="text-2xl font-bold text-on-surface">{stats.transactions.today} Struk</div>
          <div className="flex items-center gap-1 text-sm">
            <span className={`font-medium flex items-center ${stats.transactions.trend >= 0 ? 'text-primary' : 'text-error'}`}>
              <span className="material-symbols-outlined text-[14px]">
                {stats.transactions.trend >= 0 ? 'arrow_upward' : 'arrow_downward'}
              </span> 
              {Math.abs(stats.transactions.trend)}%
            </span>
            <span className="text-on-surface-variant">vs Kemarin</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface rounded-xl p-4 border border-surface-container-high flex flex-col gap-2">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-medium text-sm">Rata-rata Transaksi (Basket Size)</span>
            <span className="material-symbols-outlined text-[18px]">shopping_basket</span>
          </div>
          <div className="text-2xl font-bold text-on-surface">
            Rp {stats.transactions.today > 0 ? Math.round(stats.sales.today / stats.transactions.today).toLocaleString('id-ID') : 0}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-on-surface-variant">Hari ini</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-surface rounded-xl p-4 border border-surface-container-high flex flex-col gap-2">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-medium text-sm">Nilai Bahan Baku (Waste) Hari Ini</span>
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </div>
          <div className="text-2xl font-bold text-on-surface">Rp {stats.waste.today.toLocaleString('id-ID')}</div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-on-surface-variant">Tercatat di log</span>
          </div>
        </div>
      </div>

      {/* Row 2: Recent Orders */}
      <div className="flex flex-col mb-space-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-on-surface">Transaksi Terakhir (Semua Cabang)</h2>
        </div>
        
        <div className="bg-surface rounded-xl border border-surface-container-high overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-sm border-b border-surface-container-high">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Cabang</th>
                <th className="p-4 font-medium">Kasir</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Waktu</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {stats.recent_orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-on-surface-variant">Belum ada transaksi</td>
                </tr>
              ) : (
                stats.recent_orders.map(order => (
                  <tr key={order.id} className="border-b border-surface-container-high hover:bg-surface-container-lowest">
                    <td className="p-4 font-medium text-on-surface">#{order.id}</td>
                    <td className="p-4 text-on-surface">{order.branch ? order.branch.name : 'Unknown'}</td>
                    <td className="p-4 text-on-surface">{order.user ? order.user.name : 'Unknown'}</td>
                    <td className="p-4 font-bold text-on-surface">Rp {order.total.toLocaleString('id-ID')}</td>
                    <td className="p-4 text-on-surface-variant">{new Date(order.created_at).toLocaleString('id-ID')}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'paid' ? 'bg-tertiary/10 text-tertiary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
