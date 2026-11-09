'use client';

import Dashboard from '@/shared/layout/Dashboard';
import { AuthGate } from '@/shared/components/AuthGate';

export default function DashboardShell({ children }) {
    return (
        <AuthGate>
            <Dashboard>{children}</Dashboard>
        </AuthGate>
    );
}
