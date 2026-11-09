import RoleGuard from '@/shared/auth/RoleGuard';
import ReportsPage from '@/features/reports/pages/ReportsPage';

export default function ReportsRoute() {
    return <RoleGuard><ReportsPage /></RoleGuard>;
}
