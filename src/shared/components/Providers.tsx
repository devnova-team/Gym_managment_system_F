'use client';

import { useEffect, useMemo, useState } from 'react';
import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';
import { makeStore } from '../../store/store';
import { setupListeners } from '@reduxjs/toolkit/query';
import { AuthProvider } from '../../AuthContext/AuthProvider';
import { LanguageProvider } from '../../Context/LanguageContext';
import { ThemeProvider, useTheme } from '../../Context/ThemeContext';
import { ToastProvider } from '../../Context/ToastContext';

const theme = {
    fontFamily: 'Inter, sans-serif',
    primaryColor: 'main',
    colors: {
        main: [
            '#f4feea',
            '#cfffab',
            '#c6f486',
            '#95e913',
            '#85f40f',
            '#85f40f',
            '#6cc80a',
            '#549e06',
            '#3d7603',
            '#275001',
        ],
    },
};

function ThemedProviders({ children }) {
    const { isDarkMode } = useTheme();
    const mantineTheme = useMemo(() => theme, []);

    return (
        <MantineProvider
            forceColorScheme={isDarkMode ? 'dark' : 'light'}
            theme={mantineTheme}
        >
            <LanguageProvider>
                <ToastProvider>{children}</ToastProvider>
            </LanguageProvider>
        </MantineProvider>
    );
}

export default function Providers({ children }) {
    const [store] = useState(makeStore);

    useEffect(() => setupListeners(store.dispatch), [store]);

    return (
        <Provider store={store}>
            <AuthProvider>
                <ThemeProvider>
                    <ThemedProviders>{children}</ThemedProviders>
                </ThemeProvider>
            </AuthProvider>
        </Provider>
    );
}
