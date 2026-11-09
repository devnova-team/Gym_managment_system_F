import RoleGuard from '../../../Routers/RoleGuard';
import StorePage from '../../../features/store/components/StorePage';

export default function DashboardStoreRoute() {
    return <RoleGuard allowedRoles={['owner']}><StorePage /></RoleGuard>;
}
