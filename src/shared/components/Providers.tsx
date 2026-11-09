'use client';

import { useEffect, useMemo, useState } from 'react';
import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { makeStore } from '@/shared/state/store';
import { makeQueryClient } from '@/shared/api/queryClient';
import { setupListeners } from '@reduxjs/toolkit/query';
import { AuthProvider } from '@/features/auth/context/AuthProvider';
import { LanguageProvider } from '@/shared/providers/LanguageContext';
import { ThemeProvider, useTheme } from '@/shared/providers/ThemeContext';
import { ToastProvider } from '@/shared/providers/ToastContext';

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
    const [queryClient] = useState(makeQueryClient);

    useEffect(() => setupListeners(store.dispatch), [store]);

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <ThemeProvider>
                        <ThemedProviders>{children}</ThemedProviders>
                    </ThemeProvider>
                </AuthProvider>
            </QueryClientProvider>
        </Provider>
    );
}
