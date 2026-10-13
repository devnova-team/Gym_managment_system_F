import { baseApi } from '../baseApi';

export const staffApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /api/staff - List gym staff (owner, receptionist, trainer)
        getStaff: builder.query({
            query: () => ({
                url: '/staff',
                method: 'GET',
            }),
            providesTags: ['Staff'],
        }),
        // POST /api/staff - Add new staff member
        createStaff: builder.mutation({
            query: (staffData) => ({
                url: '/staff',
                method: 'POST',
                body: staffData,
            }),
            invalidatesTags: ['Staff'],
        }),
        // GET /api/shifts - Get shift schedules
        getShifts: builder.query({
            query: (params) => ({
                url: '/shifts',
                method: 'GET',
                params,
            }),
            providesTags: ['Shifts'],
        }),
        // POST /api/shifts - Create shift schedule
        createShift: builder.mutation({
            query: (shiftData) => ({
                url: '/shifts',
                method: 'POST',
                body: shiftData,
            }),
            invalidatesTags: ['Shifts'],
        }),
        // POST /api/staff/attendance - Record staff clock in / clock out
        staffAttendance: builder.mutation({
            query: (attendanceData) => ({
                url: '/staff/attendance',
                method: 'POST',
                body: attendanceData,
            }),
            invalidatesTags: ['Staff', 'Shifts'],
        }),
    }),
});

export const {
    useGetStaffQuery,
    useCreateStaffMutation,
    useGetShiftsQuery,
    useCreateShiftMutation,
    useStaffAttendanceMutation,
} = staffApi;
