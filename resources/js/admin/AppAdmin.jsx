import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import AdminLayout from './components/AdminLayout';

// Pages
import AdminLoginScreen from './pages/AdminLoginScreen';
import DashboardScreen from './pages/DashboardScreen';
import SalesReportScreen from './pages/SalesReportScreen';
import ProfitLossReportScreen from './pages/ProfitLossReportScreen';
import DiscrepancyAlertScreen from './pages/DiscrepancyAlertScreen';
import InventoryBOMScreen from './pages/InventoryBOMScreen';
import StockOpnameWasteScreen from './pages/StockOpnameWasteScreen';
import EmployeeAttendanceScreen from './pages/EmployeeAttendanceScreen';
import PayrollCommissionScreen from './pages/PayrollCommissionScreen';
import AdminPettyCashScreen from './pages/AdminPettyCashScreen';
import BranchManagementScreen from './pages/BranchManagementScreen';
import AdminSettingsScreen from './pages/AdminSettingsScreen';

export default function AppAdmin() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Login Route */}
                <Route path="/admin/login" element={<AdminLoginScreen />} />
                
                {/* Dashboard Routes with Layout */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardScreen />} />
                    <Route path="sales" element={<SalesReportScreen />} />
                    <Route path="profit" element={<ProfitLossReportScreen />} />
                    <Route path="discrepancy" element={<DiscrepancyAlertScreen />} />
                    <Route path="inventory" element={<InventoryBOMScreen />} />
                    <Route path="stock" element={<StockOpnameWasteScreen />} />
                    <Route path="employee" element={<EmployeeAttendanceScreen />} />
                    <Route path="payroll" element={<PayrollCommissionScreen />} />
                    <Route path="pettycash" element={<AdminPettyCashScreen />} />
                    <Route path="branch" element={<BranchManagementScreen />} />
                    <Route path="settings" element={<AdminSettingsScreen />} />
                </Route>
                
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/admin/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
