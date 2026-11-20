import * as yup from 'yup';

// =====================================================================
// Attendance Validation Schemas
// =====================================================================
// Shared between the client and the server route handlers
// (src/app/api/attendance). Messages are i18n keys under
// "attendance.errors". The backend stays the final authority.
// =====================================================================

export const MAX_SYNC_RECORDS = 50; // Backend limit per sync request

// Empty form values ('' / null) count as missing, not as invalid numbers.
const toUndefinedIfEmpty = (value, originalValue) => (
    originalValue === '' || originalValue === null ? undefined : value
);

const recordId = (requiredMessage) => yup
    .number()
    .transform(toUndefinedIfEmpty)
    .typeError('attendance.errors.invalidId')
    .integer('attendance.errors.invalidId')
    .positive('attendance.errors.invalidId')
    .required(requiredMessage);

// POST /api/attendance/check-in
export const checkInSchema = yup.object({
    member_id: recordId('attendance.errors.memberIdRequired'),
});

// POST /api/attendance/{id}/check-out and other routes with an attendance id
export const attendanceIdSchema = recordId('attendance.errors.attendanceIdRequired');

const offlineRecordSchema = yup.object({
    local_id: yup.string().uuid('attendance.errors.localIdInvalid').required('attendance.errors.localIdInvalid'),
    member_id: recordId('attendance.errors.memberIdRequired'),
    check_in_time: yup
        .string()
        .required('attendance.errors.checkInTimeInvalid')
        .test(
            'iso-datetime',
            'attendance.errors.checkInTimeInvalid',
            (value) => !Number.isNaN(Date.parse(value)),
        ),
});

// POST /api/attendance/sync
export const syncAttendanceSchema = yup.object({
    records: yup
        .array()
        .of(offlineRecordSchema)
        .min(1, 'attendance.errors.recordsRequired')
        .max(MAX_SYNC_RECORDS, 'attendance.errors.recordsMax')
        .required('attendance.errors.recordsRequired')
        .test(
            'unique-local-ids',
            'attendance.errors.localIdDuplicated',
            (records) => !records || new Set(records.map((record) => record.local_id)).size === records.length,
        ),
});
