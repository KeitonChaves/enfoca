import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import SplitCardLayout from '../layouts/SplitCardLayout.jsx';
import AuthSidebarGraphic from '../components/auth/AuthSidebarGraphic';
import { authService } from '../services/api';

const RULES = [
    { id: 'length', label: 'Mínimo 8 caracteres',  test: (v) => v.length >= 8 },
    { id: 'letter', label: 'Al menos una letra',   test: (v) => /[a-zA-Z]/.test(v) },
    { id: 'number', label: 'Al menos un número',   test: (v) => /\d/.test(v) },
];

function PasswordInput({ label, id, value, onChange, show, onToggle, error }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-xs font-medium text-neutral-400">
                {label}
            </label>
            <div className={`flex items-center gap-2 border rounded-lg px-3 py-2.5 bg-neutral-900/50 transition-colors ${
                error ? 'border-red-500/50' : 'border-neutral-800 focus-within:border-neutral-600'
            }`}>
                <input
                    id={id}
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    autoComplete="new-password"
                    className="flex-1 bg-transparent text-sm text-white placeholder-neutral-600 outline-none"
                />
                <button
                    type="button"
                    onClick={onToggle}
                    tabIndex={-1}
                    className="text-neutral-600 hover:text-neutral-400 text-xs transition-colors"
                >
                    {show ? 'Ocultar' : 'Ver'}
                </button>
            </div>
            {error && <p className="text-[11px] text-red-400">{error}</p>}
        </div>
    );
}

export default function ResetPasswordPage() {
    const [searchParams]        = useSearchParams();
    const token                 = searchParams.get('token') ?? '';

    const [newPassword, setNewPassword]     = useState('');
    const [confirm, setConfirm]             = useState('');
    const [showNew, setShowNew]             = useState(false);
    const [showConfirm, setShowConfirm]     = useState(false);
    const [errors, setErrors]               = useState({});
    const [status, setStatus]               = useState(null); // 'loading' | 'success' | 'error'
    const [serverMsg, setServerMsg]         = useState('');
    const [countdown, setCountdown]         = useState(3);

    const navigate = useNavigate();

    if (!token) {
        return (
            <SplitCardLayout
                graphicContent={
                    <AuthSidebarGraphic
                        headlineText="Restablece tu contraseña."
                        imageSrc="/recovery.png"
                        imageAlt="Acceso seguro"
                    />
                }
                invertOrder={false}
            >
                <div className="flex flex-col justify-center h-full gap-6">
                    <div>
                        <h1 className="text-3xl font-semibold mb-2 text-white tracking-tight">Enlace inválido</h1>
                        <p className="text-neutral-400 text-sm">
                            Este enlace no contiene un token de recuperación válido.
                        </p>
                    </div>
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                        El enlace puede haber expirado o estar mal formado. Solicita uno nuevo.
                    </div>
                    <Link
                        to="/recover"
                        className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium py-3 rounded-lg transition-all text-center text-sm"
                    >
                        Solicitar nuevo enlace
                    </Link>
                    <p className="text-center text-xs text-neutral-500">
                        ¿Recuerdas tu contraseña?{' '}
                        <Link to="/login" className="text-violet-500 hover:text-violet-400 transition-colors">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </SplitCardLayout>
        );
    }

    const validate = () => {
        const e = {};
        if (!newPassword)                     e.newPassword = 'Ingresa la nueva contraseña.';
        else if (newPassword.length < 8)      e.newPassword = 'Debe tener al menos 8 caracteres.';
        else if (!/[a-zA-Z]/.test(newPassword)) e.newPassword = 'Debe contener al menos una letra.';
        else if (!/\d/.test(newPassword))     e.newPassword = 'Debe contener al menos un número.';
        if (!confirm)                         e.confirm = 'Confirma la nueva contraseña.';
        else if (confirm !== newPassword)     e.confirm = 'Las contraseñas no coinciden.';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerMsg('');
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setStatus('loading');
        try {
            await authService.resetPassword({ token, newPassword });
            setStatus('success');
            setNewPassword('');
            setConfirm('');

            let secs = 3;
            setCountdown(secs);
            const timer = setInterval(() => {
                secs -= 1;
                setCountdown(secs);
                if (secs <= 0) {
                    clearInterval(timer);
                    navigate('/login');
                }
            }, 1000);
        } catch (err) {
            setStatus('error');
            const msg = err.response?.data?.message || err.response?.data?.error;
            setServerMsg(msg || 'El enlace ha expirado o ya fue utilizado. Solicita uno nuevo.');
        }
    };

    return (
        <SplitCardLayout
            graphicContent={
                <AuthSidebarGraphic
                    headlineText="Restablece tu contraseña."
                    imageSrc="/recovery.png"
                    imageAlt="Acceso seguro"
                />
            }
            invertOrder={false}
        >
            <div className="flex flex-col justify-center h-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold mb-2 text-white tracking-tight">Nueva contraseña</h1>
                    <p className="text-neutral-400 text-sm">
                        Elige una contraseña segura para tu cuenta de Enfoca.
                    </p>
                </div>

                {status === 'success' && (
                    <div className="mb-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                        Contraseña actualizada. Redirigiendo al login en{' '}
                        <span className="font-bold">{countdown}s</span>...
                    </div>
                )}

                {status === 'error' && serverMsg && (
                    <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                        {serverMsg}
                        {' '}
                        <Link to="/recover" className="underline hover:text-red-300 transition-colors">
                            Solicitar nuevo enlace
                        </Link>
                    </div>
                )}

                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1.5">
                        <PasswordInput
                            id="newPassword"
                            label="Nueva contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            show={showNew}
                            onToggle={() => setShowNew((v) => !v)}
                            error={errors.newPassword}
                        />

                        {newPassword.length > 0 && (
                            <div className="flex flex-col gap-1 mt-1">
                                {RULES.map((r) => {
                                    const ok = r.test(newPassword);
                                    return (
                                        <div key={r.id} className={`flex items-center gap-2 text-[11px] transition-colors ${ok ? 'text-emerald-400' : 'text-neutral-600'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${ok ? 'bg-emerald-400' : 'bg-neutral-700'}`} />
                                            {r.label}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <PasswordInput
                        id="confirm"
                        label="Confirmar contraseña"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        show={showConfirm}
                        onToggle={() => setShowConfirm((v) => !v)}
                        error={errors.confirm}
                    />

                    <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium py-3 rounded-lg transition-all flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'loading' ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            'Restablecer contraseña'
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-xs text-neutral-500">
                    ¿Recuerdas tu contraseña?{' '}
                    <Link to="/login" className="text-violet-500 hover:text-violet-400 transition-colors">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </SplitCardLayout>
    );
}
