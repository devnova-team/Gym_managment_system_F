import RoleGuard from '../../../Routers/RoleGuard';
import RemindersPage from '../../../features/reminders/components/RemindersPage';

export default function DashboardRemindersRoute() {
    return <RoleGuard allowedRoles={['owner']}><RemindersPage /></RoleGuard>;
}
