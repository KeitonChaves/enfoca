import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PrivateRoute from './components/common/PrivateRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RecoverAccountPage from './pages/RecoverAccountPage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import FocusModePage from './pages/FocusModePage';
import StudyPlansPage from './pages/StudyPlansPage';
import DashboardLayout from './layouts/DashboardLayout';
import { AuthProvider } from './contexts/AuthProvider';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Rutas públicas (con Navbar y Footer) */}
                    <Route element={
                        <div className="h-screen overflow-hidden bg-black flex flex-col font-sans text-white">
                            <Navbar />
                            <main className="flex-1 flex flex-col min-h-0">
                                <Routes>
                                    <Route path="/" element={<LandingPage />} />
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/register" element={<RegisterPage />} />
                                    <Route path="/recover" element={<RecoverAccountPage />} />
                                </Routes>
                            </main>
                            <Footer />
                        </div>
                    }>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/recover" element={<RecoverAccountPage />} />
                    </Route>

                    {/* Rutas privadas (con DashboardLayout, sin Navbar/Footer) */}
                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            <DashboardLayout>
                                <DashboardPage />
                            </DashboardLayout>
                        </PrivateRoute>
                    } />
                    <Route path="/focus" element={
                        <PrivateRoute>
                            <DashboardLayout>
                                <FocusModePage />
                            </DashboardLayout>
                        </PrivateRoute>
                    } />
                    <Route path="/study-plans" element={
                        <PrivateRoute>
                            <DashboardLayout>
                                <StudyPlansPage />
                            </DashboardLayout>
                        </PrivateRoute>
                    } />
                    <Route path="/analytics" element={
                        <PrivateRoute>
                            <DashboardLayout>
                                <AnalyticsPage />
                            </DashboardLayout>
                        </PrivateRoute>
                    } />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
