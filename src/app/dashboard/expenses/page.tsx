import RoleGuard from '@/shared/auth/RoleGuard';
import ExpensesPage from '@/features/expenses/pages/ExpensesPage';

export default function DashboardExpensesRoute() {
    return <RoleGuard><ExpensesPage /></RoleGuard>;
}
