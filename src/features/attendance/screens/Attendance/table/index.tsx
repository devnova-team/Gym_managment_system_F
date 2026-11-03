import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper, Table } from '@mantine/core';
import { RiCalendarCheckLine } from 'react-icons/ri';
import { TableBody, TableFooter, TableHeader, TableSkeleton } from '@/shared/components/ui/Tables';
import AttendanceRow from './AttendanceRow';

const TABLE_HEADERS = [
    { labelKey: 'attendance.memberName', width: '28%' },
    { labelKey: 'attendance.checkInTime', width: '16%' },
    { labelKey: 'attendance.checkOutTime', width: '16%' },
    { labelKey: 'attendance.duration', width: '14%' },
    { labelKey: 'attendance.status', width: '14%' },
];
const ACTIONS_HEADER = { labelKey: 'common.actions', width: '12%', align: 'center' };

const AttendanceTable = ({
    records,
    isLoading,
    view,
    canManage,
    page,
    setPage,
    totalPages,
    totalCount,
    checkingOutId,
    onCheckOut,
}) => {
    const { t, i18n } = useTranslation();
    const locale = i18n.dir() === 'rtl' ? 'ar-EG' : 'en-US';
    const headerRef = useRef(null);

    const headers = useMemo(
        () => (canManage ? [...TABLE_HEADERS, ACTIONS_HEADER] : TABLE_HEADERS)
            .map(({ labelKey, ...rest }) => ({ label: t(labelKey), ...rest })),
        [t, canManage],
    );

    return (
        <Paper
            p={{ base: 'xs', sm: 'md' }}
            radius="lg"
            className="w-full bg-white dark:bg-[#0e1517]! border border-slate-200 dark:border-slate-800 shadow-smoothCard overflow-hidden"
        >
            <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-white/5 scrollbar-thin">
                <Table
                    highlightOnHover
                    verticalSpacing="sm"
                    horizontalSpacing="md"
                    className="w-full text-xs sm:text-sm whitespace-nowrap min-w-212.5"
                >
                    <TableHeader ref={headerRef} headers={headers} />

                    {isLoading ? (
                        <TableSkeleton colCount={headers.length} rowCount={5} />
                    ) : (
                        <TableBody
                            data={records}
                            colSpan={headers.length}
                            emptyIcon={<RiCalendarCheckLine size={28} />}
                            emptyMessage={t(view === 'inside' ? 'attendance.emptyInsideTitle' : 'attendance.emptyTitle')}
                            emptyDescription={t(view === 'inside' ? 'attendance.emptyInsideSubtitle' : 'attendance.emptySubtitle')}
                            renderRow={(item) => (
                                <AttendanceRow
                                    key={item.id}
                                    item={item}
                                    locale={locale}
                                    onCheckOut={canManage ? onCheckOut : undefined}
                                    isCheckingOut={String(checkingOutId) === String(item.id)}
                                />
                            )}
                        />
                    )}

                    {!isLoading && totalCount > 0 && (
                        <TableFooter
                            page={page}
                            setPage={setPage}
                            totalPages={totalPages}
                            totalItems={totalCount}
                            colSpan={headers.length}
                            scrollRef={headerRef}
                        />
                    )}
                </Table>
            </div>
        </Paper>
    );
};

export default AttendanceTable;
