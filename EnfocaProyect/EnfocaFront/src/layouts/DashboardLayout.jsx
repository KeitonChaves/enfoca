// src/layouts/DashboardLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';

export default function DashboardLayout() {
    return (
        // Aplicamos bg-[#0a0a0a] y text-[#cdccca] que estaban en .dashboard-layout
        <div className="flex h-screen bg-[#0a0a0a] text-[#cdccca] overflow-hidden">
            <Sidebar />

            {/* Equivalente a .dashboard-main */}
            <main className="flex-1 overflow-y-auto bg-[#0a0a0a]">
                <Outlet />
            </main>
        </div>
    );
}