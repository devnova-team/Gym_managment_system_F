import 'server-only';

const getBackendUrl = (path, search) => {
    const baseUrl = process.env.GYM_API_BASE_URL
        || process.env.API_BASE_URL
        || process.env.VITE_API_BASE_URL;

    if (!baseUrl) {
        return null;
    }

    const url = new URL(`${baseUrl.replace(/\/+$/, '')}/`);
    if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('GYM_API_BASE_URL must use HTTP or HTTPS');
    }

    const target = new URL(path.replace(/^\/+/, ''), url);
    target.search = search;
    return target;
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

const getRequestBody = async (request, body) => {
    if (body !== undefined) return JSON.stringify(body);
    if (['GET', 'HEAD'].includes(request.method)) return undefined;
    return request.arrayBuffer();
};

/**
 * Forwards the request to the upstream backend.
 * Pass `options.body` to send an already-parsed (e.g. validated) JSON body
 * instead of the raw request body, which can only be read once.
 */
export async function proxyBackendRequest(request, path, options: { body?: unknown } = {}) {
    const target = getBackendUrl(path, new URL(request.url).search);
    if (!target) {
        return Response.json(
            { message: 'Backend API is not configured. Set GYM_API_BASE_URL.' },
            { status: 503 },
        );
    }

    if (target.origin === new URL(request.url).origin) {
        return Response.json(
            { message: 'Backend API URL must point to the upstream backend, not this app.' },
            { status: 503 },
        );
    }

    const headers = new Headers();
    for (const name of ['accept', 'accept-language', 'authorization', 'content-type', 'cookie']) {
        const value = request.headers.get(name);
        if (value) headers.set(name, value);
    }
    if (options.body !== undefined) headers.set('content-type', 'application/json');

    const response = await fetch(target, {
        method: request.method,
        headers,
        body: await getRequestBody(request, options.body),
        cache: 'no-store',
        redirect: 'manual',
    });

    const responseHeaders = new Headers();
    for (const name of ['content-type', 'cache-control']) {
        const value = response.headers.get(name);
        if (value) responseHeaders.set(name, value);
    }
    const isSecureRequest = new URL(request.url).protocol === 'https:';
    for (const cookie of response.headers.getSetCookie()) {
        responseHeaders.append('set-cookie', toAppCookie(cookie, isSecureRequest));
    }

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
    });
}
