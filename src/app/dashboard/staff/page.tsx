import RoleGuard from '@/shared/auth/RoleGuard';
import StaffPage from '@/features/staff/pages/StaffPage';

export default function DashboardStaffRoute() {
    return <RoleGuard><StaffPage /></RoleGuard>;
}
