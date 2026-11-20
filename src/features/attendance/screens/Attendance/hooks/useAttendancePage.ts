import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebouncedValue } from '@mantine/hooks';
import { useToast } from '@/shared/providers/ToastContext';
import { useAttendance } from '@/features/attendance/hooks/useAttendance';
import { useMemberLookupQuery } from '@/features/subscriptions/api/subscriptionsQueries';
import { formatTime } from '@/shared/utils/formatters';
import { getApiErrorMessage } from '@/shared/utils/apiErrors';

export const VIEWS = { today: 'today', inside: 'inside' } as const;

/** Screen state for the attendance page: list view/page, member search + selection, check-in/out actions. */
export const useAttendancePage = () => {
    const { t, i18n } = useTranslation();
    const { toast } = useToast();
    const locale = i18n.dir() === 'rtl' ? 'ar-EG' : 'en-US';

    const [view, setView] = useState<'today' | 'inside'>(VIEWS.today);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);
    const [debouncedSearch] = useDebouncedValue(search.trim(), 300);

    const handleSynced = useCallback(({ synced, rejected }) => {
        if (synced) toast.success(t('attendance.syncSuccess'));
        if (rejected) toast.warning(t('attendance.syncRejected', { count: rejected }));
    }, [toast, t]);

    const attendance = useAttendance({ view, page, onSynced: handleSynced });

    const memberLookup = useMemberLookupQuery(debouncedSearch, { enabled: debouncedSearch.length > 0 });
    const isSearchingMembers = Boolean(search.trim()) && (memberLookup.isFetching || search.trim() !== debouncedSearch);

    const hasPendingCheckIn = Boolean(selectedMember)
        && attendance.sync.pendingRecords.some((record) => String(record.member_id) === String(selectedMember.id));

    const handleViewChange = useCallback((value) => {
        setView(value);
        setPage(1);
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedMember(null);
        setSearch('');
    }, []);

    const handleCheckIn = useCallback(async () => {
        if (!selectedMember) return;

        try {
            const { queued, attendance: record } = await attendance.checkIn(selectedMember);
            if (queued) {
                toast.info(t('attendance.offlineSavedMessage'));
            } else {
                toast.success(t('attendance.checkInSuccess', {
                    name: selectedMember.name,
                    time: formatTime(record?.check_in_time, locale),
                }));
            }
            clearSelection();
        } catch (error) {
            toast.error(getApiErrorMessage(error, t));
        }
    }, [attendance, selectedMember, toast, t, locale, clearSelection]);

    const handleCheckOut = useCallback(async (record) => {
        try {
            await attendance.checkOut(record.id);
            toast.success(t('attendance.checkOutSuccess', { name: record.member?.name ?? '' }));
        } catch (error) {
            toast.error(getApiErrorMessage(error, t));
        }
    }, [attendance, toast, t]);

    return {
        ...attendance,
        view,
        page,
        setPage,
        handleViewChange,
        totalPages: Math.max(1, attendance.pagination.last_page),
        totalCount: attendance.pagination.total,

        search,
        setSearch,
        members: memberLookup.data ?? [],
        isSearchingMembers,
        isMembersError: memberLookup.isError,
        selectedMember,
        selectMember: setSelectedMember,
        clearSelection,
        hasPendingCheckIn,

        handleCheckIn,
        handleCheckOut,
    };
};
