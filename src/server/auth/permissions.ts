export function hasRole(user, allowedRoles) {
    const role = user?.role?.toLowerCase();
    return Boolean(role && allowedRoles.some((allowedRole) => allowedRole.toLowerCase() === role));
}
