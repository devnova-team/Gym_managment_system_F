import RoleGuard from '@/shared/auth/RoleGuard';
import RemindersPage from '@/features/reminders/pages/RemindersPage';

export default function RemindersRoute() {
    return <RoleGuard><RemindersPage /></RoleGuard>;
}
