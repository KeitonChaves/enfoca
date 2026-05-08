import React from 'react';

const StudyPlansPage = () => {
    return (
        <div className="min-h-full bg-[#0a0a0a] p-6 flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <h1 className="text-base font-semibold text-white">Study Plans</h1>
                <span className="text-white/20">|</span>
                <span className="text-[12px] text-white/40 font-mono">AI-powered curriculum</span>
            </div>
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">☰</div>
                    <p className="text-white/50 text-sm font-medium">Study Plans en construcción</p>
                    <p className="text-white/25 text-xs mt-1">Próximamente: planes generados por IA</p>
                </div>
            </div>
        </div>
    );
};

export default StudyPlansPage;
