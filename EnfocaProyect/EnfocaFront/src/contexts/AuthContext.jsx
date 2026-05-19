// src/contexts/AuthContext.js
import { createContext, useContext } from 'react';

// 1. Exportamos el Contexto
export const AuthContext = createContext();

// 2. Exportamos tu Hook unificado
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }

    return context;
};