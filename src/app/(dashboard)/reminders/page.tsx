import RoleGuard from '../../../Routers/RoleGuard';
import RemindersPage from '../../../features/reminders/components/RemindersPage';

export default function RemindersRoute() {
    return <RoleGuard><RemindersPage /></RoleGuard>;
}
