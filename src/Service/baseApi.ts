import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import i18n from 'i18next';

const apiBaseUrl = '/api';

const baseQuery = fetchBaseQuery({
    baseUrl: apiBaseUrl,
    credentials: 'include', // For HttpOnly refresh token cookie
    prepareHeaders: (headers) => {
        const token = Cookies.get('token') || (typeof window !== 'undefined' && window.localStorage.getItem('token'));
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        const language = i18n.language || 'en';
        headers.set('Accept-Language', language);
        headers.set('Accept', 'application/json');

        return headers;
    },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // Try refreshing access token using HttpOnly refresh cookie
        const refreshResult = await baseQuery(
            { url: '/auth/refresh', method: 'POST' },
            api,
            extraOptions
        );

        if (refreshResult.data && refreshResult.data.data?.access_token) {
            const newToken = refreshResult.data.data.access_token;
            Cookies.set('token', newToken);
            // Retry initial query with fresh token
            result = await baseQuery(args, api, extraOptions);
        } else {
            // Clean up session and redirect to login
            Cookies.remove('isAuthenticated');
            Cookies.remove('user');
            Cookies.remove('token');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        'Auth',
        'Members',
        'Plans',
        'Subscriptions',
        'Attendance',
        'Communication',
        'Dashboard',
        'Staff',
        'Shifts',
        'Expenses',
        'Reports',
        'Store',
        'Equipment',
        'Reminders'
    ],
    endpoints: () => ({}),
});
