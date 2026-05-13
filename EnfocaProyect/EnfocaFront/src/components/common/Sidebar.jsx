import React from 'react';
import {Link, useLocation} from 'react-router-dom';

export default function Sidebar() {
    const location = useLocation();

    const menuItems = [
        {name: 'Dashboard', path: '/dashboard', icon: '⊞'},
        {name: 'Focus Mode', path: '/pomodoro', icon: '🕒'},
        {name: 'Study Plans', path: '/study-plan', icon: '📖'},
        {name: 'Analytics', path: '/analytics', icon: '📈'},
    ];

    return (
        <aside className="w-64 h-screen bg-[#0c0c0c] border-r border-neutral-800 flex flex-col p-6 sticky top-0">
            {/* Logo */}
            <div className="mb-10">
                <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tighter">
                    <div className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center text-[10px]">P
                    </div>
                    ENFOCA
                </div>
                <span className="text-[10px] text-neutral-600 font-mono ml-8 uppercase">dev.environment</span>
            </div>

            {/* Navegación */}
            <nav className="flex-grow space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                            location.pathname === item.path
                                ? 'bg-neutral-800/50 text-white border border-neutral-700'
                                : 'text-neutral-500 hover:text-white'
                        }`}
                    >
                        <span>{item.icon}</span>
                        {item.name}
                    </Link>
                ))}
            </nav>

            {/* Footer de Sidebar */}
            <div className="mt-auto space-y-4">
                <div className="pt-4 border-t border-neutral-800 space-y-3">
                    <div className="flex items-center gap-3 text-neutral-500 text-sm hover:text-white cursor-pointer">
                        <span>?</span> Support
                    </div>
                    <div className="flex items-center gap-3 text-neutral-500 text-sm hover:text-white cursor-pointer">
                        <span>👤</span> Profile
                    </div>
                </div>
            </div>
        </aside>
    );
}