import { proxyBackendRequest } from '../../../server/backend/api-client';

export const GET = (request) => proxyBackendRequest(request, '/members');
export const POST = (request) => proxyBackendRequest(request, '/members');
