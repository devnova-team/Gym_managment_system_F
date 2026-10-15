import { proxyBackendRequest } from '../../../server/backend/api-client';

const handle = async (request, { params }) => {
    const { path } = await params;
    return proxyBackendRequest(request, `/${path.map(encodeURIComponent).join('/')}`);
};

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
