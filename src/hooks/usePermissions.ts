'use client';

import { useCallback, useContext } from 'react';
import { AuthContext } from '../AuthContext/AuthProvider';

// Which roles may perform each action in the UI. The backend enforces the same rules.
export const PERMISSIONS = {
    managePlans: ['owner'],
    manageSubscriptions: ['owner', 'receptionist'],
};

/**
 * Role checks for the current user.
 * Example: `const { can } = usePermissions(); if (can('managePlans')) ...`
 */
export const usePermissions = () => {
    const { user } = useContext(AuthContext) as { user?: { role?: string } | null };
    const role = user?.role?.toLowerCase() ?? null;

    const can = useCallback(
        (action) => Boolean(role && PERMISSIONS[action]?.includes(role)),
        [role],
    );

    return {
        role,
        isOwner: role === 'owner',
        isReceptionist: role === 'receptionist',
        can,
    };
};
