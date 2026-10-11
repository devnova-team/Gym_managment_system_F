import { baseApi } from '../baseApi';

export const remindersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /api/reminders - List administrative reminders
        getReminders: builder.query({
            query: () => ({
                url: '/reminders',
                method: 'GET',
            }),
            providesTags: ['Reminders'],
        }),
        // POST /api/reminders - Create administrative reminder/task
        createReminder: builder.mutation({
            query: (reminderData) => ({
                url: '/reminders',
                method: 'POST',
                body: reminderData,
            }),
            invalidatesTags: ['Reminders'],
        }),
    }),
});

export const {
    useGetRemindersQuery,
    useCreateReminderMutation,
} = remindersApi;
