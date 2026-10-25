import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './httpClient';

// Client errors (4xx) won't change on retry; only retry network/server failures.
const shouldRetry = (failureCount, error) => {
    if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
    return failureCount < 2;
};

export const makeQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30 * 1000,
            refetchOnWindowFocus: false,
            retry: shouldRetry,
        },
        mutations: {
            retry: false,
        },
    },
});
