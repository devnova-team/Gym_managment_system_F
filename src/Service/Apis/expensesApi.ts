import { baseApi } from '../baseApi';

export const expensesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /api/expenses - List and filter operational expenses (rent, salaries, bills, maintenance, other)
        getExpenses: builder.query({
            query: (params) => ({
                url: '/expenses',
                method: 'GET',
                params,
            }),
            providesTags: ['Expenses'],
        }),
        // POST /api/expenses - Record new expense
        createExpense: builder.mutation({
            query: (expenseData) => ({
                url: '/expenses',
                method: 'POST',
                body: expenseData,
            }),
            invalidatesTags: ['Expenses', 'Reports', 'Dashboard'],
        }),
    }),
});

export const {
    useGetExpensesQuery,
    useCreateExpenseMutation,
} = expensesApi;
