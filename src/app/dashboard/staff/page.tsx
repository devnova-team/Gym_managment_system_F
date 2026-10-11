import RoleGuard from '../../../Routers/RoleGuard';
import StaffPage from '../../../features/staff/components/StaffPage';

export default function DashboardStaffRoute() {
    return <RoleGuard><StaffPage /></RoleGuard>;
}
