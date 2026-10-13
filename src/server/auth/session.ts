import 'server-only';
import { cookies } from 'next/headers';

export async function getSession() {
    const cookieStore = await cookies();
    return {
        accessToken: cookieStore.get('token')?.value ?? null,
        user: cookieStore.get('user')?.value ?? null,
    };
}
