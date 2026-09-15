import React, { useState, useEffect } from 'react';

export default function EmployeeAttendanceScreen() {
  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    role: 'kasir',
    branch_id: '',
    phone: '',
    is_active: 1
  });

  const [filters, setFilters] = useState({
    branch_id: '',
    role: '',
    search: ''
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [filters]);

  const fetchBranches = async () => {
    try {
      const res = await window.apiClient.get('/admin/branches');
      if (res.status === 'success') {
        setBranches(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.branch_id) queryParams.append('branch_id', filters.branch_id);
      if (filters.role) queryParams.append('role', filters.role);
      if (filters.search) queryParams.append('search', filters.search);

      const res = await window.apiClient.get(`/admin/employees?${queryParams.toString()}`);
      if (res.status === 'success') {
        setEmployees(Array.isArray(res.data) ? res.data : (res.data?.data || []));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setFormData({
      id: null,
      name: '',
      email: '',
      password: '',
      role: 'kasir',
      branch_id: branches.length > 0 ? branches[0].id : '',
      phone: '',
      is_active: 1
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (emp) => {
    setFormData({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      password: '',
      role: emp.role,
      branch_id: emp.branch_id || '',
      phone: emp.phone || '',
      is_active: emp.is_active
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? (e.target.checked ? 1 : 0) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await window.apiClient.put(`/admin/employees/${formData.id}`, payload);
      } else {
        await window.apiClient.post('/admin/employees', formData);
      }
      closeModal();
      fetchEmployees();
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan data karyawan');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus karyawan ini?')) {
      try {
        await window.apiClient.delete(`/admin/employees/${id}`);
        fetchEmployees();
      } catch (err) {
        console.error(err);
        alert('Gagal menghapus karyawan');
      }
    }
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md mb-space-lg pt-space-md">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">Data Karyawan</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Manajemen data staf kasir, koki, dan supervisor seluruh cabang.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm mb-space-lg flex flex-wrap items-center justify-between gap-space-md">
        <div className="flex flex-wrap items-center gap-space-sm">
          <select name="branch_id" value={filters.branch_id} onChange={handleFilterChange} className="h-9 px-3 rounded-lg bg-surface-container text-on-surface">
            <option value="">Semua Cabang</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <select name="role" value={filters.role} onChange={handleFilterChange} className="h-9 px-3 rounded-lg bg-surface-container text-on-surface">
            <option value="">Semua Role</option>
            <option value="kasir">Kasir</option>
            <option value="koki">Koki</option>
            <option value="supervisor">Supervisor</option>
          </select>
        </div>
        <div className="flex items-center gap-space-sm">
          <input 
            className="h-9 pl-3 pr-3 rounded-lg bg-surface-container-high text-on-surface w-52" 
            placeholder="Cari nama karyawan..." 
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
          />
          <button onClick={openAddModal} className="h-9 px-3 rounded-lg bg-primary text-on-primary font-label-md flex items-center gap-1.5 hover:bg-on-primary-fixed-variant transition-colors">
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Staf Baru</span>
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading data...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-surface-container-low text-on-surface-variant text-sm">
              <tr>
                <th className="py-3 px-4">ID / Nama</th>
                <th className="py-3 px-4">Kontak (Email/Phone)</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Cabang</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y border-surface-container-high">
              {employees.length === 0 ? (
                <tr><td colSpan="6" className="p-6 text-center text-on-surface-variant">Tidak ada data karyawan</td></tr>
              ) : (
                employees.map(emp => (
                  <tr key={emp.id} className="hover:bg-surface-container-low/50">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-on-surface">{emp.name}</div>
                      <div className="text-xs text-on-surface-variant">{emp.employee_id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{emp.email}</div>
                      <div className="text-xs text-on-surface-variant">{emp.phone || '-'}</div>
                    </td>
                    <td className="py-3 px-4 uppercase text-sm font-semibold text-tertiary">{emp.role}</td>
                    <td className="py-3 px-4">{emp.branch ? emp.branch.name : '-'}</td>
                    <td className="py-3 px-4">
                      {emp.is_active ? 
                        <span className="px-2 py-1 rounded bg-tertiary/20 text-tertiary text-xs font-bold">Aktif</span> : 
                        <span className="px-2 py-1 rounded bg-error/20 text-error text-xs font-bold">Nonaktif</span>}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => openEditModal(emp)} className="p-1 text-primary hover:bg-primary/10 rounded mr-2"><span className="material-symbols-outlined text-sm">edit</span></button>
                      <button onClick={() => handleDelete(emp.id)} className="p-1 text-error hover:bg-error/10 rounded"><span className="material-symbols-outlined text-sm">delete</span></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-lg rounded-xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-surface-container flex justify-between items-center">
              <h3 className="font-bold text-on-surface">{isEditing ? 'Edit Karyawan' : 'Tambah Karyawan'}</h3>
              <button onClick={closeModal}><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs text-on-surface-variant mb-1">Nama Lengkap</label>
                <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 rounded bg-surface-container-low border border-surface-container-high" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-on-surface-variant mb-1">Email</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2 rounded bg-surface-container-low border border-surface-container-high" />
                </div>
                <div>
                  <label className="block text-xs text-on-surface-variant mb-1">Phone</label>
                  <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-2 rounded bg-surface-container-low border border-surface-container-high" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-on-surface-variant mb-1">Password {isEditing && '(Kosongkan jika tidak diubah)'}</label>
                  <input type="password" required={!isEditing} name="password" value={formData.password} onChange={handleInputChange} className="w-full p-2 rounded bg-surface-container-low border border-surface-container-high" />
                </div>
                <div>
                  <label className="block text-xs text-on-surface-variant mb-1">Role</label>
                  <select required name="role" value={formData.role} onChange={handleInputChange} className="w-full p-2 rounded bg-surface-container-low border border-surface-container-high">
                    <option value="kasir">Kasir</option>
                    <option value="koki">Koki</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-on-surface-variant mb-1">Cabang Penempatan</label>
                <select name="branch_id" value={formData.branch_id} onChange={handleInputChange} className="w-full p-2 rounded bg-surface-container-low border border-surface-container-high">
                  <option value="">- Tanpa Cabang -</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="is_active" id="is_active" checked={formData.is_active == 1} onChange={handleInputChange} />
                <label htmlFor="is_active" className="text-sm text-on-surface">Karyawan Aktif</label>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded bg-surface-container text-on-surface hover:bg-surface-container-high">Batal</button>
                <button type="submit" className="px-4 py-2 rounded bg-primary text-on-primary hover:bg-primary-container">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
