import { useState } from 'react';

const IconClose = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
);
const IconCheck = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12"/>
    </svg>
);
const IconX = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
);

export default function QuizModal({ isOpen, onClose, cuestionario, loading }) {
    const [respuestas, setRespuestas]     = useState({});
    const [enviado, setEnviado]           = useState(false);
    const [preguntaActual, setPreguntaActual] = useState(0);

    if (!isOpen) return null;

    const preguntas = cuestionario?.preguntas ?? [];

    const handleSeleccionar = (pregIdx, opcionIdx) => {
        if (enviado) return;
        setRespuestas(prev => ({ ...prev, [pregIdx]: opcionIdx }));
    };

    const handleEnviar = () => {
        if (Object.keys(respuestas).length < preguntas.length) return;
        setEnviado(true);
    };

    const calcularPuntaje = () => {
        return preguntas.filter((p, i) => respuestas[i] === p.respuestaCorrecta).length;
    };

    const puntaje   = enviado ? calcularPuntaje() : 0;
    const porcentaje = preguntas.length > 0 ? Math.round((puntaje / preguntas.length) * 100) : 0;
    const aprobado   = porcentaje >= 75;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
            <div className="bg-[#0c0c0c] border border-neutral-800 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="flex items-start justify-between border-b border-neutral-800 px-6 py-4 flex-shrink-0">
                    <div>
                        <p className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase mb-1">
                            Cuestionario de Módulo
                        </p>
                        <h2 className="text-lg font-bold text-white">{cuestionario?.moduloTitulo}</h2>
                    </div>
                    <button onClick={onClose} className="text-neutral-600 hover:text-white transition-colors p-1">
                        <IconClose />
                    </button>
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-4">
                            <div className="w-8 h-8 border-2 border-violet-600/30 border-t-violet-500 rounded-full animate-spin" />
                            <p className="text-xs text-neutral-500 tracking-wider">Generando cuestionario con IA...</p>
                        </div>
                    ) : enviado ? (
                        /* Resultado */
                        <div className="flex flex-col items-center gap-6 py-4 text-center">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black border-4 ${aprobado ? 'border-emerald-500 text-emerald-400' : 'border-red-500/50 text-red-400'}`}>
                                {porcentaje}%
                            </div>
                            <div>
                                <h3 className={`text-xl font-bold mb-1 ${aprobado ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {aprobado ? '¡Módulo dominado!' : 'Necesitas repasar'}
                                </h3>
                                <p className="text-sm text-neutral-400">
                                    {puntaje} de {preguntas.length} respuestas correctas
                                </p>
                            </div>
                            {/* Repaso de respuestas */}
                            <div className="w-full flex flex-col gap-3 text-left">
                                {preguntas.map((p, i) => {
                                    const correcta = respuestas[i] === p.respuestaCorrecta;
                                    return (
                                        <div key={i} className={`rounded-xl p-4 border ${correcta ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                                            <div className="flex items-start gap-2 mb-2">
                                                <span className={correcta ? 'text-emerald-400' : 'text-red-400'}>
                                                    {correcta ? <IconCheck /> : <IconX />}
                                                </span>
                                                <p className="text-xs text-white font-medium">{p.texto}</p>
                                            </div>
                                            {!correcta && (
                                                <p className="text-[11px] text-neutral-400 ml-6">
                                                    Correcta: <span className="text-emerald-400">{p.opciones[p.respuestaCorrecta]}</span>
                                                </p>
                                            )}
                                            {p.explicacion && (
                                                <p className="text-[11px] text-neutral-600 ml-6 mt-1 italic">{p.explicacion}</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        /* Pregunta actual */
                        <div className="flex flex-col gap-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-neutral-500 font-mono">
                                    Pregunta {preguntaActual + 1} / {preguntas.length}
                                </span>
                                <div className="flex gap-1">
                                    {preguntas.map((_, i) => (
                                        <button key={i} onClick={() => setPreguntaActual(i)}
                                            className={`w-2 h-2 rounded-full transition-colors ${
                                                i === preguntaActual ? 'bg-violet-500' :
                                                respuestas[i] !== undefined ? 'bg-violet-500/40' : 'bg-neutral-700'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {preguntas[preguntaActual] && (
                                <>
                                    <p className="text-sm font-medium text-white leading-relaxed">
                                        {preguntas[preguntaActual].texto}
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        {preguntas[preguntaActual].opciones.map((opcion, oi) => (
                                            <button
                                                key={oi}
                                                onClick={() => handleSeleccionar(preguntaActual, oi)}
                                                className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                                                    respuestas[preguntaActual] === oi
                                                        ? 'border-violet-500 bg-violet-600/15 text-violet-300'
                                                        : 'border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white'
                                                }`}
                                            >
                                                <span className="font-mono text-neutral-500 mr-2">{['A', 'B', 'C', 'D'][oi]}.</span>
                                                {opcion}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex justify-between">
                                        <button
                                            onClick={() => setPreguntaActual(p => Math.max(0, p - 1))}
                                            disabled={preguntaActual === 0}
                                            className="text-xs text-neutral-600 hover:text-neutral-400 disabled:opacity-30 transition-colors"
                                        >
                                            ← Anterior
                                        </button>
                                        {preguntaActual < preguntas.length - 1 ? (
                                            <button
                                                onClick={() => setPreguntaActual(p => p + 1)}
                                                className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                                            >
                                                Siguiente →
                                            </button>
                                        ) : null}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!loading && (
                    <div className="border-t border-neutral-800 px-6 py-4 flex-shrink-0 flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
                            {enviado ? 'Cerrar' : 'Saltar cuestionario'}
                        </button>
                        {!enviado && (
                            <button
                                onClick={handleEnviar}
                                disabled={Object.keys(respuestas).length < preguntas.length}
                                className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Enviar respuestas
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
