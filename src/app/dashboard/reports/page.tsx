import RoleGuard from '@/shared/auth/RoleGuard';
import ReportsPage from '@/features/reports/pages/ReportsPage';

export default function DashboardReportsRoute() {
    return <RoleGuard><ReportsPage /></RoleGuard>;
}
