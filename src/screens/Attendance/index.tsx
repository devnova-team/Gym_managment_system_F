import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebouncedValue } from '@mantine/hooks';
import { Alert, Avatar, Badge, Button, Card, SegmentedControl, Stack, Table, Text } from '@mantine/core';
import { FiCheckCircle, FiUsers } from 'react-icons/fi';
import { HiExclamationTriangle } from 'react-icons/hi2';
import SearchInput from '../../components/SearchInput';
import { mockAttendanceRecords, mockMembers } from '../../data/mockAttendance';
import {
    generateIdLocal,
    getPendingAttendance,
    getSyncedHistory,
    queueAttendanceRecord,
    syncPendingQueue,
} from '../../Service/attendanceSyncMock';
import { formatTime } from '../../utils/formatters';

const attendanceStatusMeta = {
    present: { color: 'green', key: 'attendance.present' },
    late: { color: 'orange', key: 'attendance.late' },
    not_coming: { color: 'gray', key: 'attendance.notComing' },
};

const getMemberMeta = (record, t) => {
    const member = record?.member || record?.member_details || record?.memberData || record || {};
    const rawMember = record?.member_id ? { id: record.member_id, ...member } : member;

    return {
        id: rawMember.id ?? rawMember.member_id ?? record?.member_id ?? null,
        name: rawMember.name || record?.member_name || record?.name || t('attendance.unknownMember'),
        nameAr: rawMember.nameAr || record?.member_name_ar || record?.nameAr || '',
        phone: rawMember.phone || rawMember.phone_number || record?.phone || '',
        photo: rawMember.photo_url || rawMember.photoUrl || rawMember.photo || '',
        attendanceStatus: rawMember.attendanceStatus ?? record?.attendanceStatus ?? 'present',
        checkInTime: rawMember.checkInTime || rawMember.check_in_time || record?.checkInTime || record?.check_in_time || null,
        memberStatus: rawMember.memberStatus || rawMember.status || 'Active',
        subscriptionEndDate: rawMember.subscriptionEndDate || null,
        lastAttendance: rawMember.lastAttendance || rawMember.last_attendance || null,
    };
};

const getLocalizedMemberMeta = (record, t, language) => {
    const memberMeta = getMemberMeta(record, t);
    return {
        ...memberMeta,
        name: language.toLowerCase().startsWith('ar') && memberMeta.nameAr
            ? memberMeta.nameAr
            : memberMeta.name,
    };
};

const getCheckInTime = (record) => {
    return record?.check_in_time || record?.checkInTime || record?.created_at || record?.createdAt || null;
};

const isExpiredSubscription = (member) => {
    if (!member) return false;
    if (member.memberStatus === 'Expired' || member.status === 'Expired') return true;
    if (member.subscriptionEndDate) {
        const endDate = new Date(member.subscriptionEndDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (endDate < today) return true;
    }
    return false;
};

const Attendance = () => {
    const { t, i18n } = useTranslation();
    const language = i18n.resolvedLanguage || i18n.language;
    const locale = language?.toLowerCase().startsWith('ar') ? 'ar-EG' : 'en-US';
    const [search, setSearch] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('present');

    const [mockMemberState, setMockMemberState] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('gms_member_state');
                if (saved) return JSON.parse(saved);
            } catch {
                // ignore
            }
        }
        return mockMembers;
    });

    const [todayAttendanceState, setTodayAttendanceState] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('gms_today_attendance');
                if (saved) return JSON.parse(saved);
            } catch {
                // ignore
            }
        }
        return mockAttendanceRecords;
    });

    const [notice, setNotice] = useState(null);
    const [isSubmittingCheckIn, setIsSubmittingCheckIn] = useState(false);
    const [pendingRecords, setPendingRecords] = useState(() => getPendingAttendance());
    const [syncedHistory, setSyncedHistory] = useState(() => getSyncedHistory());
    const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
    const [syncState, setSyncState] = useState({
        status: 'idle',
        pendingCount: 0,
        lastSyncAt: null,
        error: null,
        syncedCount: 0,
        totalCount: 0,
    });

    const [debouncedSearch] = useDebouncedValue(search, 350);

    const refreshPendingQueue = useCallback(() => {
        const queue = getPendingAttendance();
        setPendingRecords(queue);
        setSyncState((current) => ({
            ...current,
            pendingCount: queue.length,
            totalCount: Math.max(current.totalCount || queue.length, queue.length),
        }));
        return queue;
    }, []);

    const syncPendingMockRecords = useCallback(async (failIds = []) => {
        const queue = getPendingAttendance();
        if (!queue.length) {
            setSyncState((current) => ({ ...current, status: 'idle', pendingCount: 0, error: null }));
            return;
        }

        setSyncState((current) => ({
            ...current,
            status: 'syncing',
            error: null,
            pendingCount: queue.length,
        }));

        const result = await syncPendingQueue({ failIds });
        const nextPending = result.remaining || [];

        if (result.syncedRecords?.length) {
            setTodayAttendanceState((current) => {
                const existingIds = new Set(current.map((r) => String(r.memberId)));
                const newItems = result.syncedRecords
                    .filter((r) => !existingIds.has(String(r.memberId)))
                    .map((r) => ({
                        id: r.id_local,
                        memberId: r.memberId,
                        memberName: r.memberName,
                        checkInTime: r.checkInTime,
                        status: r.attendanceStatus === 'late' ? 'Late' : r.attendanceStatus === 'not_coming' ? 'Not Coming' : 'Present',
                        attendanceStatus: r.attendanceStatus || 'present',
                    }));
                const updated = [...current, ...newItems];
                if (typeof window !== 'undefined') {
                    localStorage.setItem('gms_today_attendance', JSON.stringify(updated));
                }
                return updated;
            });

            setNotice({
                type: 'success',
                message: t('attendance.syncSuccess') || 'Pending attendance was synced successfully.',
            });
        }

        setPendingRecords(nextPending);
        setSyncedHistory(getSyncedHistory());
        setSyncState({
            status: result.success ? 'synced' : 'failed',
            pendingCount: nextPending.length,
            lastSyncAt: new Date().toISOString(),
            error: result.failedRecords?.length ? t('attendance.syncStatusError') : null,
            syncedCount: result.syncedRecords?.length || 0,
            totalCount: result.total || queue.length,
        });
    }, [t]);

    useEffect(() => {
        const handleOffline = () => setIsOnline(false);
        const syncWhenOnline = () => {
            const online = typeof navigator !== 'undefined' ? navigator.onLine : true;
            setIsOnline(online);
            if (online) {
                syncPendingMockRecords();
            }
        };

        syncWhenOnline();
        window.addEventListener('online', syncWhenOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', syncWhenOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [syncPendingMockRecords]);

    useEffect(() => {
        refreshPendingQueue();
    }, [refreshPendingQueue]);

    const members = useMemo(() => {
        const searchTerm = debouncedSearch.trim().toLowerCase();
        return mockMemberState
            .filter((member) => `${member.name} ${member.nameAr} ${member.phone}`.toLowerCase().includes(searchTerm))
            .map((member) => ({ member }));
    }, [debouncedSearch, mockMemberState]);

    const checkAlreadyCheckedIn = useCallback((memberId) => {
        if (!memberId) return false;
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(todayStart.getTime() + 86400000);

        const allRecords = [...todayAttendanceState, ...pendingRecords, ...syncedHistory];
        return allRecords.some((record) => {
            const rMemberId = record.memberId ?? record.member_id;
            if (String(rMemberId) !== String(memberId)) return false;
            const recordTime = record.checkInTime || record.createdAt;
            if (!recordTime) return false;
            const date = new Date(recordTime);
            return date >= todayStart && date < todayEnd;
        });
    }, [todayAttendanceState, pendingRecords, syncedHistory]);

    const attendanceList = useMemo(() => {
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const todayEnd = new Date(todayStart.getTime() + 86400000);

        const pendingRows = pendingRecords.map((record) => ({
            id: record.id_local,
            memberId: record.memberId,
            memberName: record.memberName,
            checkInTime: record.checkInTime,
            attendanceStatus: record.attendanceStatus || 'present',
            isPendingSync: true,
            member: {
                id: record.memberId,
                name: record.memberName,
                nameAr: record.memberName,
            },
        }));

        const historyRows = syncedHistory.map((record) => ({
            id: record.id_local,
            memberId: record.memberId,
            memberName: record.memberName,
            checkInTime: record.checkInTime,
            attendanceStatus: record.attendanceStatus || 'present',
            isPendingSync: false,
            member: {
                id: record.memberId,
                name: record.memberName,
                nameAr: record.memberName,
            },
        }));

        const todayRows = todayAttendanceState.map((record) => ({
            id: record.id || `att-${record.memberId}-${record.checkInTime}`,
            memberId: record.memberId,
            memberName: record.memberName,
            checkInTime: record.checkInTime,
            attendanceStatus: record.attendanceStatus || (record.status?.toLowerCase() === 'late' ? 'late' : record.status?.toLowerCase() === 'not coming' ? 'not_coming' : 'present'),
            isPendingSync: false,
            member: {
                id: record.memberId,
                name: record.memberName,
                nameAr: record.memberName,
            },
        }));

        const allToday = [...todayRows, ...pendingRows, ...historyRows].filter((record) => {
            const checkInTime = record.checkInTime || getCheckInTime(record);
            if (!checkInTime) return false;
            const checkInDate = new Date(checkInTime);
            return checkInDate >= todayStart && checkInDate < todayEnd;
        });

        const memberMap = new Map();
        allToday.forEach((record) => {
            const mId = String(record.memberId);
            if (!memberMap.has(mId)) {
                memberMap.set(mId, record);
            } else {
                const existing = memberMap.get(mId);
                const existingTime = new Date(existing.checkInTime || 0).getTime();
                const recordTime = new Date(record.checkInTime || 0).getTime();
                if (recordTime > existingTime) {
                    memberMap.set(mId, record);
                }
            }
        });

        return Array.from(memberMap.values()).map((record) => {
            const member = mockMemberState.find((item) => String(item.id) === String(record.memberId));
            return {
                ...record,
                member: {
                    ...record.member,
                    phone: member?.phone || '',
                    photo: member?.photo || null,
                },
            };
        });
    }, [todayAttendanceState, pendingRecords, syncedHistory, mockMemberState]);

    const presentCount = attendanceList.length;
    const selectedMemberId = selectedMember ? getMemberMeta(selectedMember, t).id : null;
    const currentSelectedMember = selectedMember
        ? mockMemberState.find((member) => String(member.id) === String(selectedMemberId)) || selectedMember
        : null;
    const selectedMemberInfo = currentSelectedMember
        ? getLocalizedMemberMeta(currentSelectedMember, t, language)
        : null;

    const isCurrentMemberExpired = isExpiredSubscription(currentSelectedMember);
    const isCurrentMemberAlreadyCheckedIn = selectedMemberId ? checkAlreadyCheckedIn(selectedMemberId) : false;

    const handleSelectMember = (member) => {
        setSelectedMember(member);
        const meta = getMemberMeta(member, t);
        setSelectedStatus(meta.attendanceStatus || 'present');
    };

    const handleAttendanceStatusChange = (status) => {
        setSelectedStatus(status);
        if (selectedMemberInfo?.id) {
            setMockMemberState((current) => current.map((member) => (
                String(member.id) === String(selectedMemberInfo.id)
                    ? { ...member, attendanceStatus: status }
                    : member
            )));
        }
    };

    const handleCheckIn = async () => {
        if (!selectedMember) {
            setNotice({
                type: 'error',
                message: t('attendance.selectMemberError') || 'Please select a member first.',
            });
            return;
        }

        const memberId = selectedMemberInfo?.id ?? selectedMember.id ?? selectedMember.member_id;
        if (!memberId) {
            setNotice({
                type: 'error',
                message: t('attendance.selectMemberError') || 'Please select a member first.',
            });
            return;
        }

        if (isCurrentMemberExpired) {
            setNotice({
                type: 'error',
                message: t('attendance.expiredWarning') || 'Subscription expired. Renewal required!',
            });
            return;
        }

        if (isCurrentMemberAlreadyCheckedIn) {
            setNotice({
                type: 'error',
                message: t('attendance.alreadyCheckedIn') || 'Member is already checked in today.',
            });
            return;
        }

        setIsSubmittingCheckIn(true);

        await new Promise((resolve) => setTimeout(resolve, 400));

        const checkInTime = new Date().toISOString();
        const todayDateStr = checkInTime.split('T')[0];
        const chosenStatus = selectedStatus || selectedMemberInfo?.attendanceStatus || 'present';
        const statusLabel = chosenStatus === 'late' ? 'Late' : chosenStatus === 'not_coming' ? 'Not Coming' : 'Present';

        const nextMemberState = mockMemberState.map((member) => (
            String(member.id) === String(memberId)
                ? {
                    ...member,
                    lastAttendance: todayDateStr,
                    last_attendance: todayDateStr,
                    attendanceStatus: chosenStatus,
                    checkInTime,
                }
                : member
        ));
        setMockMemberState(nextMemberState);
        if (typeof window !== 'undefined') {
            localStorage.setItem('gms_member_state', JSON.stringify(nextMemberState));
        }

        if (isOnline) {
            const newRecord = {
                id: `attendance-${Date.now()}`,
                memberId,
                memberName: selectedMemberInfo?.name || selectedMember?.name || 'Member',
                checkInTime,
                status: statusLabel,
                attendanceStatus: chosenStatus,
            };

            const nextTodayState = [...todayAttendanceState, newRecord];
            setTodayAttendanceState(nextTodayState);
            if (typeof window !== 'undefined') {
                localStorage.setItem('gms_today_attendance', JSON.stringify(nextTodayState));
            }

            setNotice({
                type: 'success',
                message: t('attendance.checkInSuccess', { name: selectedMemberInfo?.name, time: formatTime(checkInTime, locale) })
                    || `${selectedMemberInfo?.name} checked in successfully.`,
            });
        } else {
            queueAttendanceRecord({
                id_local: generateIdLocal(),
                memberId,
                memberName: selectedMemberInfo?.name || selectedMember?.name || 'Member',
                checkInTime,
                attendanceStatus: chosenStatus,
                status: 'pending',
                createdAt: checkInTime,
            });

            refreshPendingQueue();
            setNotice({
                type: 'info',
                message: t('attendance.offlineSavedMessage')
                    || 'Attendance saved offline. It will sync automatically when the connection returns.',
            });
        }

        setSelectedMember(null);
        setSearch('');
        setIsSubmittingCheckIn(false);
    };

    const syncBadge = !isOnline
        ? { color: 'gray', label: t('attendance.syncStatusOffline') || 'Offline — attendance will be saved locally' }
        : syncState.status === 'syncing'
            ? { color: 'blue', label: t('attendance.syncStatusSyncing') || 'Syncing attendance...' }
            : syncState.pendingCount > 0
                ? { color: 'yellow', label: t('attendance.syncStatusPending', { count: syncState.pendingCount }) || `${syncState.pendingCount} attendance records waiting to sync` }
                : syncState.status === 'synced'
                    ? { color: 'green', label: t('attendance.syncSuccess') || 'Attendance synced successfully' }
                    : syncState.status === 'failed'
                        ? { color: 'orange', label: t('attendance.syncStatusError') || 'Some attendance records could not be synchronized.' }
                        : { color: 'green', label: t('attendance.syncStatusOnline') || 'Online' };

    const noticeMessage = notice?.message || '';

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                        {t('attendance.title')}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {t('attendance.description')}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Badge color={syncBadge.color} variant="light" radius="sm">
                        {syncBadge.label}
                    </Badge>

                    <Button
                        leftSection={<FiUsers size={18} />}
                        className="bg-btn-gradient hover:bg-btn-gradient rounded-xl px-4 h-11 text-sm font-semibold shadow-sm border-0"
                        onClick={() => handleSelectMember(members[0]?.member)}
                        disabled={!debouncedSearch.trim() || members.length === 0}
                        aria-label={t('attendance.addAction')}
                    >
                        {t('attendance.addAction')}
                    </Button>
                </div>
            </div>

            {notice && (
                <Alert
                    icon={notice.type === 'error' ? <HiExclamationTriangle size={18} /> : <FiCheckCircle size={18} />}
                    color={notice.type === 'error' ? 'red' : notice.type === 'info' ? 'yellow' : 'green'}
                    variant="light"
                    title={notice.type === 'error' ? t('attendance.errorTitle') : notice.type === 'info' ? t('attendance.offlineSavedTitle') : t('common.success')}
                    radius="md"
                    withCloseButton
                    onClose={() => setNotice(null)}
                >
                    {noticeMessage}
                </Alert>
            )}

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_0.9fr]">
                <Card className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0e1517] shadow-sm">
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <div>
                            <Text fw={700} size="sm" className="text-slate-700 dark:text-slate-200">
                                {t('attendance.searchTitle')}
                            </Text>
                            <Text size="xs" c="dimmed">{t('attendance.searchSubtitle')}</Text>
                        </div>
                    </div>

                    <SearchInput
                        placeholder={t('attendance.searchPrompt')}
                        clearLabel={t('common.clearSearch')}
                        value={search}
                        onChange={(event) => setSearch(event.currentTarget.value)}
                        onClear={() => {
                            setSearch('');
                            setSelectedMember(null);
                        }}
                    />

                    {!debouncedSearch.trim() && !selectedMember && (
                        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
                            {t('attendance.searchHint')}
                        </div>
                    )}

                    {debouncedSearch.trim() && members.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {members.slice(0, 6).map(({ member }) => {
                                const memberMeta = getLocalizedMemberMeta(member, t, language);
                                const isSelected = selectedMemberInfo?.id === memberMeta.id;
                                const isExpired = isExpiredSubscription(member);

                                return (
                                    <button
                                        key={memberMeta.id ?? member.id ?? memberMeta.phone ?? memberMeta.name}
                                        type="button"
                                        onClick={() => handleSelectMember(member)}
                                        aria-pressed={isSelected}
                                        className={`w-full rounded-xl border px-3 py-3 text-start transition hover:border-[#85F40F] hover:bg-[#f4feea] dark:hover:bg-slate-900 ${isSelected ? 'border-[#85F40F] bg-[#f4feea] dark:bg-slate-900' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-[#0c101d]'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar size={36} src={memberMeta.photo || undefined} radius="xl" color={isExpired ? 'red' : 'green'}>
                                                {memberMeta.name?.charAt(0)?.toUpperCase() || 'M'}
                                            </Avatar>
                                            <div className="min-w-0 flex-1">
                                                <div className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{memberMeta.name}</div>
                                                <div className="truncate text-xs text-slate-500 dark:text-slate-400">{memberMeta.phone || '—'}</div>
                                            </div>
                                            <Badge
                                                color={isExpired ? 'red' : 'green'}
                                                variant="light"
                                                radius="sm"
                                                style={{ textTransform: 'none' }}
                                            >
                                                {isExpired ? t('common.expired') : t('common.active')}
                                            </Badge>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {debouncedSearch.trim() && members.length === 0 && (
                        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
                            {t('attendance.noMemberFound')}
                        </div>
                    )}
                </Card>

                <Card className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0e1517] shadow-sm">
                    <Text fw={700} size="sm" className="text-slate-700 dark:text-slate-200">
                        {t('attendance.memberInfo')}
                    </Text>

                    {selectedMemberInfo ? (
                        <Stack gap="sm" className="mt-4">
                            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900/50">
                                <Avatar size={46} src={selectedMemberInfo.photo || undefined} radius="xl" color={isCurrentMemberExpired ? 'red' : 'green'}>
                                    {selectedMemberInfo.name?.charAt(0)?.toUpperCase() || 'M'}
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <Text fw={700} className="truncate text-slate-800 dark:text-slate-100">{selectedMemberInfo.name}</Text>
                                    <Text size="xs" c="dimmed" className="truncate">{selectedMemberInfo.phone || '—'}</Text>
                                </div>
                                <Badge
                                    color={isCurrentMemberExpired ? 'red' : 'green'}
                                    variant="light"
                                    radius="sm"
                                    style={{ textTransform: 'none' }}
                                >
                                    {isCurrentMemberExpired ? t('common.expired') : t('common.active')}
                                </Badge>
                            </div>

                            {isCurrentMemberExpired && (
                                <Alert color="red" variant="light" icon={<HiExclamationTriangle size={18} />}>
                                    {t('attendance.expiredWarning') || 'Subscription expired. Renewal required!'}
                                </Alert>
                            )}

                            {isCurrentMemberAlreadyCheckedIn && !isCurrentMemberExpired && (
                                <Alert color="yellow" variant="light" icon={<FiCheckCircle size={18} />}>
                                    {t('attendance.alreadyCheckedIn') || 'Member is already checked in today.'}
                                </Alert>
                            )}

                            <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                                {selectedMemberInfo.lastAttendance && (
                                    <div>
                                        {t('communication.lastAttendance')}: {selectedMemberInfo.lastAttendance}
                                    </div>
                                )}
                                {selectedMemberInfo.checkInTime && isCurrentMemberAlreadyCheckedIn && (
                                    <div>
                                        {t('attendance.checkInTime')}: {formatTime(selectedMemberInfo.checkInTime, locale)}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Text size="sm" fw={600} className="text-slate-700 dark:text-slate-200">
                                    {t('attendance.attendanceStatus')}
                                </Text>
                                <SegmentedControl
                                    fullWidth
                                    value={selectedStatus}
                                    onChange={handleAttendanceStatusChange}
                                    data={[
                                        { label: t('attendance.present'), value: 'present' },
                                        { label: t('attendance.late'), value: 'late' },
                                        { label: t('attendance.notComing'), value: 'not_coming' },
                                    ]}
                                />
                            </div>

                            <Button
                                fullWidth
                                type="button"
                                loading={isSubmittingCheckIn}
                                loaderProps={{ type: 'dots' }}
                                onClick={handleCheckIn}
                                disabled={isSubmittingCheckIn || isCurrentMemberExpired || isCurrentMemberAlreadyCheckedIn}
                                className="h-11 rounded-xl bg-btn-gradient text-sm font-semibold disabled:opacity-50"
                                aria-label={t('attendance.checkIn')}
                            >
                                {isSubmittingCheckIn
                                    ? t('common.loading')
                                    : isCurrentMemberExpired
                                        ? t('common.expired')
                                        : isCurrentMemberAlreadyCheckedIn
                                            ? t('attendance.checkedIn')
                                            : t('attendance.checkIn')}
                            </Button>
                        </Stack>
                    ) : (
                        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
                            {t('attendance.selectMember')}
                        </div>
                    )}
                </Card>
            </div>

            <Card className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0e1517] shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                        <Text fw={700} size="lg" className="text-slate-800 dark:text-white">
                            {t('attendance.presentNowTitle')}
                        </Text>
                    </div>
                    <div className="rounded-xl bg-[#f4feea] px-3 py-2 text-xl font-bold text-[#275001] dark:bg-[#12220a] dark:text-[#85F40F]">
                        {presentCount}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span>Pending: {syncState.pendingCount}</span>
                    <span>•</span>
                    <span>Synced: {syncState.syncedCount}</span>
                    <span>•</span>
                    <span>Last Sync: {syncState.lastSyncAt ? new Date(syncState.lastSyncAt).toLocaleTimeString() : '—'}</span>
                </div>

                <Button
                    fullWidth
                    type="button"
                    className="mt-4 h-11 rounded-xl bg-btn-gradient text-sm font-semibold"
                    onClick={() => syncPendingMockRecords()}
                    disabled={syncState.status === 'syncing' || syncState.pendingCount === 0}
                >
                    {syncState.status === 'syncing' ? 'Syncing...' : syncState.pendingCount > 0 ? `Sync Attendance (${syncState.pendingCount})` : 'Sync Attendance'}
                </Button>
            </Card>

            <Card className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0e1517] shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <Text fw={700} size="lg" className="text-slate-800 dark:text-white">
                        {t('attendance.todayTableTitle')}
                    </Text>
                </div>

                {attendanceList.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900/50">
                        <Text fw={600} className="text-slate-700 dark:text-slate-200">
                            {t('attendance.emptyTitle')}
                        </Text>
                        <Text size="sm" c="dimmed" className="mt-2">
                            {t('attendance.emptySubtitle')}
                        </Text>
                    </div>
                ) : (
                    <Table.ScrollContainer minWidth={600}>
                        <Table verticalSpacing="sm" highlightOnHover withTableBorder={false}>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>{t('attendance.memberName')}</Table.Th>
                                    <Table.Th>{t('attendance.phone')}</Table.Th>
                                    <Table.Th>{t('attendance.checkInTime')}</Table.Th>
                                    <Table.Th className="text-center">{t('attendance.status')}</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {attendanceList.map((record) => {
                                    const memberMeta = getLocalizedMemberMeta(record, t, language);
                                    const checkInTime = record.checkInTime || getCheckInTime(record);
                                    const memberStatus = attendanceStatusMeta[record.attendanceStatus] || attendanceStatusMeta.present;

                                    return (
                                        <Table.Tr key={record.id ?? `${memberMeta.id ?? memberMeta.name}-${checkInTime}`}>
                                            <Table.Td>
                                                <div className="flex items-center gap-3">
                                                    <Avatar size={34} src={memberMeta.photo || undefined} radius="xl" color="green">
                                                        {memberMeta.name?.charAt(0)?.toUpperCase() || 'M'}
                                                    </Avatar>
                                                    <div className="min-w-0">
                                                        <div className="truncate font-semibold text-slate-800 dark:text-slate-100">{memberMeta.name}</div>
                                                    </div>
                                                </div>
                                            </Table.Td>
                                            <Table.Td className="text-slate-600 dark:text-slate-300">{memberMeta.phone || '—'}</Table.Td>
                                            <Table.Td className="text-slate-600 dark:text-slate-300">
                                                {checkInTime ? formatTime(checkInTime, locale) : '—'}
                                            </Table.Td>
                                            <Table.Td className="text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <Badge color={memberStatus.color} variant="light" radius="sm" style={{ textTransform: 'none' }}>
                                                        {t(memberStatus.key)}
                                                    </Badge>
                                                    {record.isPendingSync && (
                                                        <Badge color="yellow" variant="outline" radius="sm" style={{ textTransform: 'none' }}>
                                                            {t('attendance.pendingSync') || 'Pending Sync'}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </Table.Td>
                                        </Table.Tr>
                                    );
                                })}
                            </Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                )}
            </Card>
        </div>
    );
};

export default Attendance;
