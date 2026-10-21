import { proxyBackendRequest } from '../../../server/backend/api-client';
import { validateJsonBody } from '../../../server/validation/validateRequest';
import { createSubscriptionSchema } from '../../../features/subscriptions/validation/subscriptionValidation';

// GET /api/subscriptions - List the gym's subscriptions
export const GET = (request) => proxyBackendRequest(request, '/subscriptions');

// POST /api/subscriptions - Create a subscription for a member
export async function POST(request) {
    const { data, response } = await validateJsonBody(request, createSubscriptionSchema);
    if (response) return response;

    return proxyBackendRequest(request, '/subscriptions', { body: data });
}
