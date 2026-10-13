import { baseApi } from '../baseApi';

export const reportsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /api/reports/financial-summary - Period summary: Cash Subscriptions + Store Sales - Expenses = Net Profit
        getFinancialSummary: builder.query({
            query: (params) => ({
                url: '/reports/financial-summary',
                method: 'GET',
                params,
            }),
            providesTags: ['Reports'],
        }),
    }),
});

export const {
    useGetFinancialSummaryQuery,
} = reportsApi;
