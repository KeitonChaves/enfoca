import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';

export default function DashboardLayout() {
    return (
        <div className="flex h-screen bg-[#0c0c0c] overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}
