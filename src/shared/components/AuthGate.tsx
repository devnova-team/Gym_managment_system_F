'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../AuthContext/AuthProvider';

export function AuthGate({ children }) {
    const { isAuthenticated, isReady } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (isReady && !isAuthenticated) router.replace('/login');
    }, [isAuthenticated, isReady, router]);

    return isReady && isAuthenticated ? children : null;
}

export function PublicAuthGate({ children }) {
    const { isAuthenticated, isReady } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (isReady && isAuthenticated) router.replace('/dashboard/overview');
    }, [isAuthenticated, isReady, router]);

    return isReady && !isAuthenticated ? children : null;
}
