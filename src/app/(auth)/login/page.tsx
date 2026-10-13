import { PublicAuthGate } from '../../../shared/components/AuthGate';
import LoginForm from '../../../features/auth/components/LoginForm';

export default function LoginPage() {
    return (
        <PublicAuthGate>
            <LoginForm />
        </PublicAuthGate>
    );
}
