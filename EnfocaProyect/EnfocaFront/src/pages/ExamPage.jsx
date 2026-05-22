import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { certService } from '../services/api';

const LETRAS = ['A', 'B', 'C', 'D'];

const IconBack    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>;
const IconCheck   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;

export default function ExamPage() {
    const { examenId } = useParams();
    const { state }    = useLocation();
    const navigate     = useNavigate();

    const examen     = state?.examen;
    const preguntas  = examen?.preguntas ?? [];
    const planTitulo = state?.planTitulo ?? 'Plan de estudio';

    const [actual, setActual]       = useState(0);
    const [respuestas, setRespuestas] = useState({});
    const [enviando, setEnviando]   = useState(false);
    const [error, setError]         = useState('');

    if (!examen) {
        navigate('/library');
        return null;
    }

    const pregunta      = preguntas[actual];
    const totalRespondidas = Object.keys(respuestas).length;
    const todasRespondidas = totalRespondidas === preguntas.length;

    const seleccionar = (preguntaId, opcionIdx) => {
        setRespuestas(prev => ({ ...prev, [preguntaId]: opcionIdx }));
    };

    const enviar = async () => {
        if (!todasRespondidas) return;
        setEnviando(true);
        setError('');
        try {
            const { data } = await certService.responder(examenId, { respuestas });
            navigate(`/examen/${examenId}/resultado`, {
                state: { resultado: data, planTitulo }
            });
        } catch (e) {
            setError(e.response?.data?.message || 'Error al enviar el examen.');
            setEnviando(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-neutral-500 hover:text-white text-xs transition-colors"
                >
                    <IconBack /> Volver
                </button>
                <div className="text-center">
                    <p className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase">Examen de certificación</p>
                    <p className="text-sm font-bold text-white truncate max-w-xs">{planTitulo}</p>
                </div>
                <span className="text-xs font-mono text-neutral-500">
                    Intento {examen.intento}/2
                </span>
            </div>

            {/* Progreso */}
            <div className="px-6 py-3 flex items-center gap-3">
                <div className="flex gap-1.5 flex-1">
                    {preguntas.map((p, i) => (
                        <button
                            key={p.id}
                            onClick={() => setActual(i)}
                            className={`h-1.5 flex-1 rounded-full transition-all ${
                                i === actual ? 'bg-amber-400' :
                                respuestas[p.id] !== undefined ? 'bg-amber-400/40' :
                                'bg-neutral-800'
                            }`}
                        />
                    ))}
                </div>
                <span className="text-[10px] font-mono text-neutral-500 flex-shrink-0">
                    {actual + 1}/{preguntas.length}
                </span>
            </div>

            {/* Pregunta */}
            <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto px-6 py-6 gap-6">

                {pregunta && (
                    <>
                        <div>
                            <p className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase mb-3">
                                Pregunta {actual + 1}
                            </p>
                            <p className="text-lg font-medium text-white leading-relaxed">
                                {pregunta.texto}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2.5">
                            {pregunta.opciones?.map((opcion, oi) => {
                                const seleccionada = respuestas[pregunta.id] === oi;
                                return (
                                    <button
                                        key={oi}
                                        onClick={() => seleccionar(pregunta.id, oi)}
                                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left text-sm transition-all ${
                                            seleccionada
                                                ? 'border-amber-500/60 bg-amber-500/10 text-white'
                                                : 'border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white'
                                        }`}
                                    >
                                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                            seleccionada ? 'bg-amber-500 text-black' : 'bg-neutral-800 text-neutral-500'
                                        }`}>
                                            {seleccionada ? <IconCheck /> : LETRAS[oi]}
                                        </span>
                                        {opcion}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Navegación */}
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => setActual(p => Math.max(0, p - 1))}
                                disabled={actual === 0}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-800 text-neutral-400 text-sm hover:border-neutral-600 hover:text-white hover:bg-neutral-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                ← Anterior
                            </button>
                            {actual < preguntas.length - 1 ? (
                                <button
                                    onClick={() => setActual(p => p + 1)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-500/40 text-amber-400 text-sm hover:border-amber-400 hover:bg-amber-500/10 hover:text-amber-300 transition-all"
                                >
                                    Siguiente →
                                </button>
                            ) : null}
                        </div>
                    </>
                )}
            </div>

            {/* Footer con envío */}
            <div className="border-t border-neutral-800 px-6 py-4 flex items-center justify-between">
                <p className="text-xs text-neutral-600">
                    {totalRespondidas} de {preguntas.length} respondidas
                </p>
                <div className="flex items-center gap-3">
                    {error && <p className="text-xs text-red-400">{error}</p>}
                    <button
                        onClick={enviar}
                        disabled={!todasRespondidas || enviando}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {enviando
                            ? <><div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin"/> Calificando...</>
                            : 'Enviar examen'
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}
