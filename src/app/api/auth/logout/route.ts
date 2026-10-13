import { proxyBackendRequest } from '../../../../server/backend/api-client';

export const POST = (request) => proxyBackendRequest(request, '/auth/logout');
