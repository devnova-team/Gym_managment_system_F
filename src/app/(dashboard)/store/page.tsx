import RoleGuard from '../../../Routers/RoleGuard';
import StorePage from '../../../features/store/components/StorePage';

export default function StoreRoute() {
    return <RoleGuard><StorePage /></RoleGuard>;
}
