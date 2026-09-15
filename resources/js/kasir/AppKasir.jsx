import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import OrderScreen from './pages/OrderScreen';
import LoginScreen from './pages/LoginScreen';
import ShiftScreen from './pages/ShiftScreen';
import HeldBillsScreen from './pages/HeldBillsScreen';
import PaymentScreen from './pages/PaymentScreen';
import ReceiptPreviewScreen from './pages/ReceiptPreviewScreen';
import PettyCashScreen from './pages/PettyCashScreen';
import AttendanceScreen from './pages/AttendanceScreen';
import KitchenProductionScreen from './pages/KitchenProductionScreen';
import WasteRecordScreen from './pages/WasteRecordScreen';
import SettingsScreen from './pages/SettingsScreen';

export default function AppKasir() {
    const basename = window.location.pathname.startsWith('/kasir') ? '/kasir' : '/';
    return (
        <BrowserRouter basename={basename}>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/shift" element={<ShiftScreen />} />
                <Route path="/order" element={<OrderScreen />} />
                <Route path="/held-bills" element={<HeldBillsScreen />} />
                <Route path="/payment" element={<PaymentScreen />} />
                <Route path="/receipt-preview" element={<ReceiptPreviewScreen />} />
                <Route path="/petty-cash" element={<PettyCashScreen />} />
                <Route path="/attendance" element={<AttendanceScreen />} />
                <Route path="/kitchen-production" element={<KitchenProductionScreen />} />
                <Route path="/waste-record" element={<WasteRecordScreen />} />
                <Route path="/settings" element={<SettingsScreen />} />
            </Routes>
        </BrowserRouter>
    );
}
