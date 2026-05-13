import { useState, useEffect } from 'react';
import StatCard from '../components/dashboard/StatCard';
import WeeklyChart from '../components/dashboard/WeeklyChart';
import CurriculumCard from '../components/dashboard/CurriculumCard';
import Sidebar from '../components/common/Sidebar';
import { metricsService, planService } from '../services/api';

const IconClock = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 15" />
    </svg>
);
const IconTarget = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
);
const IconLayers = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
    </svg>
);
const IconBolt = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);
const IconSigma = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 4H6l7 8-7 8h12" />
    </svg>
);
const IconUpload = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
);
const IconGlobe = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <line x1="3.05" y1="9" x2="20.95" y2="9" /><line x1="3.05" y1="15" x2="20.95" y2="15" />
        <path d="M12 3a14.5 14.5 0 0 1 0 18 14.5 14.5 0 0 1 0-18" />
    </svg>
);

const DIAS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

function mapearDatosSemana(rawDias) {
    if (!rawDias?.length) return null;
    const hoy = new Date().getDay();
    // getDay(): 0=DOM, 1=LUN... convertir a índice LUN=0
    const indicHoy = hoy === 0 ? 6 : hoy - 1;
    return rawDias.map((item, i) => ({
        day: DIAS[i] || DIAS[i % 7],
        cycles: item.ciclosEnfoque ?? item.focusCycles ?? item.cycles ?? 0,
        current: i === indicHoy,
    }));
}

export default function DashboardPage() {
    const [resumen, setResumen] = useState(null);
    const [datosSemana, setDatosSemana] = useState(null);
    const [planes, setPlanes] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargar = async () => {
            try {
                const [resSummary, resDias, resPlanes] = await Promise.allSettled([
                    metricsService.getSummary(),
                    metricsService.getLast7Days(),
                    planService.listar(),
                ]);

                if (resSummary.status === 'fulfilled') setResumen(resSummary.value.data);
                if (resDias.status === 'fulfilled') {
                    const mapeado = mapearDatosSemana(resDias.value.data);
                    if (mapeado) setDatosSemana(mapeado);
                }
                if (resPlanes.status === 'fulfilled') setPlanes(resPlanes.value.data ?? []);
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, []);

    const CURRICULUM_FALLBACK = [
        {
            code: 'MTH-402',
            title: 'Integración Multivariable',
            efficiency: 75.0,
            topic: 'Tema: Integrales triples en coordenadas esféricas y campos vectoriales.',
            accent: 'violet',
            icon: <IconSigma />,
        },
        {
            code: 'BIO-612',
            title: 'Edición Génica CRISPR',
            efficiency: 42.8,
            topic: 'Tema: Análisis de secuenciación molecular CAS9 y unión a objetivos.',
            accent: 'emerald',
            icon: <IconUpload />,
        },
        {
            code: 'HIS-101',
            title: 'Revolución Industrial',
            efficiency: 88.2,
            topic: 'Tema: Cambio socioeconómico y mecanización en la Europa del siglo XIX.',
            accent: 'amber',
            icon: <IconGlobe />,
        },
    ];

    const ACCENTS = ['violet', 'emerald', 'amber'];

    const curriculumItems = planes.length > 0
        ? planes.slice(0, 3).map((p, i) => ({
            code: p.id ? p.id.toString().slice(-6).toUpperCase() : String(i + 1).padStart(3, '0'),
            title: p.titulo ?? p.title ?? 'Plan sin título',
            efficiency: p.progreso?.porcentaje ?? p.progreso ?? p.progress ?? 0,
            topic: p.objetivo ?? p.descripcion ?? p.description ?? '',
            accent: ACCENTS[i % ACCENTS.length],
            icon: <IconSigma />,
        }))
        : CURRICULUM_FALLBACK;

    const horasEnfocadas = resumen?.horasEnfocadas ?? resumen?.focusHours ?? null;
    const xpTotal = resumen?.xpTotal ?? resumen?.deepWorkXp ?? null;
    const tasaRetencion = resumen?.tasaRetencion ?? resumen?.retentionRate ?? null;
    const rachaActiva = resumen?.rachaActiva ?? resumen?.activeStreak ?? null;

    if (cargando) {
        return (
            <div className="flex h-screen bg-[#0c0c0c]">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-violet-600/30 border-t-violet-600 rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#0c0c0c] overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-auto p-4 md:p-6 flex flex-col gap-5">

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <StatCard
                    label="Horas Enfocadas"
                    value={horasEnfocadas !== null ? horasEnfocadas.toFixed(1) : '—'}
                    badge={resumen?.variacionHoras ? `${resumen.variacionHoras > 0 ? '+' : ''}${resumen.variacionHoras}%` : undefined}
                    badgeColor="green"
                    icon={<IconClock />}
                />
                <StatCard
                    label="XP Trabajo Profundo"
                    value={xpTotal !== null ? xpTotal.toLocaleString('es-CL') : '—'}
                    badge={resumen?.nivel ? `NIV ${resumen.nivel}` : undefined}
                    badgeColor="neutral"
                    icon={<IconTarget />}
                />
                <StatCard
                    label="Tasa de Retención"
                    value={tasaRetencion !== null ? tasaRetencion : '—'}
                    unit={tasaRetencion !== null ? '%' : undefined}
                    icon={<IconLayers />}
                />
                <StatCard
                    label="Racha Activa"
                    value={rachaActiva !== null ? rachaActiva : '—'}
                    unit={rachaActiva !== null ? 'DÍAS' : undefined}
                    icon={<IconBolt />}
                    accent="text-amber-400"
                />
            </div>

            <WeeklyChart data={datosSemana} />

            <div>
                <div className="flex items-end justify-between mb-4">
                    <div>
                        <h2 className="text-xs font-bold tracking-widest text-white uppercase">Currículo Activo</h2>
                        <p className="text-[10px] text-neutral-600 tracking-wider mt-0.5">
                            Planes de estudio principales y progreso modular
                        </p>
                    </div>
                    <button className="flex items-center gap-1 text-[10px] font-semibold text-violet-400 hover:text-violet-300 tracking-wider uppercase transition-colors">
                        Ver Registro
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {curriculumItems.map((c) => (
                        <CurriculumCard key={c.code} {...c} />
                    ))}
                </div>
            </div>

            <footer className="mt-2 pt-5 border-t border-neutral-900 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border border-neutral-700 rounded flex items-center justify-center">
                        <span className="text-[8px] font-black text-neutral-500">E</span>
                    </div>
                    <span className="text-[10px] tracking-widest text-neutral-600 uppercase font-semibold">Enfoca OS</span>
                </div>
                <div className="flex items-center gap-6">
                    {['Manifiesto', 'Arquitectura', 'Nodos'].map((link) => (
                        <button key={link} className="text-[10px] tracking-widest text-neutral-700 hover:text-neutral-500 uppercase transition-colors">
                            {link}
                        </button>
                    ))}
                </div>
                <span className="text-[10px] text-neutral-800 font-mono">v2.4.0-ESTABLE // BUILD_200431</span>
            </footer>
            </div>
        </div>
    );
}
