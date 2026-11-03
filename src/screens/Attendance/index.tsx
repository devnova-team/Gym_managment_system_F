import { useTranslation } from 'react-i18next';
import { Box, SegmentedControl, Stack } from '@mantine/core';
import SubscriptionsErrorState from '../Subscriptions/components/SubscriptionsErrorState';
import { VIEWS, useAttendancePage } from './hooks/useAttendancePage';
import AttendanceHeader from './components/AttendanceHeader';
import AttendanceStats from './components/AttendanceStats';
import CheckInPanel from './components/CheckInPanel';
import AttendanceTable from './table';

const Attendance = () => {
    const { t } = useTranslation();
    const page = useAttendancePage();
    const { sync } = page;

    return (
        <Box className="w-full pb-10">
            <Stack gap="xl">
                <AttendanceHeader
                    isOnline={sync.isOnline}
                    isSyncing={sync.isSyncing}
                    pendingCount={sync.pendingRecords.length}
                    onSync={sync.syncNow}
                />

                <AttendanceStats
                    todayTotal={page.todayTotal}
                    insideTotal={page.insideTotal}
                    pendingCount={sync.pendingRecords.length}
                />

                {page.canManageAttendance && (
                    <CheckInPanel
                        search={page.search}
                        onSearchChange={page.setSearch}
                        members={page.members}
                        isSearching={page.isSearchingMembers}
                        isError={page.isMembersError}
                        selectedMember={page.selectedMember}
                        onSelect={page.selectMember}
                        onClear={page.clearSelection}
                        onCheckIn={page.handleCheckIn}
                        isCheckingIn={page.isCheckingIn}
                        hasPendingCheckIn={page.hasPendingCheckIn}
                        isOnline={sync.isOnline}
                    />
                )}

                <Stack gap="md">
                    <SegmentedControl
                        value={page.view}
                        onChange={page.handleViewChange}
                        data={[
                            { value: VIEWS.today, label: t('attendance.viewToday') },
                            { value: VIEWS.inside, label: t('attendance.viewInside') },
                        ]}
                        className="self-start"
                    />

                    {page.isError ? (
                        <SubscriptionsErrorState
                            onRetry={page.refetch}
                            isRetrying={page.isFetching}
                            titleKey="attendance.loadErrorTitle"
                            descriptionKey="attendance.loadErrorDesc"
                        />
                    ) : (
                        <AttendanceTable
                            records={page.attendances}
                            isLoading={page.isLoading}
                            view={page.view}
                            canManage={page.canManageAttendance}
                            page={page.page}
                            setPage={page.setPage}
                            totalPages={page.totalPages}
                            totalCount={page.totalCount}
                            checkingOutId={page.checkingOutId}
                            onCheckOut={page.handleCheckOut}
                        />
                    )}
                </Stack>
            </Stack>
        </Box>
    );
};

export default Attendance;
