import { proxyBackendRequest } from '@/server/backend/api-client';
import { validateJsonBody } from '@/server/validation/validateRequest';
import { checkInSchema } from '@/features/attendance/validation/attendanceValidation';

// POST /api/attendance/check-in - Check in a member
export async function POST(request) {
    const { data, response } = await validateJsonBody(request, checkInSchema);
    if (response) return response;

    return proxyBackendRequest(request, '/attendance/check-in', { body: data });
}
