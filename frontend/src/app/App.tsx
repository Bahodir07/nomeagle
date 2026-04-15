import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { UiSettingsProvider } from './store/ui.store';
import { ThemeProvider } from './providers/ThemeProvider';
import { I18nProvider } from './providers/I18nProvider';
import { useAuth } from './store/auth.store';

/**
 * Root application component.
 * Providers: UI store (theme, language + localStorage) -> Theme -> I18n -> Router.
 */

const AppContent: React.FC = () => {
    const { fetchMe } = useAuth();

    useEffect(() => {
        fetchMe();
    }, [fetchMe]);

    return <RouterProvider router={router} />;
};

export const App: React.FC = () => (
    <UiSettingsProvider>
        <ThemeProvider>
            <I18nProvider>
                <AppContent />
            </I18nProvider>
        </ThemeProvider>
    </UiSettingsProvider>
);