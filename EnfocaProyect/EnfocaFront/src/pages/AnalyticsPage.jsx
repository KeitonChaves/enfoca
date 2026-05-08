import React, { useState } from 'react';
import {
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import './AnalyticsPage.css';

/* ── Mock data ── */
const DAILY_HOURS = [
  { day: 'Lun', hours: 3.5 }, { day: 'Mar', hours: 5.0 },
  { day: 'Mié', hours: 6.2 }, { day: 'Jue', hours: 4.1 },
  { day: 'Vie', hours: 5.8 }, { day: 'Sáb', hours: 2.0 },
  { day: 'Dom', hours: 1.2 },
];

const SUBJECT_EFF = [
  { subject: 'MTH-402', efficiency: 75, sessions: 12 },
  { subject: 'BIO-612', efficiency: 42, sessions: 7  },
  { subject: 'HIS-101', efficiency: 88, sessions: 15 },
  { subject: 'PHY-301', efficiency: 61, sessions: 9  },
];

const RETENTION_TREND = [
  { week: 'S1', retention: 68 }, { week: 'S2', retention: 74 },
  { week: 'S3', retention: 71 }, { week: 'S4', retention: 80 },
  { week: 'S5', retention: 85 }, { week: 'S6', retention: 82 },
  { week: 'S7', retention: 92 },
];

/* Heatmap: 7 semanas × 7 días */
const HEATMAP = Array.from({ length: 49 }, (_, i) => ({
  idx: i,
  value: Math.floor(Math.random() * 5),
}));

const HEAT_COLORS = ['#1a1a1a', '#2e1a4a', '#4c2a7a', '#7c3aed', '#a78bfa'];
const HEAT_LABELS = ['Sin actividad', '1-2 ciclos', '3-4 ciclos', '5-6 ciclos', '7+ ciclos'];

function CustomTooltip({ active, payload, label, unit = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="an-tooltip">
      <div className="an-tooltip-label">{label}</div>
      <div className="an-tooltip-value">{payload[0].value}{unit}</div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [heatHover, setHeatHover] = useState(null);

  return (
    <div className="an-page">
      <div className="an-header">
        <h1 className="an-title">ANALYTICS</h1>
        <p className="an-sub">PERFORMANCE OVERVIEW // CURRENT SEMESTER</p>
      </div>

      {/* KPIs */}
      <div className="an-kpi-grid">
        {[
          { label: 'TOTAL HOURS',      value: '124.5', sub: 'Este semestre' },
          { label: 'SESIONES',         value: '43',    sub: 'Completadas'   },
          { label: 'RETENCIÓN',        value: '92%',   sub: '+8% vs semana pasada' },
          { label: 'RACHA ACTIVA',     value: '12',    sub: 'Días consecutivos' },
        ].map(k => (
          <div key={k.label} className="an-kpi-card">
            <div className="an-kpi-label">{k.label}</div>
            <div className="an-kpi-value">{k.value}</div>
            <div className="an-kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Row 1: Horas diarias + Retención */}
      <div className="an-row-2">
        <div className="an-chart-card">
          <div className="an-chart-header">
            <div className="an-chart-title">HORAS DE ENFOQUE DIARIAS</div>
            <div className="an-chart-sub">ÚLTIMOS 7 DÍAS</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={DAILY_HOURS} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false}/>
              <XAxis dataKey="day" tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip unit=" hrs" />}/>
              <Area type="monotone" dataKey="hours" stroke="#7c3aed" strokeWidth={2}
                fill="url(#hoursGrad)" dot={{ fill: '#7c3aed', r: 3 }} activeDot={{ r: 5 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="an-chart-card">
          <div className="an-chart-header">
            <div className="an-chart-title">TENDENCIA DE RETENCIÓN</div>
            <div className="an-chart-sub">SEMANAS DEL SEMESTRE</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={RETENTION_TREND} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false}/>
              <XAxis dataKey="week" tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false}/>
              <YAxis domain={[50, 100]} tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip unit="%" />}/>
              <Line type="monotone" dataKey="retention" stroke="#6daa45" strokeWidth={2}
                dot={{ fill: '#6daa45', r: 3 }} activeDot={{ r: 5 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Eficiencia por materia */}
      <div className="an-chart-card">
        <div className="an-chart-header">
          <div className="an-chart-title">EFICIENCIA POR MATERIA</div>
          <div className="an-chart-sub">% PROMEDIO DE RETENCIÓN POR ASIGNATURA</div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={SUBJECT_EFF} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false}/>
            <XAxis dataKey="subject" tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false}/>
            <YAxis domain={[0, 100]} tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false}/>
            <Tooltip content={<CustomTooltip unit="%" />}/>
            <Bar dataKey="efficiency" fill="#7c3aed" radius={[3, 3, 0, 0]}
              label={{ position: 'top', fill: '#666', fontSize: 9 }}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Heatmap */}
      <div className="an-chart-card">
        <div className="an-chart-header">
          <div className="an-chart-title">MAPA DE ACTIVIDAD</div>
          <div className="an-chart-sub">ÚLTIMAS 7 SEMANAS — CICLOS POR DÍA</div>
        </div>
        <div className="an-heatmap">
          {HEATMAP.map(cell => (
            <div
              key={cell.idx}
              className="an-heat-cell"
              style={{ background: HEAT_COLORS[cell.value] }}
              onMouseEnter={() => setHeatHover(cell)}
              onMouseLeave={() => setHeatHover(null)}
              title={`${cell.value * 2} ciclos`}
            />
          ))}
        </div>
        <div className="an-heat-legend">
          {HEAT_COLORS.map((c, i) => (
            <div key={i} className="an-legend-item">
              <div className="an-legend-dot" style={{ background: c }}/>
              <span>{HEAT_LABELS[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insight */}
      <div className="an-insight-card">
        <div className="an-insight-badge">✦ AI INSIGHT</div>
        <p className="an-insight-text">
          Tu rendimiento pico ocurre los <strong>miércoles entre 9–11AM</strong>. 
          La materia BIO-612 muestra una caída de retención del 18% en los últimos 3 ciclos — 
          se recomienda una sesión de repaso activo con técnica Feynman antes del próximo Pomodoro.
        </p>
        <div className="an-insight-week">GENERADO ESTA SEMANA · BASADO EN 43 SESIONES</div>
      </div>
    </div>
  );
}
