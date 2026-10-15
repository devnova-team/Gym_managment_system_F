'use client';

import Dashboard from '../../screens/Dashboard';
import { AuthGate } from './AuthGate';

export default function DashboardShell({ children }) {
    return (
        <AuthGate>
            <Dashboard>{children}</Dashboard>
        </AuthGate>
    );
}
