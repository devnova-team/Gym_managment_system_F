import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { apiRequest } from '../../../Service/httpClient';
import { baseApi } from '../../../Service/baseApi';
import { toList } from '../../../utils/apiResponse';

export const attendanceKeys = {
    all: ['attendance'] as const,
    today: (page) => [...attendanceKeys.all, 'today', page] as const,
    inside: (page) => [...attendanceKeys.all, 'inside', page] as const,
};

const EMPTY_PAGINATION = { current_page: 1, last_page: 1, per_page: 15, total: 0 };

// Both list endpoints share the same shape: { attendances: [...], pagination: {...} }
const selectAttendanceList = (response) => ({
    attendances: toList(response?.data?.attendances),
    pagination: response?.data?.pagination ?? EMPTY_PAGINATION,
});

// ---------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------

// GET /api/attendance/today - Today's attendance records (paginated)
export const useTodayAttendanceQuery = ({ page = 1 } = {}) => useQuery({
    queryKey: attendanceKeys.today(page),
    queryFn: ({ signal }) => apiRequest('/attendance/today', { params: { page }, signal }),
    select: selectAttendanceList,
    placeholderData: keepPreviousData, // keep the current page visible while the next one loads
});

// GET /api/attendance/currently-inside - Members who checked in but not out yet (paginated)
export const useCurrentlyInsideQuery = ({ page = 1 } = {}) => useQuery({
    queryKey: attendanceKeys.inside(page),
    queryFn: ({ signal }) => apiRequest('/attendance/currently-inside', { params: { page }, signal }),
    select: selectAttendanceList,
    placeholderData: keepPreviousData,
});

// ---------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------

// Refreshes the attendance lists, plus RTK Query screens whose data depends on attendance.
const useInvalidateAttendance = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return () => {
        queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
        dispatch(baseApi.util.invalidateTags(['Attendance', 'Dashboard', 'Members']));
    };
};

// POST /api/attendance/check-in - Check in a member
export const useCheckInMutation = () => {
    const invalidate = useInvalidateAttendance();

    return useMutation({
        mutationFn: ({ member_id }: { member_id: number | string }) => apiRequest('/attendance/check-in', { method: 'POST', body: { member_id } }),
        onSuccess: invalidate,
    });
};

// POST /api/attendance/{id}/check-out - Check out an attendance record
export const useCheckOutMutation = () => {
    const invalidate = useInvalidateAttendance();

    return useMutation({
        mutationFn: (attendanceId: number | string) => apiRequest(`/attendance/${encodeURIComponent(attendanceId)}/check-out`, { method: 'POST' }),
        onSuccess: invalidate,
    });
};

// POST /api/attendance/sync - Sync offline check-ins (max 50 records per request)
export const useSyncAttendanceMutation = () => {
    const invalidate = useInvalidateAttendance();

    return useMutation({
        mutationFn: (payload: { records: Record<string, unknown>[] }) => apiRequest('/attendance/sync', { method: 'POST', body: payload }),
        onSuccess: invalidate,
    });
};
