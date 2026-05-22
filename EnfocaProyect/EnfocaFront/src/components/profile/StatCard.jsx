import React from 'react';

export default function StatCard({ icon: Icon, label, value, subtext, color = "violet" }) {
    // Mapeo de colores para darle un toque brillante sutil al icono
    const colorClasses = {
        violet: "text-violet-400 bg-violet-400/10 border-violet-400/20",
        emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
        blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
        amber: "text-amber-400 bg-amber-400/10 border-amber-400/20"
    };

    return (
        <div className="bg-[#0c0c0c] border border-neutral-800 rounded-2xl p-5 flex flex-col relative overflow-hidden hover:border-neutral-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl border ${colorClasses[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div>
                <h3 className="text-3xl font-light tabular-nums text-white mb-1">{value}</h3>
                <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">{label}</p>
                {subtext && <p className="text-xs text-neutral-600 mt-2">{subtext}</p>}
            </div>
        </div>
    );
}