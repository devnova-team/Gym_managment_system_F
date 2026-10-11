import RoleGuard from '../../../Routers/RoleGuard';
import ReportsPage from '../../../features/reports/components/ReportsPage';

export default function ReportsRoute() {
    return <RoleGuard><ReportsPage /></RoleGuard>;
}
