import {
    createApi,
    fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

import i18n from 'i18next';

const baseQuery = fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',

    prepareHeaders: (headers, { getState }) => {
        const state = getState() as {
            auth?: {
                accessToken?: string | null;
            };
        };

        const token = state.auth?.accessToken;

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        headers.set(
            'Accept-Language',
            i18n.language || 'en'
        );

        headers.set('Accept', 'application/json');

        return headers;
    },
});

const baseQueryWithReauth = async (
    args: Parameters<typeof baseQuery>[0],
    api: Parameters<typeof baseQuery>[1],
    extraOptions: Parameters<typeof baseQuery>[2]
) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        // Refresh the access token through the Next.js BFF.
        const refreshResult = await baseQuery(
            {
                url: '/api/auth/refresh',
                method: 'POST',
            },
            api,
            extraOptions
        );

        const refreshData = refreshResult.data as
            | {
                access_token?: string;
                data?: {
                    access_token?: string;
                };
            }
            | undefined;

        const newToken =
            refreshData?.data?.access_token ??
            refreshData?.access_token;

        if (newToken) {
            // Store the new access token in Redux memory.
            api.dispatch({
                type: 'auth/setAccessToken',
                payload: newToken,
            });

            // Retry the original request with the new token.
            result = await baseQuery(
                args,
                api,
                extraOptions
            );
        } else {
            // Refresh failed. Clear the session and redirect.
            api.dispatch({
                type: 'auth/logout',
            });

            if (
                typeof window !== 'undefined' &&
                window.location.pathname !== '/login'
            ) {
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
        'Reminders',
    ],

    endpoints: () => ({}),
});