import { baseApi } from '../baseApi';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // POST /api/auth/login - email/phone + password -> returns Token, Cookie, user role, gym_id
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),
        // POST /api/auth/refresh - Refresh Access Token via HttpOnly cookie
        refreshToken: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'POST',
            }),
            invalidatesTags: ['Auth'],
        }),
        // POST /api/auth/logout - Terminate session
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            invalidatesTags: ['Auth'],
        }),
    }),
});

export const {
    useLoginMutation,
    useRefreshTokenMutation,
    useLogoutMutation,
} = authApi;
