import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../contexts/AuthProvider';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

// --- Datos mock (se reemplazarán con llamadas al backend) ---
const weeklyData = [
    { day: 'MON', raw: 2, avg: 1.5 },
    { day: 'TUE', raw: 4, avg: 2.8 },
    { day: 'WED', raw: 6, avg: 4.0 },
    { day: 'THU', raw: 3, avg: 3.2 },
    { day: 'FRI', raw: 5, avg: 4.1 },
    { day: 'SAT', raw: 1, avg: 1.8 },
    { day: 'SUN', raw: 2, avg: 2.0 },
];

const curriculum = [
    { code: 'MTH-402', name: 'Multivariable Integration', efficiency: 75.0, color: '#7B5CF0', topic: 'Triple integrals in spherical coordinates and vector fields.' },
    { code: 'BIO-612', name: 'CRISPR Gene Editing', efficiency: 42.8, color: '#22c55e', topic: 'Analysis of CAS9 molecular sequencing and target binding.' },
    { code: 'HIS-101', name: 'Industrial Revolution', efficiency: 88.2, color: '#f97316', topic: 'Socioeconomic shift and mechanization in 19th-century Europe.' },
];

// --- Componente KPI Card ---
const KPICard = ({ label, value, sub, icon, highlight }) => (
    <div className={`rounded-xl border p-5 flex flex-col gap-2 ${
        highlight
            ? 'bg-violet-950/40 border-violet-500/30'
            : 'bg-[#141414] border-white/[0.06]'
    }`}>
        <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-widest text-white/40 uppercase">{label}</span>
            <span className="text-white/25 text-base">{icon}</span>
        </div>
        <div className="flex items-end gap-2">
            <span className={`text-3xl font-bold tabular-nums leading-none ${
                highlight ? 'text-violet-300' : 'text-white'
            }`}>{value}</span>
            {sub && <span className="text-xs text-white/40 mb-1">{sub}</span>}
        </div>
    </div>
);

// --- Componente Timer circular ---
const FocusTimer = () => {
    const TOTAL = 25 * 60;
    const [seconds, setSeconds] = useState(TOTAL);
    const [running, setRunning] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(() => {
                setSeconds(s => {
                    if (s <= 1) { clearInterval(intervalRef.current); setRunning(false); return 0; }
                    return s - 1;
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [running]);

    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    const progress = (TOTAL - seconds) / TOTAL;
    const circumference = 2 * Math.PI * 54;
    const strokeDash = circumference * progress;

    const reset = () => { setRunning(false); setSeconds(TOTAL); };

    return (
        <div className="flex flex-col items-center justify-between h-full gap-4 py-2">
            <p className="text-[11px] tracking-widest text-white/30 font-semibold uppercase">Focus Engine</p>

            {/* Círculo SVG */}
            <div className="relative flex items-center justify-center">
                <svg width="140" height="140" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r="54" fill="none" stroke="#ffffff08" strokeWidth="6" />
                    <circle
                        cx="70" cy="70" r="54"
                        fill="none"
                        stroke={running ? '#7B5CF0' : '#ffffff20'}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${strokeDash} ${circumference}`}
                        strokeDashoffset="0"
                        transform="rotate(-90 70 70)"
                        style={{ transition: 'stroke-dasharray 1s linear' }}
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-bold tabular-nums text-white">{mins}:{secs}</span>
                    <span className={`text-[10px] tracking-widest font-semibold mt-1 ${
                        running ? 'text-violet-400' : 'text-white/30'
                    }`}>
                        {running ? '● FOCUS_MODE' : '● IDLE_MODE'}
                    </span>
                </div>
            </div>

            {/* Controles */}
            <div className="w-full flex flex-col gap-2">
                <button
                    onClick={() => setRunning(r => !r)}
                    className="w-full py-3 bg-white hover:bg-white/90 text-black text-sm font-bold rounded-lg tracking-widest transition-colors"
                >
                    {running ? '⏸ PAUSE' : '▶ INITIATE FOCUS'}
                </button>
                {(running || seconds < TOTAL) && (
                    <button
                        onClick={reset}
                        className="w-full py-2 bg-white/5 hover:bg-white/10 text-white/50 text-xs font-semibold rounded-lg tracking-widest transition-colors"
                    >
                        ↺ RESET
                    </button>
                )}
                <p className="text-center text-[11px] text-white/25 tracking-wide">Session: Quantum_Phy_L4 · 01/04 Cycles</p>
            </div>
        </div>
    );
};

// --- Componente Curriculum Card ---
const CurriculumCard = ({ code, name, efficiency, color, topic }) => (
    <div className="bg-[#141414] border border-white/[0.06] rounded-xl p-5 flex flex-col gap-3 hover:border-white/10 transition-colors">
        <div className="flex items-start justify-between">
            <span className="text-[11px] font-mono font-semibold tracking-widest" style={{ color }}>{code}</span>
            <span className="text-white/20 text-sm">⊙</span>
        </div>
        <p className="text-sm font-semibold text-white leading-snug">{name}</p>
        <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
                <span className="text-[11px] tracking-widest text-white/30 font-medium">EFFICIENCY</span>
                <span className="text-sm font-bold tabular-nums text-white/80">{efficiency.toFixed(1)}%</span>
            </div>
            <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${efficiency}%`, backgroundColor: color }}
                />
            </div>
        </div>
        <p className="text-[11px] text-white/35 leading-relaxed">
            <span className="text-white/20">Topic: </span>{topic}
        </p>
    </div>
);

// --- Página principal Dashboard ---
const DashboardPage = () => {
    const { user } = useContext(AuthContext);
    const [chartMode, setChartMode] = useState('RAW');
    const activeSession = 'Quantum Physics';

    return (
        <div className="min-h-full bg-[#0a0a0a] p-6 flex flex-col gap-6">

            {/* Top bar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-base font-semibold text-white">Dashboard</h1>
                    <span className="text-white/20">|</span>
                    <span className="text-[12px] text-white/40 font-mono">Active session: {activeSession}</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 bg-[#1a1a1a] border border-white/[0.06] rounded-lg px-3 py-1.5">
                        <span className="text-orange-400 text-sm">🔥</span>
                        <span className="text-[12px] font-bold text-white tracking-wide">12 DAY STREAK</span>
                    </div>
                    <button className="text-white/30 hover:text-white/60 transition-colors">🔔</button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-4 gap-3">
                <KPICard label="Hours Focused" value="124.5" sub="+12%" icon="⏱" />
                <KPICard label="Deep Work XP" value="2,450" sub="LVL 24" icon="◎" />
                <KPICard label="Retention Rate" value="92" sub="%" icon="≋" />
                <KPICard label="Active Streak" value="12" sub="DAYS" icon="⚡" highlight />
            </div>

            {/* Gráfico + Timer */}
            <div className="grid grid-cols-[1fr_280px] gap-3">
                {/* Gráfico semanal */}
                <div className="bg-[#141414] border border-white/[0.06] rounded-xl p-5">
                    <div className="flex items-start justify-between mb-1">
                        <div>
                            <p className="text-[11px] font-semibold tracking-widest text-white uppercase">Weekly Intensity Distribution</p>
                            <p className="text-[10px] text-white/25 tracking-widest mt-0.5">MEASURED IN FOCUS CYCLES PER INTERVAL</p>
                        </div>
                        <div className="flex gap-1">
                            {['W-AVG', 'RAW'].map(m => (
                                <button
                                    key={m}
                                    onClick={() => setChartMode(m)}
                                    className={`px-3 py-1 text-[11px] font-semibold rounded tracking-wide transition-colors ${
                                        chartMode === m
                                            ? 'bg-white/15 text-white'
                                            : 'text-white/30 hover:text-white/60'
                                    }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={weeklyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7B5CF0" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#7B5CF0" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                            <XAxis dataKey="day" tick={{ fill: '#ffffff30', fontSize: 11, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#ffffff30', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ background: '#1a1a1a', border: '1px solid #ffffff15', borderRadius: 8, color: '#fff', fontSize: 12 }}
                                cursor={{ stroke: '#7B5CF0', strokeWidth: 1 }}
                            />
                            <Area
                                type="monotone"
                                dataKey={chartMode === 'RAW' ? 'raw' : 'avg'}
                                stroke="#7B5CF0"
                                strokeWidth={2}
                                fill="url(#colorGrad)"
                                dot={{ fill: '#7B5CF0', r: 3 }}
                                activeDot={{ r: 5, fill: '#7B5CF0' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Focus Timer */}
                <div className="bg-[#141414] border border-white/[0.06] rounded-xl p-5">
                    <FocusTimer />
                </div>
            </div>

            {/* Active Curriculum */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-[13px] font-semibold text-white tracking-wide">Active Curriculum</p>
                        <p className="text-[11px] text-white/30 mt-0.5">Core study plans and modular progress</p>
                    </div>
                    <button className="text-[11px] text-violet-400 hover:text-violet-300 font-semibold tracking-widest transition-colors">
                        VIEW REGISTRY ↗
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {curriculum.map(c => <CurriculumCard key={c.code} {...c} />)}
                </div>
            </div>

            {/* Footer */}
            <footer className="flex items-center justify-between pt-2 border-t border-white/[0.04] mt-auto">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-violet-600 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-white">E</span>
                    </div>
                    <span className="text-[11px] tracking-widest text-white/20 font-semibold">ENFOCA OS</span>
                </div>
                <div className="flex gap-6">
                    {['MANIFESTO', 'ARCHITECTURE', 'NODES'].map(l => (
                        <button key={l} className="text-[10px] tracking-widest text-white/20 hover:text-white/40 font-medium transition-colors">{l}</button>
                    ))}
                </div>
                <span className="text-[10px] font-mono text-white/15">V2.4.0-STABLE // BUILD_804471</span>
            </footer>
        </div>
    );
};

export default DashboardPage;
