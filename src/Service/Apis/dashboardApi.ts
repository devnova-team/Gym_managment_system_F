import { baseApi } from '../baseApi';

export const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /api/dashboard/stats - KPI cards, 4 segment counters, and chart trends in a single call
        getDashboardStats: builder.query({
            query: (params) => ({
                url: '/dashboard/stats',
                method: 'GET',
                params,
            }),
            providesTags: ['Dashboard'],
        }),
    }),
});

export const {
    useGetDashboardStatsQuery,
} = dashboardApi;
