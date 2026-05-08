import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';

/* Public pages */
import LandingPage        from './pages/LandingPage';
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import RecoverAccountPage from './pages/RecoverAccountPage';

/* Dashboard layout + pages */
import DashboardLayout   from './layouts/DashboardLayout';
import DashboardPage     from './pages/DashboardPage';
import AnalyticsPage     from './pages/AnalyticsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/"        element={<LandingPage />} />
          <Route path="/login"   element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/recover" element={<RecoverAccountPage />} />

          {/* Dashboard — layout with sidebar */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard"   element={<DashboardPage />} />
            <Route path="/analytics"   element={<AnalyticsPage />} />
            <Route path="/focus"       element={<div style={{padding:'2rem',color:'#888'}}>Focus Mode — próximamente</div>} />
            <Route path="/study-plans" element={<div style={{padding:'2rem',color:'#888'}}>Study Plans — próximamente</div>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
