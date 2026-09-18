import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import AdminLayout from './components/AdminLayout';

// Pages
import AdminLoginScreen from './pages/AdminLoginScreen';
import DashboardScreen from './pages/DashboardScreen';
import ProductScreen from './pages/ProductScreen';
import IngredientScreen from './pages/IngredientScreen';
import StockOpnameWasteScreen from './pages/StockOpnameWasteScreen';
import DailyReportScreen from './pages/DailyReportScreen';
import EmployeeAttendanceScreen from './pages/EmployeeAttendanceScreen';
import AdminPettyCashScreen from './pages/AdminPettyCashScreen';
import BranchManagementScreen from './pages/BranchManagementScreen';
import AdminSettingsScreen from './pages/AdminSettingsScreen';

export default function AppAdmin() {
    const basename = window.__APP_BASE_URL__ || '';
    return (
        <BrowserRouter basename={basename}>
            <Routes>
                {/* Login Route */}
                <Route path="/admin/login" element={<AdminLoginScreen />} />
                
                {/* Dashboard Routes with Layout */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardScreen />} />
                    <Route path="products" element={<ProductScreen />} />
                    <Route path="ingredients" element={<IngredientScreen />} />
                    <Route path="stock" element={<StockOpnameWasteScreen />} />
                    <Route path="daily-report" element={<DailyReportScreen />} />
                    <Route path="pettycash" element={<AdminPettyCashScreen />} />
                    <Route path="employee" element={<EmployeeAttendanceScreen />} />
                    <Route path="branch" element={<BranchManagementScreen />} />
                    <Route path="settings" element={<AdminSettingsScreen />} />
                </Route>
                
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/admin/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
