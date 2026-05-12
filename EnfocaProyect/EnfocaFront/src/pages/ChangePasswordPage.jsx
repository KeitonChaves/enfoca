import { useState } from 'react';
import { profileService } from '../services/api';

const IconLock = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const IconEye = ({ open }) => open ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const IconCheck = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const RULES = [
    { id: 'length',  label: 'Mínimo 8 caracteres',               test: (v) => v.length >= 8 },
    { id: 'letter',  label: 'Al menos una letra',                 test: (v) => /[a-zA-Z]/.test(v) },
    { id: 'number',  label: 'Al menos un número',                 test: (v) => /\d/.test(v) },
];

function PasswordField({ id, label, value, onChange, show, onToggle, error }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-[11px] font-semibold tracking-widest text-neutral-500 uppercase">
                {label}
            </label>
            <div className={`flex items-center gap-2 bg-neutral-900/60 border rounded-lg px-3 py-2.5 transition-colors ${
                error ? 'border-red-500/50' : 'border-neutral-800 focus-within:border-neutral-600'
            }`}>
                <span className="text-neutral-600"><IconLock /></span>
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
                    className="text-neutral-600 hover:text-neutral-400 transition-colors"
                    tabIndex={-1}
                >
                    <IconEye open={show} />
                </button>
            </div>
            {error && <p className="text-[11px] text-red-400">{error}</p>}
        </div>
    );
}

export default function ChangePasswordPage() {
    const [form, setForm]       = useState({ current: '', next: '', confirm: '' });
    const [show, setShow]       = useState({ current: false, next: false, confirm: false });
    const [errors, setErrors]   = useState({});
    const [status, setStatus]   = useState(null); // 'loading' | 'success' | 'error'
    const [serverMsg, setServerMsg] = useState('');

    const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
    const toggle = (field) => () => setShow((s) => ({ ...s, [field]: !s[field] }));

    const validate = () => {
        const e = {};
        if (!form.current.trim())        e.current = 'Ingresa tu contraseña actual.';
        if (!form.next)                  e.next    = 'Ingresa la nueva contraseña.';
        else if (form.next.length < 8)   e.next    = 'Debe tener al menos 8 caracteres.';
        else if (!/[a-zA-Z]/.test(form.next)) e.next = 'Debe contener al menos una letra.';
        else if (!/\d/.test(form.next))  e.next    = 'Debe contener al menos un número.';
        if (form.next && form.confirm !== form.next) e.confirm = 'Las contraseñas no coinciden.';
        else if (!form.confirm)          e.confirm = 'Confirma la nueva contraseña.';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerMsg('');
        const e_ = validate();
        setErrors(e_);
        if (Object.keys(e_).length > 0) return;

        setStatus('loading');
        try {
            await profileService.changePassword({
                currentPassword: form.current,
                newPassword: form.next,
            });
            setStatus('success');
            setForm({ current: '', next: '', confirm: '' });
            setErrors({});
        } catch (err) {
            setStatus('error');
            const msg = err.response?.data?.message || err.response?.data?.error;
            setServerMsg(msg || 'No se pudo actualizar la contraseña. Verifica que la actual sea correcta.');
        }
    };

    const nextValid = RULES.every((r) => r.test(form.next));

    return (
        <div className="p-4 md:p-8 flex justify-center">
            <div className="w-full max-w-md">

                <div className="mb-8">
                    <h1 className="text-sm font-bold tracking-widest text-white uppercase">Cambiar Contraseña</h1>
                    <p className="text-[11px] text-neutral-600 tracking-wider mt-1">
                        Actualiza tus credenciales de acceso a Enfoca.
                    </p>
                </div>

                {status === 'success' && (
                    <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                        <IconCheck />
                        Contraseña actualizada correctamente.
                    </div>
                )}

                {status === 'error' && serverMsg && (
                    <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                        {serverMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    <PasswordField
                        id="current"
                        label="Contraseña actual"
                        value={form.current}
                        onChange={set('current')}
                        show={show.current}
                        onToggle={toggle('current')}
                        error={errors.current}
                    />

                    <div className="flex flex-col gap-1.5">
                        <PasswordField
                            id="next"
                            label="Nueva contraseña"
                            value={form.next}
                            onChange={set('next')}
                            show={show.next}
                            onToggle={toggle('next')}
                            error={errors.next}
                        />

                        {form.next.length > 0 && (
                            <div className="flex flex-col gap-1 mt-1">
                                {RULES.map((r) => {
                                    const ok = r.test(form.next);
                                    return (
                                        <div key={r.id} className={`flex items-center gap-2 text-[11px] transition-colors ${ok ? 'text-emerald-400' : 'text-neutral-600'}`}>
                                            <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${ok ? 'border-emerald-500 bg-emerald-500/20' : 'border-neutral-700'}`}>
                                                {ok && <IconCheck />}
                                            </span>
                                            {r.label}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <PasswordField
                        id="confirm"
                        label="Confirmar nueva contraseña"
                        value={form.confirm}
                        onChange={set('confirm')}
                        show={show.confirm}
                        onToggle={toggle('confirm')}
                        error={errors.confirm}
                    />

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="mt-2 w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'loading' ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Actualizando...
                            </span>
                        ) : 'Actualizar contraseña'}
                    </button>
                </form>
            </div>
        </div>
    );
}
