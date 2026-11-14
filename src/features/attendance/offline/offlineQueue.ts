import { MAX_SYNC_RECORDS } from '../validation/attendanceValidation';
import { toOffsetIso } from '@/features/attendance/utils/attendanceStatus';

// Check-ins recorded while the gym is offline, kept in localStorage until /attendance/sync accepts them.
// The queue is stored per gym so a shared browser never mixes records between gyms.

const storageKey = (gymId) => `gms_attendance_queue_${gymId ?? 'default'}`;

const createLocalId = () => {
    if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    // crypto.randomUUID needs a secure context; plain-http LAN setups fall back to getRandomValues.
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

export const readQueue = (gymId) => {
    try {
        const queue = JSON.parse(window.localStorage.getItem(storageKey(gymId)) ?? '[]');
        return Array.isArray(queue) ? queue : [];
    } catch {
        return [];
    }
};

const writeQueue = (gymId, queue) => {
    try {
        window.localStorage.setItem(storageKey(gymId), JSON.stringify(queue));
    } catch (error) {
        console.error('Offline attendance queue could not be saved', error);
    }
    return queue;
};

/** Adds a check-in to the queue. `local_id` makes the later sync idempotent. */
export const enqueueCheckIn = (gymId, { id, name }) => {
    const record = {
        local_id: createLocalId(),
        member_id: Number(id),
        member_name: name ?? '',
        check_in_time: toOffsetIso(),
    };
    writeQueue(gymId, [...readQueue(gymId), record]);
    return record;
};

/** Removes processed records (synced, already synced or rejected) from the queue. */
export const removeFromQueue = (gymId, localIds) => {
    const processed = new Set(localIds);
    return writeQueue(gymId, readQueue(gymId).filter((record) => !processed.has(record.local_id)));
};

/** Splits the queue into request bodies that respect the backend's per-request limit. */
export const toSyncBatches = (records) => {
    const batches = [];
    for (let start = 0; start < records.length; start += MAX_SYNC_RECORDS) {
        batches.push({
            records: records
                .slice(start, start + MAX_SYNC_RECORDS)
                .map(({ local_id, member_id, check_in_time }) => ({ local_id, member_id, check_in_time })),
        });
    }
    return batches;
};
