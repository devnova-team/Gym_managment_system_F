import DashboardShell from '../../shared/components/DashboardShell';

export default function ProtectedDashboardLayout({ children }) {
    return <DashboardShell>{children}</DashboardShell>;
}
