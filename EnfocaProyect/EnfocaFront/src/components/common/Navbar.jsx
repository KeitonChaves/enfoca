import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function Navbar() {
    const { isAuthenticated } = useAuth();

    return (
        <nav className="w-full px-6 lg:px-12 py-4 flex items-center justify-between bg-black text-white border-b border-neutral-800/50">
            <Link
                to={isAuthenticated ? '/dashboard' : '/'}
                className="flex-shrink-0 flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
            >
                <img src="/logo.png" alt="Enfoca" className="h-14 w-auto object-contain" />
            </Link>

            <div />

            {!isAuthenticated && (
                <div className="flex items-center gap-4 text-sm font-medium">
                    <Link to="/login" className="text-neutral-300 hover:text-white transition-colors hidden sm:block">
                        Iniciar sesión
                    </Link>
                    <Link to="/register" className="bg-white text-black hover:bg-neutral-200 px-4 py-2 rounded-lg transition-colors inline-block">
                        Registrarse
                    </Link>
                </div>
            )}
        </nav>
    );
}
