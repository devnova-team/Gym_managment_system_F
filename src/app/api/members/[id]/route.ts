import { proxyBackendRequest } from '../../../../server/backend/api-client';

const handle = async (request, { params }) => {
    const { id } = await params;
    return proxyBackendRequest(request, `/members/${encodeURIComponent(id)}`);
};

export const GET = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
