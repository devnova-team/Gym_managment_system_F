import RoleGuard from '../../../Routers/RoleGuard';
import ExpensesPage from '../../../features/expenses/components/ExpensesPage';

export default function DashboardExpensesRoute() {
    return <RoleGuard><ExpensesPage /></RoleGuard>;
}
