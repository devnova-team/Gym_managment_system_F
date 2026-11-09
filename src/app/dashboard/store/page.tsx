import RoleGuard from '@/shared/auth/RoleGuard';
import StorePage from '@/features/dashboard/pages/StorePage';

export default function DashboardStoreRoute() {
    return <RoleGuard><StorePage /></RoleGuard>;
}
