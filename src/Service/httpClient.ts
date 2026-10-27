import Cookies from 'js-cookie';
import i18n from 'i18next';

// Fetch-based client for TanStack Query. Mirrors baseApi (RTK Query):
// Bearer token, Accept-Language, and one refresh-and-retry on 401.

const API_BASE_URL = '/api';

type RequestOptions = {
    method?: string;
    body?: unknown;
    params?: Record<string, unknown>;
    signal?: AbortSignal;
};

export class ApiError extends Error {
    status: number;
    data: unknown;

    constructor(status, data) {
        super(data?.message || `Request failed with status ${status}`);
        this.name = 'ApiError';
        this.status = status;
        this.data = data; // Same shape as RTK Query errors, so getApiErrorMessage() works for both.
    }
}

const getAccessToken = () => Cookies.get('token')
    || (typeof window !== 'undefined' ? window.localStorage.getItem('token') : null);

const clearSessionAndRedirect = () => {
    Cookies.remove('isAuthenticated');
    Cookies.remove('user');
    Cookies.remove('token');
    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
};

const buildUrl = (path: string, params: RequestOptions['params']) => {
    const query = new URLSearchParams(
        Object.entries(params ?? {})
            .filter(([, value]) => value !== undefined && value !== null && value !== '')
            .map(([key, value]) => [key, String(value)]),
    ).toString();
    return `${API_BASE_URL}${path}${query ? `?${query}` : ''}`;
};

const send = (path: string, { method = 'GET', body, params, signal }: RequestOptions) => {
    const headers = new Headers({
        Accept: 'application/json',
        'Accept-Language': i18n.language || 'en',
    });
    const token = getAccessToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
    if (body !== undefined) headers.set('Content-Type', 'application/json');

    const init: RequestInit = { method, headers, credentials: 'include', signal }; // credentials: HttpOnly refresh cookie
    if (body !== undefined) init.body = JSON.stringify(body);

    return fetch(buildUrl(path, params), init);
};

// Concurrent 401s share one refresh call: the refresh token rotates, so a second call would fail.
let refreshPromise = null;

const refreshAccessToken = () => {
    refreshPromise ??= send('/auth/refresh', { method: 'POST' })
        .then(async (response) => {
            const token = response.ok ? (await response.json())?.data?.access_token : null;
            if (token) Cookies.set('token', token);
            return Boolean(token);
        })
        .catch(() => false)
        .finally(() => { refreshPromise = null; });
    return refreshPromise;
};

const parseBody = async (response) => {
    const text = await response.text();
    try {
        return text ? JSON.parse(text) : null;
    } catch {
        return { message: text };
    }
};

/**
 * Calls the app's /api routes and returns the parsed JSON body.
 * Throws ApiError (with `status` and `data`) for non-2xx responses.
 */
export async function apiRequest(path: string, options: RequestOptions = {}) {
    let response = await send(path, options);

    if (response.status === 401) {
        if (await refreshAccessToken()) {
            response = await send(path, options);
        } else {
            clearSessionAndRedirect();
        }
    }

    const data = await parseBody(response);
    if (!response.ok) throw new ApiError(response.status, data);
    return data;
}
