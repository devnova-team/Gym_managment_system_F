import { proxyBackendRequest } from '../../../../../server/backend/api-client';
import { notFoundResponse } from '../../../../../server/validation/validateRequest';
import { attendanceIdSchema } from '../../../../../features/attendance/validation/attendanceValidation';

// POST /api/attendance/{id}/check-out - Check out an attendance record
export async function POST(request, { params }) {
    const { id } = await params;
    if (!attendanceIdSchema.isValidSync(id)) return notFoundResponse();

    return proxyBackendRequest(request, `/attendance/${encodeURIComponent(id)}/check-out`);
}
