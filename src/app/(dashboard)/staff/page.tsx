import RoleGuard from '@/shared/auth/RoleGuard';
import StaffPage from '@/features/staff/pages/StaffPage';

export default function StaffRoute() {
    return <RoleGuard><StaffPage /></RoleGuard>;
}
