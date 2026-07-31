import '../css/app.css';
import './bootstrap';

import { createInertiaApp, usePage, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster, toast } from 'react-hot-toast';
import { useEffect } from 'react';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

import CursorGlow from './Components/CursorGlow';

// Track Meta Pixel PageView on Inertia SPA navigation
if (typeof window !== 'undefined') {
    router.on('navigate', () => {
        if (window.fbq) {
            window.fbq('track', 'PageView');
        }
    });
}

// Wrapper to intercept flash messages and show toasts
const AppWrapper = ({ App, props }) => {
    const flash = props.initialPage.props.flash;
    
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, {
                style: {
                    background: 'rgba(3, 7, 18, 0.8)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)',
                },
                iconTheme: {
                    primary: '#4f46e5',
                    secondary: '#fff',
                },
            });
        }
        if (flash?.error) {
            toast.error(flash.error, {
                style: {
                    background: 'rgba(3, 7, 18, 0.8)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)',
                },
                iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                },
            });
        }
    }, [flash]);

    return (
        <>
            <CursorGlow />
            <App {...props} />
            <Toaster position="top-center" />
        </>
    );
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<AppWrapper App={App} props={props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
