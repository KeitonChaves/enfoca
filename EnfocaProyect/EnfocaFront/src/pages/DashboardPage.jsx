import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import './DashboardPage.css';

/* ── Mock data ── */
const WEEKLY_RAW = [
  { day: 'MON', cycles: 3 }, { day: 'TUE', cycles: 5 },
  { day: 'WED', cycles: 8 }, { day: 'THU', cycles: 4 },
  { day: 'FRI', cycles: 6 }, { day: 'SAT', cycles: 2 },
  { day: 'SUN', cycles: 1 },
];
const WEEKLY_AVG = WEEKLY_RAW.map(d => ({ ...d, cycles: +(d.cycles * 0.7).toFixed(1) }));

const CURRICULUM = [
  { code: 'MTH-402', name: 'Multivariable Integration', icon: '∑', pct: 75.0, color: '#5591c7', topic: 'Topic: Triple integrals in spherical coordinates and vector fields.' },
  { code: 'BIO-612', name: 'CRISPR Gene Editing',        icon: '⬆', pct: 42.8, color: '#6daa45', topic: 'Topic: Analysis of CAS9 molecular sequencing and target binding.' },
  { code: 'HIS-101', name: 'Industrial Revolution',      icon: '📋', pct: 88.2, color: '#fdab43', topic: 'Topic: Socioeconomic shift and mechanization in 19th-century Europe.' },
];

/* ── Timer hook ── */
function useTimer(initial = 25 * 60) {
  const [secs, setSecs] = useState(initial);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSecs(s => s > 0 ? s - 1 : 0), 1000);
    } else clearInterval(ref.current);
    return () => clearInterval(ref.current);
  }, [running]);
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  return { display: `${mm}:${ss}`, running, toggle: () => setRunning(r => !r), reset: () => { setRunning(false); setSecs(initial); } };
}

/* ── Custom tooltip ── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="db-tooltip">
      <div className="db-tooltip-label">{label}</div>
      <div className="db-tooltip-value">{payload[0].value} cycles</div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const timer = useTimer();
  const [mode, setMode] = useState('RAW');
  const data = mode === 'RAW' ? WEEKLY_RAW : WEEKLY_AVG;
  const progress = ((25 * 60 - parseInt(timer.display.replace(':', ''))) / (25 * 60)) * 100;
  const circumference = 2 * Math.PI * 52;

  return (
    <div className="db-page">
      {/* ── Top bar ── */}
      <header className="db-topbar">
        <div className="db-topbar-left">
          <span className="db-topbar-title">Dashboard</span>
          <span className="db-topbar-session">Active session: Quantum Physics</span>
        </div>
        <div className="db-topbar-right">
          <span className="db-streak-badge">🔥 12 DAY STREAK</span>
          <button className="db-icon-btn" aria-label="Search">🔍</button>
          <button className="db-icon-btn" aria-label="Notifications">🔔</button>
        </div>
      </header>

      <div className="db-content">
        {/* ── KPI Cards ── */}
        <div className="db-kpi-row">
          {[
            { label: 'HOURS FOCUSED',   value: '124.5', sub: '+12%',    icon: '⏱' },
            { label: 'DEEP WORK XP',    value: '2,450', sub: 'LVL 24',  icon: '🎯' },
            { label: 'RETENTION RATE',  value: '92',    sub: '%',       icon: '📚' },
            { label: 'ACTIVE STREAK',   value: '12',    sub: 'DAYS',    icon: '⚡' },
          ].map(k => (
            <div key={k.label} className="db-kpi-card">
              <div className="db-kpi-header">
                <span className="db-kpi-label">{k.label}</span>
                <span className="db-kpi-icon">{k.icon}</span>
              </div>
              <div className="db-kpi-val">
                {k.value}
                <span className="db-kpi-sub">{k.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main row ── */}
        <div className="db-main-row">
          {/* Chart */}
          <div className="db-chart-card">
            <div className="db-chart-header">
              <div>
                <div className="db-chart-title">WEEKLY INTENSITY DISTRIBUTION</div>
                <div className="db-chart-sub">MEASURED IN FOCUS CYCLES PER INTERVAL</div>
              </div>
              <div className="db-chart-tabs">
                {['W-AVG', 'RAW'].map(m => (
                  <button key={m} className={'db-tab' + (mode === m ? ' active' : '')} onClick={() => setMode(m)}>{m}</button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="cycleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false}/>
                <XAxis dataKey="day" tick={{ fill: '#555', fontSize: 10, letterSpacing: 1 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false}/>
                <Tooltip content={<ChartTooltip />}/>
                <Area type="monotone" dataKey="cycles" stroke="#7c3aed" strokeWidth={2} fill="url(#cycleGrad)" dot={{ fill: '#7c3aed', r: 3 }} activeDot={{ r: 5 }}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Timer */}
          <div className="db-timer-card">
            <div className="db-timer-header">
              <span className="db-timer-title">FOCUS ENGINE</span>
              <span className="db-timer-settings">⚙</span>
            </div>
            <div className="db-timer-ring">
              <svg viewBox="0 0 120 120" className="db-ring-svg">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#1a1a1a" strokeWidth="6"/>
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke="#7c3aed" strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - Math.min(progress / 100, 1))}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
                <text x="60" y="56" textAnchor="middle" fill="#e5e5e5" fontSize="18" fontWeight="700" fontFamily="monospace">{timer.display}</text>
                <text x="60" y="70" textAnchor="middle" fill={timer.running ? '#6daa45' : '#555'} fontSize="7" letterSpacing="2">{timer.running ? '● RUNNING' : '● IDLE_MODE'}</text>
              </svg>
            </div>
            <button className="db-focus-btn" onClick={timer.toggle}>
              {timer.running ? '⏸ PAUSE' : '▶ INITIATE FOCUS'}
            </button>
            <div className="db-timer-meta">
              <span>Session: Quantum_Phy_L4</span>
              <span>01/04 Cycles</span>
            </div>
          </div>
        </div>

        {/* ── Curriculum ── */}
        <div className="db-curriculum-section">
          <div className="db-curriculum-header">
            <div>
              <div className="db-curriculum-title">ACTIVE CURRICULUM</div>
              <div className="db-curriculum-sub">Core study plans and modular progress</div>
            </div>
            <button className="db-view-registry" onClick={() => navigate('/study-plans')}>VIEW REGISTRY ↗</button>
          </div>
          <div className="db-curriculum-grid">
            {CURRICULUM.map(c => (
              <div key={c.code} className="db-curr-card">
                <div className="db-curr-top">
                  <span className="db-curr-code">{c.code}</span>
                  <span className="db-curr-icon">{c.icon}</span>
                </div>
                <div className="db-curr-name">{c.name}</div>
                <div className="db-curr-efficiency-row">
                  <span className="db-curr-eff-label">EFFICIENCY</span>
                  <span className="db-curr-eff-val">{c.pct}%</span>
                </div>
                <div className="db-progress-track">
                  <div className="db-progress-fill" style={{ width: `${c.pct}%`, background: c.color }}/>
                </div>
                <div className="db-curr-topic">{c.topic}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="db-footer">
        <span className="db-footer-brand">E &nbsp; ENFOCA OS</span>
        <div className="db-footer-links">
          <a href="#">MANIFESTO</a>
          <a href="#">ARCHITECTURE</a>
          <a href="#">NODES</a>
        </div>
        <span className="db-footer-ver">V2.4.0-STABLE // BUILD_804471</span>
      </footer>
    </div>
  );
}
