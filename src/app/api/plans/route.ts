import { proxyBackendRequest } from '../../../server/backend/api-client';
import { requireRole } from '../../../server/auth/requireRole';
import { validateJsonBody } from '../../../server/validation/validateRequest';
import { createPlanSchema } from '../../../features/plans/validation/planValidation';

// GET /api/plans - List the gym's plans (any authenticated role)
export const GET = (request) => proxyBackendRequest(request, '/plans');

// POST /api/plans - Create a plan (Owner only)
export async function POST(request) {
    const forbidden = await requireRole(['owner']);
    if (forbidden) return forbidden;

    const { data, response } = await validateJsonBody(request, createPlanSchema);
    if (response) return response;

    return proxyBackendRequest(request, '/plans', { body: data });
}
