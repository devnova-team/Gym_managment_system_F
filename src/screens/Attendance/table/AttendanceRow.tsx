import { useTranslation } from 'react-i18next';
import { Button, Table } from '@mantine/core';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { formatTime } from '../../../utils/formatters';
import { ATTENDANCE_STATUS_STYLES, formatDuration } from '../../../features/attendance/utils/attendanceStatus';

const StatusBadge = ({ status }) => {
    const { t } = useTranslation();

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${ATTENDANCE_STATUS_STYLES[status] ?? ATTENDANCE_STATUS_STYLES.checked_out}`}>
            {t(`attendance.status_${status}`, { defaultValue: status })}
        </span>
    );
};

const AttendanceRow = ({ item, locale, onCheckOut, isCheckingOut }) => {
    const { t } = useTranslation();
    const { member } = item;
    const isInside = item.status === 'inside';

    return (
        <Table.Tr className="hover:bg-slate-50/70 dark:hover:bg-white/4 transition-colors text-xs border-b border-slate-100 dark:border-white/5">
            <Table.Td className="p-3.5">
                <div className="font-bold text-slate-900 dark:text-slate-100">{member?.name ?? '-'}</div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5" dir="ltr">
                    {member?.phone}
                </div>
            </Table.Td>

            <Table.Td className="p-3.5 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                {formatTime(item.check_in_time, locale)}
            </Table.Td>

            <Table.Td className="p-3.5 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                {item.check_out_time ? formatTime(item.check_out_time, locale) : '—'}
            </Table.Td>

            <Table.Td className="p-3.5 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                {formatDuration(item.duration_minutes) ?? '—'}
            </Table.Td>

            <Table.Td className="p-3.5 whitespace-nowrap">
                <StatusBadge status={item.status} />
            </Table.Td>

            {/* Actions (only for roles that can manage attendance) */}
            {onCheckOut && (
                <Table.Td className="p-3.5 text-center! whitespace-nowrap">
                    {isInside && (
                        <Button
                            size="xs"
                            radius="md"
                            variant="light"
                            color="lime"
                            loading={isCheckingOut}
                            leftSection={<RiLogoutBoxRLine size={14} />}
                            onClick={() => onCheckOut(item)}
                            className="font-bold cursor-pointer"
                        >
                            {t('attendance.checkOut')}
                        </Button>
                    )}
                </Table.Td>
            )}
        </Table.Tr>
    );
};

export default AttendanceRow;
