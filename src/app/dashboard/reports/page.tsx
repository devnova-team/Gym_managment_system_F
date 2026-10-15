import RoleGuard from '../../../Routers/RoleGuard';
import ReportsPage from '../../../features/reports/components/ReportsPage';

export default function DashboardReportsRoute() {
    return <RoleGuard><ReportsPage /></RoleGuard>;
}
