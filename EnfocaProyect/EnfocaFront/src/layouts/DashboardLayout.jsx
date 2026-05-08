import React, { useContext, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthProvider';

const NavItem = ({ to, icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`
        }
    >
        <span className="text-base">{icon}</span>
        <span>{label}</span>
    </NavLink>
);

const DashboardLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
            {/* Sidebar */}
            <aside className="w-[220px] min-w-[220px] flex flex-col bg-[#111111] border-r border-white/[0.06] py-5 px-3">
                {/* Logo */}
                <div className="flex items-center gap-3 px-3 mb-8">
                    <div className="w-8 h-8 rounded-md bg-violet-600 flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" strokeWidth="2">
                            <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" />
                            <line x1="12" y1="2" x2="12" y2="22" />
                            <line x1="2" y1="8" x2="22" y2="8" />
                            <line x1="2" y1="16" x2="22" y2="16" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-bold tracking-widest text-white">ENFOCA</p>
                        <p className="text-[10px] tracking-widest text-white/30 font-medium">ACADEMIC RIGOR</p>
                    </div>
                </div>

                {/* Nav principal */}
                <nav className="flex flex-col gap-1 flex-1">
                    <NavItem to="/dashboard" icon="⊞" label="Dashboard" />
                    <NavItem to="/focus" icon="◉" label="Focus Mode" />
                    <NavItem to="/study-plans" icon="☰" label="Study Plans" />
                    <NavItem to="/analytics" icon="⊿" label="Analytics" />
                </nav>

                {/* CTA Start Session */}
                <div className="px-1 mb-4">
                    <button
                        onClick={() => navigate('/focus')}
                        className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-lg tracking-wide transition-colors duration-150"
                    >
                        START SESSION
                    </button>
                </div>

                {/* Footer sidebar */}
                <div className="flex flex-col gap-1 border-t border-white/[0.06] pt-3">
                    <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all duration-150">
                        <span>?</span>
                        <span>Support</span>
                    </button>
                    <div className="flex items-center justify-between px-4 py-2.5">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-violet-700 flex items-center justify-center text-xs font-bold">
                                {user?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <span className="text-sm text-white/70 font-medium">
                                {user?.username || 'Usuario'}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            title="Cerrar sesión"
                            className="text-white/30 hover:text-white/70 transition-colors text-xs p-1 rounded"
                        >
                            ⎋
                        </button>
                    </div>
                </div>
            </aside>

            {/* Contenido — Outlet renderiza la página hija */}
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
