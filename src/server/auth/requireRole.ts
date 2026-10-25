import 'server-only';
import { getSession } from './session';
import { hasRole } from './permissions';

export const forbiddenResponse = () => Response.json(
    { success: false, message: 'You do not have permission to perform this action.' },
    { status: 403 },
);

const readSessionUser = async () => {
    const { user } = await getSession();
    try {
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};

/**
 * Early role check in the route handler, so a forbidden request never reaches the backend.
 * The role comes from the session cookie, so it only saves a round trip:
 * the backend still enforces permissions from the verified JWT.
 * Returns a 403 Response when the role is not allowed, otherwise null.
 */
export async function requireRole(allowedRoles) {
    const user = await readSessionUser();
    return hasRole(user, allowedRoles) ? null : forbiddenResponse();
}
