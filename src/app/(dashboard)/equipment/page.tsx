import RoleGuard from '@/shared/auth/RoleGuard';
import EquipmentPage from '@/features/equipment/pages/EquipmentPage';

export default function EquipmentRoute() {
    return <RoleGuard><EquipmentPage /></RoleGuard>;
}
