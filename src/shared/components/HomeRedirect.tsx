'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../AuthContext/AuthProvider';

export default function HomeRedirect() {
    const { isAuthenticated, isReady } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (isReady) {
            router.replace(isAuthenticated ? '/dashboard/overview' : '/login');
        }
    }, [isAuthenticated, isReady, router]);

    return null;
}
