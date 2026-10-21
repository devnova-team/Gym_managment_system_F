import { proxyBackendRequest } from '../../../../server/backend/api-client';
import { notFoundResponse } from '../../../../server/validation/validateRequest';
import { subscriptionIdSchema } from '../../../../features/subscriptions/validation/subscriptionValidation';

// GET /api/subscriptions/{id} - Get a single subscription
export async function GET(request, { params }) {
    const { id } = await params;
    if (!subscriptionIdSchema.isValidSync(id)) return notFoundResponse();

    return proxyBackendRequest(request, `/subscriptions/${encodeURIComponent(id)}`);
}
