'use client';

import { useContext } from 'react';
import { AuthContext } from '@/features/auth/context/AuthProvider';

export default function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used inside AuthProvider');
    return context;
}
