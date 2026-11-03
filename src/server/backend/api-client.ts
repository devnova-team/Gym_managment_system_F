import 'server-only';

const BACKEND_URL_ENV_KEYS = [
    'GYM_API_BASE_URL',
    'API_BASE_URL',
    'VITE_API_BASE_URL',
] as const;

const REQUEST_HEADER_NAMES = [
    'accept',
    'accept-language',
    'authorization',
    'content-type',
    'cookie',
] as const;

const RESPONSE_HEADER_NAMES = ['content-type', 'cache-control'] as const;

const getConfiguredBaseUrl = () => (
    BACKEND_URL_ENV_KEYS
        .map((key) => process.env[key])
        .find((value) => Boolean(value))
);

export const getBackendUrl = (path: string, search = ''): URL | null => {
    const baseUrl = getConfiguredBaseUrl();
    if (!baseUrl) return null;

    const url = new URL(`${baseUrl.replace(/\/+$/, '')}/`);
    if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('GYM_API_BASE_URL must use HTTP or HTTPS');
    }

    const basePath = url.pathname.replace(/\/+$/, '');
    if (!/(^|\/)api$/i.test(basePath)) {
        url.pathname = `${basePath}/api`;
    }
    url.pathname = `${url.pathname.replace(/\/+$/, '')}/`;

    const target = new URL(path.replace(/^\/+/, ''), url);
    target.search = search;
    return target;
};

const getRequestBody = async (request: Request, parsedBody: unknown) => {
    if (parsedBody !== undefined) return JSON.stringify(parsedBody);
    if (['GET', 'HEAD'].includes(request.method)) return undefined;
    return request.arrayBuffer();
};

const getForwardedRequestHeaders = (request: Request, hasParsedBody: boolean) => {
    const headers = new Headers();

    for (const name of REQUEST_HEADER_NAMES) {
        const value = request.headers.get(name);
        if (value) headers.set(name, value);
    }

    if (hasParsedBody) headers.set('content-type', 'application/json');
    return headers;
};

// The backend's cookie is re-issued by this app, so a Domain bound to the backend host would make
// the browser reject it, and Secure would break plain-http local development.
const toAppCookie = (cookie: string, isSecureRequest: boolean) => cookie
    .split(';')
    .filter((part) => {
        const name = part.trim().split('=')[0].toLowerCase();
        return name !== 'domain' && (isSecureRequest || name !== 'secure');
    })
    .join(';');

const getForwardedResponseHeaders = (response: Response, isSecureRequest: boolean) => {
    const headers = new Headers();

    for (const name of RESPONSE_HEADER_NAMES) {
        const value = response.headers.get(name);
        if (value) headers.set(name, value);
    }
    for (const cookie of response.headers.getSetCookie()) {
        headers.append('set-cookie', toAppCookie(cookie, isSecureRequest));
    }

    return headers;
};

type ProxyOptions = {
    body?: unknown;
};

/**
 * Forwards the request to the upstream backend.
 * Pass `options.body` to send an already-parsed (e.g. validated) JSON body
 * instead of the raw request body, which can only be read once.
 */
export async function proxyBackendRequest(
    request: Request,
    path: string,
    options: ProxyOptions = {},
): Promise<Response> {
    const requestUrl = new URL(request.url);
    const target = getBackendUrl(path, requestUrl.search);
    if (!target) {
        return Response.json(
            { message: 'Backend API is not configured. Set GYM_API_BASE_URL.' },
            { status: 503 },
        );
    }

    if (target.origin === requestUrl.origin) {
        return Response.json(
            { message: 'Backend API URL must point to the upstream backend, not this app.' },
            { status: 503 },
        );
    }

    const response = await fetch(target, {
        method: request.method,
        headers: getForwardedRequestHeaders(request, options.body !== undefined),
        body: await getRequestBody(request, options.body),
        cache: 'no-store',
        redirect: 'manual',
    });

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: getForwardedResponseHeaders(response, requestUrl.protocol === 'https:'),
    });
}
