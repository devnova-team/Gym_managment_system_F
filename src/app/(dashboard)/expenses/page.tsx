import RoleGuard from '../../../Routers/RoleGuard';
import ExpensesPage from '../../../features/expenses/components/ExpensesPage';

export default function ExpensesRoute() {
    return <RoleGuard><ExpensesPage /></RoleGuard>;
}
