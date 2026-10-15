import { baseApi } from '../baseApi';

export const attendanceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // POST /api/attendance/in-check - Manual member check-in
        checkIn: builder.mutation({
            query: (checkInData) => ({
                url: '/attendance/in-check',
                method: 'POST',
                body: checkInData,
            }),
            invalidatesTags: ['Attendance', 'Dashboard'],
        }),
        // GET /api/attendance/today - Get list of members currently inside the gym today
        getTodayAttendance: builder.query({
            query: () => ({
                url: '/attendance/today',
                method: 'GET',
            }),
            providesTags: ['Attendance'],
        }),
        // POST /api/attendance/sync - Sync offline check-in records using idempotent id_local
        syncOfflineAttendance: builder.mutation({
            query: (payload) => ({
                url: '/attendance/sync',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Attendance', 'Dashboard'],
        }),
    }),
});

export const {
    useCheckInMutation,
    useGetTodayAttendanceQuery,
    useSyncOfflineAttendanceMutation,
} = attendanceApi;
