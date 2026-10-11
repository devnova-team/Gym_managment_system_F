import RoleGuard from '../../../Routers/RoleGuard';
import EquipmentPage from '../../../features/equipment/components/EquipmentPage';

export default function DashboardEquipmentRoute() {
    return <RoleGuard><EquipmentPage /></RoleGuard>;
}
