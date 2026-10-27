import { proxyBackendRequest } from '../../../../server/backend/api-client';
import { requireRole } from '../../../../server/auth/requireRole';
import { notFoundResponse, validateJsonBody } from '../../../../server/validation/validateRequest';
import { planIdSchema, updatePlanSchema } from '../../../../features/plans/validation/planValidation';

const planPath = (id) => `/plans/${encodeURIComponent(id)}`;

// GET /api/plans/{id} - Get a single plan
export async function GET(request, { params }) {
    const { id } = await params;
    if (!planIdSchema.isValidSync(id)) return notFoundResponse();

    return proxyBackendRequest(request, planPath(id));
}

// PUT /api/plans/{id} - Update a plan (Owner only)
export async function PUT(request, { params }) {
    const { id } = await params;
    if (!planIdSchema.isValidSync(id)) return notFoundResponse();

    const forbidden = await requireRole(['owner']);
    if (forbidden) return forbidden;

    const { data, response } = await validateJsonBody(request, updatePlanSchema);
    if (response) return response;

    return proxyBackendRequest(request, planPath(id), { body: data });
}

// DELETE /api/plans/{id} - Delete a plan (Owner only; the backend refuses plans with active subscriptions)
export async function DELETE(request, { params }) {
    const { id } = await params;
    if (!planIdSchema.isValidSync(id)) return notFoundResponse();

    const forbidden = await requireRole(['owner']);
    if (forbidden) return forbidden;

    return proxyBackendRequest(request, planPath(id));
}
