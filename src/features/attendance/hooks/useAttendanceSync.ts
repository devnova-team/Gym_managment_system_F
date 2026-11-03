'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../../AuthContext/AuthProvider';
import { useSyncAttendanceMutation } from '../api/attendanceQueries';
import { enqueueCheckIn, readQueue, removeFromQueue, toSyncBatches } from '../offline/offlineQueue';

/**
 * Offline check-in queue + automatic sync when the connection returns.
 *
 * const { pendingRecords, isOnline, isSyncing, enqueue, syncNow } = useAttendanceSync({ onSynced });
 * enqueue({ id: member.id, name: member.name }); // while offline
 *
 * `onSynced({ synced, rejected })` runs after every sync that processed records.
 * Records the backend processed are removed from the queue (a rejected record
 * would be rejected again, so it is not retried); a failed request keeps them for the next try.
 */
export const useAttendanceSync = ({ onSynced }: { onSynced?: (summary: { synced: number; rejected: number }) => void } = {}) => {
    const { user } = useContext(AuthContext) as { user?: { gym_id?: number | string | null } | null };
    const gymId = user?.gym_id ?? null;
    const syncMutation = useSyncAttendanceMutation();

    // The queue lives in localStorage, so it is read after mount to keep server and client markup equal.
    const [pendingRecords, setPendingRecords] = useState([]);
    const [isOnline, setIsOnline] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const isSyncingRef = useRef(false);
    const onSyncedRef = useRef(onSynced);
    onSyncedRef.current = onSynced;

    const refreshQueue = useCallback(() => setPendingRecords(readQueue(gymId)), [gymId]);

    const syncNow = useCallback(async () => {
        const records = readQueue(gymId);
        if (!records.length || isSyncingRef.current || !navigator.onLine) return;

        isSyncingRef.current = true;
        setIsSyncing(true);
        const summary = { synced: 0, rejected: 0 };

        try {
            for (const batch of toSyncBatches(records)) {
                const response = await syncMutation.mutateAsync(batch);
                const results = response?.data?.results ?? [];

                results.forEach(({ status }) => {
                    if (status === 'rejected') summary.rejected += 1;
                    else summary.synced += 1;
                });
                removeFromQueue(gymId, results.map(({ local_id }) => local_id));
            }
        } catch (error) {
            console.error('Attendance sync failed; records stay queued', error);
        } finally {
            isSyncingRef.current = false;
            setIsSyncing(false);
            refreshQueue();
            if (summary.synced || summary.rejected) onSyncedRef.current?.(summary);
        }
    }, [gymId, refreshQueue, syncMutation]);

    // Keep a stable reference for the effect below (mutation objects change every render).
    const syncNowRef = useRef(syncNow);
    syncNowRef.current = syncNow;

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            syncNowRef.current();
        };
        const handleOffline = () => setIsOnline(false);

        setIsOnline(navigator.onLine);
        refreshQueue();
        syncNowRef.current(); // Records left over from a previous session

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [refreshQueue]);

    const enqueue = useCallback((member) => {
        const record = enqueueCheckIn(gymId, member);
        refreshQueue();
        return record;
    }, [gymId, refreshQueue]);

    return { pendingRecords, isOnline, isSyncing, enqueue, syncNow };
};
