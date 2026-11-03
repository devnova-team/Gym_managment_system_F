'use client';

import { usePermissions } from '@/features/auth/hooks/usePermissions';
import { ApiError } from '@/shared/api/httpClient';
import {
    useCheckInMutation,
    useCheckOutMutation,
    useCurrentlyInsideQuery,
    useTodayAttendanceQuery,
} from '../api/attendanceQueries';
import { useAttendanceSync } from './useAttendanceSync';

const EMPTY_PAGINATION = { current_page: 1, last_page: 1, per_page: 15, total: 0 };

/**
 * Everything a screen needs to read and manage attendance.
 *
 * const { attendances, checkIn, checkOut, sync } = useAttendance({ view: 'today', page });
 * const { queued } = await checkIn({ id: member.id, name: member.name });
 * await checkOut(attendance.id);
 *
 * - `view` picks the list: "today" (all of today's records) or "inside" (not checked out yet).
 * - `checkIn` saves the record offline when there is no connection and returns `{ queued: true }`;
 *   the queue syncs by itself when the connection returns (see `sync`).
 * - Mutations reject with ApiError (use getApiErrorMessage to show it).
 */
export const useAttendance = ({
    view = 'today',
    page = 1,
    onSynced,
}: { view?: 'today' | 'inside'; page?: number; onSynced?: (summary: { synced: number; rejected: number }) => void } = {}) => {
    const { can } = usePermissions();
    const todayQuery = useTodayAttendanceQuery({ page: view === 'today' ? page : 1 });
    const insideQuery = useCurrentlyInsideQuery({ page: view === 'inside' ? page : 1 });
    const checkInMutation = useCheckInMutation();
    const checkOutMutation = useCheckOutMutation();
    const sync = useAttendanceSync({ onSynced });

    const activeQuery = view === 'inside' ? insideQuery : todayQuery;

    const checkIn = async (member: { id: number | string; name?: string }) => {
        if (!sync.isOnline) return { queued: true, attendance: null, record: sync.enqueue(member) };

        try {
            const response = await checkInMutation.mutateAsync({ member_id: member.id });
            return { queued: false, attendance: response?.data?.attendance ?? null, record: null };
        } catch (error) {
            if (error instanceof ApiError) throw error; // The backend answered: show its message
            return { queued: true, attendance: null, record: sync.enqueue(member) }; // No answer: keep it for later
        }
    };

    return {
        attendances: activeQuery.data?.attendances ?? [],
        pagination: activeQuery.data?.pagination ?? EMPTY_PAGINATION,
        todayTotal: todayQuery.data?.pagination.total ?? 0,
        insideTotal: insideQuery.data?.pagination.total ?? 0,
        isLoading: activeQuery.isPending,
        isFetching: activeQuery.isFetching,
        isError: activeQuery.isError,
        refetch: activeQuery.refetch,

        checkIn,
        checkOut: checkOutMutation.mutateAsync,
        isCheckingIn: checkInMutation.isPending,
        isCheckingOut: checkOutMutation.isPending,
        checkingOutId: checkOutMutation.isPending ? checkOutMutation.variables : null,

        sync,
        canManageAttendance: can('manageAttendance'),
    };
};
