import { proxyBackendRequest } from '@/server/backend/api-client';
import { validateJsonBody } from '@/server/validation/validateRequest';
import { syncAttendanceSchema } from '@/features/attendance/validation/attendanceValidation';

// POST /api/attendance/sync - Sync check-ins recorded while the gym was offline
export async function POST(request) {
    const { data, response } = await validateJsonBody(request, syncAttendanceSchema);
    if (response) return response;

    return proxyBackendRequest(request, '/attendance/sync', { body: data });
}
