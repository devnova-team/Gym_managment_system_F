import RoleGuard from '../../../Routers/RoleGuard';
import EquipmentPage from '../../../features/equipment/components/EquipmentPage';

export default function EquipmentRoute() {
    return <RoleGuard><EquipmentPage /></RoleGuard>;
}
