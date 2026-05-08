import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './DashboardLayout.css';

const NAV_ITEMS = [
  { to: '/dashboard',   label: 'Dashboard',    icon: '⊞' },
  { to: '/focus',       label: 'Focus Mode',   icon: '◎' },
  { to: '/study-plans', label: 'Study Plans',  icon: '☰' },
  { to: '/analytics',   label: 'Analytics',   icon: '⌇' },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  return (
    <div className="dl-root">
      {/* ── Sidebar ── */}
      <aside className="dl-sidebar">
        <div className="dl-brand">
          <span className="dl-brand-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="6" y="6" width="7" height="7" rx="1.5" fill="#7c3aed"/>
              <rect x="15" y="6" width="7" height="7" rx="1.5" fill="#a78bfa" opacity=".6"/>
              <rect x="6" y="15" width="7" height="7" rx="1.5" fill="#a78bfa" opacity=".6"/>
              <rect x="15" y="15" width="7" height="7" rx="1.5" fill="#7c3aed" opacity=".3"/>
            </svg>
          </span>
          <div>
            <div className="dl-brand-name">ENFOCA</div>
            <div className="dl-brand-sub">ACADEMIC RIGOR</div>
          </div>
        </div>

        <nav className="dl-nav">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => 'dl-nav-item' + (isActive ? ' active' : '')}
            >
              <span className="dl-nav-icon">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="dl-sidebar-bottom">
          <button className="dl-start-btn" onClick={() => navigate('/focus')}>
            START SESSION
          </button>
          <div className="dl-sidebar-user">
            <span className="dl-user-avatar">J</span>
            <span className="dl-user-name">Julian</span>
            <span className="dl-user-settings">⚙</span>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="dl-main">
        <Outlet />
      </main>
    </div>
  );
}
