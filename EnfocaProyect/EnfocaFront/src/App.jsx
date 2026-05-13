import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import { AuthProvider } from './contexts/AuthProvider.jsx';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';

function AppContent() {
    const { isAuthenticated } = useAuth();
    return (
        <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
            {isAuthenticated && <Navbar />}
            <main className="flex-grow flex flex-col">
                <AppRouter />
            </main>
            {isAuthenticated && <Footer />}
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </AuthProvider>
    );
}
