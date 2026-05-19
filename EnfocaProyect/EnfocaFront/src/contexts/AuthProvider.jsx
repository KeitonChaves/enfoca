// src/contexts/AuthProvider.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';

// COMENTAMOS LA API POR AHORA PARA QUE NO FALLE SIN BACKEND
// import { profileService, authService } from '../services/api';

export const AuthProvider = ({ children }) => {
    // 1. USUARIO MOCK: Le damos un usuario falso para que el Sidebar y Perfil funcionen
    const [user, setUser] = useState({
        id: "mock-id-123",
        nombre: "Desarrollador", // Ajusta si en tu app usas 'first_name'
        email: "dev@enfoca.online"
    });

    // 2. FORZAMOS AUTENTICACIÓN A TRUE DESDE EL INICIO
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    // 3. SIN CARGAS (false)
    const [loading, setLoading] = useState(false);

    /* =========================================================
       LÓGICA ORIGINAL COMENTADA PARA CUANDO CONECTES EL BACKEND
       =========================================================
    const cargarPerfil = useCallback(async () => {
        try {
            const {data} = await profileService.getProfile();
            setUser(data);
            localStorage.setItem('user_data', JSON.stringify(data));
        } catch {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_data');
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated && !user) {
            cargarPerfil();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, user, cargarPerfil]);
    ========================================================= */

    // Mockeamos la función de login (por si navegas a /login y quieres entrar)
    const login = async (credentials) => {
        setLoading(true);
        // Simulamos un retraso de red de 800ms para que se vea real
        return new Promise((resolve) => {
            setTimeout(() => {
                setIsAuthenticated(true);
                setUser({
                    id: "mock-id-123",
                    nombre: "Desarrollador",
                    email: "dev@enfoca.online"
                });
                setLoading(false);
                resolve({ success: true });
            }, 800);
        });
    };

    // Mockeamos la función de logout
    const logout = async (callback) => {
        // Borramos el estado local instantáneamente sin llamar al backend
        setUser(null);
        setIsAuthenticated(false);
        if (callback) callback();
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
            {loading ? (
                <div className="bg-[#0a0a0a] h-screen w-screen flex flex-col items-center justify-center gap-4">
                    <div className="w-8 h-8 border-2 border-violet-600/30 border-t-violet-600 rounded-full animate-spin"/>
                    <span className="text-neutral-500 text-xs tracking-widest uppercase">Cargando Enfoca...</span>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};