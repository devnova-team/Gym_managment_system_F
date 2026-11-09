import { PublicAuthGate } from '@/shared/components/AuthGate';
import FeatureLoginPage from '@/features/auth/pages/LoginPage';

export default function LoginPage() {
    return (
        <PublicAuthGate>
            <FeatureLoginPage />
        </PublicAuthGate>
    );
}
