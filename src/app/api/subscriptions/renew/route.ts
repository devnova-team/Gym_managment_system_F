import { proxyBackendRequest } from '../../../../server/backend/api-client';
import { validateJsonBody } from '../../../../server/validation/validateRequest';
import { renewSubscriptionSchema } from '../../../../features/subscriptions/validation/subscriptionValidation';

// POST /api/subscriptions/renew - Renew an existing subscription
export async function POST(request) {
    const { data, response } = await validateJsonBody(request, renewSubscriptionSchema);
    if (response) return response;

    return proxyBackendRequest(request, '/subscriptions/renew', { body: data });
}
