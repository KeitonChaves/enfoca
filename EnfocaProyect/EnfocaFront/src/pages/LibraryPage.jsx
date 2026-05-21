import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { planService } from '../services/api';
import { getPlanImage, getPlanBgFallback } from '../utils/planImage';

const BG_PALETTE = [
    'from-violet-900/50', 'from-blue-900/50', 'from-emerald-900/50',
    'from-amber-900/50',  'from-rose-900/50',  'from-cyan-900/50',
    'from-orange-900/50', 'from-purple-900/50',
];

const NIVEL_LABEL = { BASICO: 'Básico', INTERMEDIO: 'Intermedio', AVANZADO: 'Avanzado' };
const NIVEL_COLOR = {
    BASICO:      'bg-emerald-600',
    INTERMEDIO:  'bg-amber-600',
    AVANZADO:    'bg-violet-600',
};

const UserIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
    </svg>
);
const BookIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
);

export default function LibraryPage() {
    const navigate  = useNavigate();
    const [planes,  setPlanes]  = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        planService.listar()
            .then(r => setPlanes(r.data ?? []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const abrirPlan = (plan) => {
        navigate('/study-plan', { state: { planSeleccionado: plan } });
    };

    const calcularProgreso = (plan) => {
        const temas = plan.modulos?.flatMap(m => m.temas) ?? [];
        if (!temas.length) return 0;
        const completados = temas.filter(t => t.completado).length;
        return Math.round((completados / temas.length) * 100);
    };

    return (
        <div className="p-4 md:p-8 flex flex-col gap-8">
            <section className="flex flex-col gap-5">
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">Mis Planes de Estudio</h2>
                        <p className="text-neutral-500 text-sm mt-1">Planes generados con IA — haz clic para continuar estudiando.</p>
                    </div>
                    <button
                        onClick={() => navigate('/study-plan')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 hover:bg-violet-600/20 text-xs font-semibold transition-all"
                    >
                        + Nuevo Plan
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-[#111111] border border-neutral-800/60 rounded-xl overflow-hidden animate-pulse">
                                <div className="h-36 bg-neutral-800/40"/>
                                <div className="p-4 flex flex-col gap-2">
                                    <div className="h-3 bg-neutral-800 rounded w-3/4"/>
                                    <div className="h-2 bg-neutral-800 rounded w-1/2"/>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : planes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {planes.map((plan, i) => {
                            const progreso = calcularProgreso(plan);
                            const totalTemas = plan.modulos?.flatMap(m => m.temas).length ?? 0;
                            return (
                                <button
                                    key={plan.id}
                                    onClick={() => abrirPlan(plan)}
                                    className="group text-left bg-[#111111] border border-neutral-800/60 rounded-xl overflow-hidden hover:border-violet-500/30 transition-all hover:-translate-y-0.5 active:scale-95"
                                >
                                    {/* Portada */}
                                    <div className={`h-36 bg-gradient-to-b ${getPlanBgFallback(i)} to-neutral-900 relative flex items-end p-3 overflow-hidden`}>
                                        <img
                                            src={getPlanImage(plan.titulo)}
                                            alt={plan.titulo}
                                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                                            onError={e => { e.target.style.display = 'none'; }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-black/20 to-transparent"/>
                                        <span className={`relative z-10 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded text-white ${NIVEL_COLOR[plan.nivel] ?? 'bg-neutral-700'}`}>
                                            {NIVEL_LABEL[plan.nivel] ?? plan.nivel}
                                        </span>
                                        {progreso === 100 && (
                                            <span className="relative z-10 ml-1.5 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-emerald-600 text-white">
                                                Completado
                                            </span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-4 flex flex-col gap-3">
                                        <h4 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors leading-tight line-clamp-2">
                                            {plan.titulo}
                                        </h4>

                                        <span className="text-[10px] text-neutral-600">
                                            {plan.modulos?.length ?? 0} módulos
                                            <span className="mx-1.5 text-neutral-800">·</span>
                                            {totalTemas} temas
                                        </span>

                                        {/* Barra de progreso */}
                                        <div>
                                            <div className="flex justify-between text-[9px] font-mono text-neutral-700 mb-1">
                                                <span>Progreso</span>
                                                <span>{progreso}%</span>
                                            </div>
                                            <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${progreso}%`,
                                                        backgroundColor: progreso === 100 ? '#10b981' : '#8b5cf6'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 border border-dashed border-neutral-800 rounded-2xl">
                        <div className="text-neutral-700"><BookIcon /></div>
                        <p className="text-sm text-neutral-500">Aún no tienes planes generados</p>
                        <button
                            onClick={() => navigate('/study-plan')}
                            className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all"
                        >
                            Generar mi primer plan
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}
