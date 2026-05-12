import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import RecoverAccountPage from '../pages/RecoverAccountPage';
import DashboardPage from '../pages/DashboardPage';
import PomodoroPage from '../pages/PomodoroPage';
import FocusModePage from '../pages/FocusModePage';
import StudyPlanPage from '../pages/StudyPlanPage';
import AnalyticsPage from '../pages/AnalyticsPage';

// Rutas Públicas (Accesibles sin iniciar sesión)
export const PUBLIC_ROUTES = [
    {
        path: '/',
        element: LandingPage,
        name: 'Inicio'
    },
    {
        path: '/login',
        element: LoginPage,
        name: 'Login'
    },
    {
        path: '/register',
        element: RegisterPage,
        name: 'Registro'
    },
    {
        path: '/recover',
        element: RecoverAccountPage,
        name: 'Recuperar Cuenta'
    }
];

// Rutas Privadas (Protegidas)
export const PRIVATE_ROUTES = [
    {
        path: '/dashboard',
        element: DashboardPage,
        name: 'Dashboard'
    },
    {
        path: '/pomodoro',
        element: PomodoroPage,
        name: 'Enfoque', // Vinculado al enlace del Navbar
        icon: 'TimerIcon'
    },
    {
        path: '/focus-mode',
        element: FocusModePage,
        name: 'Modo Deep Focus',
        icon: 'FocusIcon'
    },
    {
        path: '/study-plan',
        element: StudyPlanPage,
        name: 'Plan de Estudio',
        icon: 'BookOpenIcon'
    },
    {
        path: '/analytics',
        element: AnalyticsPage,
        name: 'Análisis',
        icon: 'AnalyticsIcon'
    }
];

export const allRoutes = [...PUBLIC_ROUTES, ...PRIVATE_ROUTES];