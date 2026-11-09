import RoleGuard from '@/shared/auth/RoleGuard';
import EquipmentPage from '@/features/equipment/pages/EquipmentPage';

export default function DashboardEquipmentRoute() {
    return <RoleGuard><EquipmentPage /></RoleGuard>;
}
