export const ATTENDANCE_STATUSES = ['inside', 'checked_out'];

export const ATTENDANCE_STATUS_STYLES = {
    inside: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    checked_out: 'bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20',
};

/**
 * ISO 8601 timestamp with an explicit offset ("2026-10-25T18:00:00+00:00"),
 * the format the backend requires for offline check-ins.
 */
export const toOffsetIso = (date = new Date()) => date.toISOString().replace(/\.\d{3}Z$/, '+00:00');

// Minutes -> "1h 05m" / "45m". Returns null while the member is still inside.
export const formatDuration = (minutes) => {
    if (minutes === null || minutes === undefined) return null;
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return hours > 0 ? `${hours}h ${String(rest).padStart(2, '0')}m` : `${rest}m`;
};
