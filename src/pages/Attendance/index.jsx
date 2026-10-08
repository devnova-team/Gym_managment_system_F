import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebouncedValue } from '@mantine/hooks';
import { Alert, Avatar, Badge, Button, Card, SegmentedControl, Stack, Table, Text } from '@mantine/core';
import { FiCheckCircle, FiUsers } from 'react-icons/fi';
import { HiExclamationTriangle } from 'react-icons/hi2';
import SearchInput from '../../components/SearchInput';
import TableSkeleton from '../../components/Tables/TableSkeleton';
import { useCheckInMutation, useGetTodayAttendanceQuery, useSyncOfflineAttendanceMutation } from '../../Service/Apis/attendanceApi';
import { useGetMembersQuery } from '../../Service/Apis/membersApi';
import { mockMembers } from '../../data/mockAttendance';
import { addToOfflineQueue, clearOfflineQueue, getOfflineQueue } from '../../utils/storage';
import { formatTime } from '../../utils/formatters';

const USE_MOCK_ATTENDANCE = true;
const attendanceStatusMeta = {
    present: { color: 'green', key: 'attendance.present' },
    late: { color: 'orange', key: 'attendance.late' },
    not_coming: { color: 'gray', key: 'attendance.notComing' },
};

const normalizeList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== 'object') return [];

    const candidates = [
        payload.data,
        payload.records,
        payload.members,
        payload.attendance,
        payload.result,
    ];

    for (const candidate of candidates) {
        if (Array.isArray(candidate)) return candidate;
        if (candidate && typeof candidate === 'object') {
            const nested = normalizeList(candidate);
            if (nested.length) return nested;
        }
    }

    return [];
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
        attendanceStatus: rawMember.attendanceStatus ?? record?.attendanceStatus ?? null,
        checkInTime: rawMember.checkInTime || rawMember.check_in_time || record?.checkInTime || record?.check_in_time || null,
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

const extractErrorMessage = (error, t) => {
    if (!error) return t('common.errorOccurred');

    if (typeof error === 'string') return error;

    if (error?.status === 401) {
        return t('attendance.sessionExpired');
    }
    if (error?.status === 403) {
        return t('attendance.forbidden');
    }
    if (error?.status === 404) {
        return t('attendance.apiError');
    }
    if (error?.status >= 500) {
        return t('attendance.serverError');
    }
    if (error?.status === 400 || error?.status === 422) {
        const payload = error?.data || error;
        if (payload?.errors && typeof payload.errors === 'object') {
            const firstValue = Object.values(payload.errors)?.[0];
            if (Array.isArray(firstValue)) return firstValue[0];
            if (typeof firstValue === 'string') return firstValue;
        }
        if (payload?.message) return payload.message;
        return t('attendance.requestError');
    }
    if (error?.error === 'Failed to fetch' || !navigator.onLine) {
        return t('attendance.networkError');
    }

    const payload = error?.data || error;
    if (payload?.message) return payload.message;
    if (payload?.errors && typeof payload.errors === 'object') {
        const firstValue = Object.values(payload.errors)?.[0];
        if (Array.isArray(firstValue)) return firstValue[0];
        if (typeof firstValue === 'string') return firstValue;
    }
    if (payload?.error) return payload.error;

    return t('common.errorOccurred');
};

const Attendance = () => {
    const { t, i18n } = useTranslation();
    const language = i18n.resolvedLanguage || i18n.language;
    const locale = language?.toLowerCase().startsWith('ar') ? 'ar-EG' : 'en-US';
    const [search, setSearch] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);
    const [notice, setNotice] = useState(null);
    const [isSubmittingCheckIn, setIsSubmittingCheckIn] = useState(false);
    const [pendingSyncState, setPendingSyncState] = useState(getOfflineQueue().length > 0);
    const [mockMemberState, setMockMemberState] = useState(mockMembers);

    const [debouncedSearch] = useDebouncedValue(search, 350);

    const { data: membersResponse, isFetching: isSearchingMembers, error: membersError } = useGetMembersQuery(
        { search: debouncedSearch.trim() },
        { skip: USE_MOCK_ATTENDANCE || !debouncedSearch.trim() }
    );
    const { data: attendanceResponse, isLoading: isApiLoadingAttendance, error: attendanceError, refetch: refetchAttendance } = useGetTodayAttendanceQuery(undefined, {
        skip: USE_MOCK_ATTENDANCE,
    });
    const [checkInMutation] = useCheckInMutation();
    const [syncOfflineAttendance] = useSyncOfflineAttendanceMutation();

    const members = useMemo(() => {
        const searchTerm = debouncedSearch.trim().toLowerCase();
        const list = USE_MOCK_ATTENDANCE
            ? mockMemberState
                .filter((member) => `${member.name} ${member.nameAr} ${member.phone}`.toLowerCase().includes(searchTerm))
                .map((member) => ({ member }))
            : normalizeList(membersResponse);
        return list.filter((member) => {
            const meta = getLocalizedMemberMeta(member, t, language);
            return !!meta.name;
        });
    }, [debouncedSearch, i18n.language, i18n.resolvedLanguage, membersResponse, mockMemberState, t, language]);

    const realAttendanceList = useMemo(() => {
        const list = normalizeList(attendanceResponse);
        return list.map((record) => {
            const memberMeta = getLocalizedMemberMeta(record, t, language);
            return {
                ...record,
                id: record.id ?? record.local_id ?? record.member_id ?? memberMeta.id,
                member: memberMeta,
                checkInTime: getCheckInTime(record),
            };
        });
    }, [attendanceResponse, language, t]);

    const attendanceList = USE_MOCK_ATTENDANCE
        ? mockMemberState
            .filter((member) => member.attendanceStatus === 'present' || member.attendanceStatus === 'late')
            .map((member) => ({ ...member, member }))
        : realAttendanceList;
    const isLoadingAttendance = USE_MOCK_ATTENDANCE ? false : isApiLoadingAttendance;
    const presentCount = USE_MOCK_ATTENDANCE
        ? mockMemberState.filter((member) => member.attendanceStatus === 'present' || member.attendanceStatus === 'late').length
        : attendanceList.length;
    const selectedMemberId = selectedMember ? getMemberMeta(selectedMember, t).id : null;
    const currentSelectedMember = USE_MOCK_ATTENDANCE
        ? mockMemberState.find((member) => member.id === selectedMemberId)
        : selectedMember;
    const selectedMemberInfo = currentSelectedMember
        ? getLocalizedMemberMeta(currentSelectedMember, t, language)
        : null;

    const handleAttendanceStatusChange = (attendanceStatus) => {
        if (!USE_MOCK_ATTENDANCE || !selectedMemberInfo) return;

        setMockMemberState((currentMembers) => currentMembers.map((member) => {
            if (member.id !== selectedMemberInfo.id) return member;

            return {
                ...member,
                attendanceStatus,
                checkInTime: attendanceStatus === 'not_coming'
                    ? null
                    : member.checkInTime || new Date().toISOString(),
            };
        }));
    };

    const syncPendingRecords = useCallback(async () => {
        const queue = getOfflineQueue();
        if (!queue.length || !navigator.onLine) return;

        try {
            await syncOfflineAttendance({ records: queue }).unwrap();
            clearOfflineQueue();
            setPendingSyncState(false);
            setNotice({ type: 'success', key: 'attendance.syncSuccess' });
            if (!USE_MOCK_ATTENDANCE) await refetchAttendance();
        } catch (syncError) {
            setPendingSyncState(true);
            setNotice({
                type: 'error',
                error: syncError,
            });
        }
    }, [refetchAttendance, syncOfflineAttendance, t]);

    useEffect(() => {
        if (navigator.onLine) {
            syncPendingRecords();
        }
    }, [syncPendingRecords]);

    useEffect(() => {
        const handleOnline = () => {
            syncPendingRecords();
        };

        window.addEventListener('online', handleOnline);
        return () => window.removeEventListener('online', handleOnline);
    }, [syncPendingRecords]);

    const handleCheckIn = async () => {
        if (!selectedMember) {
            setNotice({
                type: 'error',
                key: 'attendance.selectMemberError',
            });
            return;
        }

        const memberId = selectedMemberInfo?.id ?? selectedMember.id ?? selectedMember.member_id ?? selectedMember.memberId ?? selectedMember.value;
        if (!memberId) {
            setNotice({
                type: 'error',
                key: 'attendance.invalidMember',
            });
            return;
        }
        if (USE_MOCK_ATTENDANCE) return;

        setIsSubmittingCheckIn(true);

        try {
            if (!navigator.onLine) {
                const queuedRecord = addToOfflineQueue({
                    member_id: memberId,
                    member: selectedMember,
                    check_in_time: new Date().toISOString(),
                    local_id: `offline_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
                });

                setPendingSyncState(true);
                setNotice({
                    type: 'info',
                    key: 'attendance.offlineQueued',
                    values: { id: queuedRecord.local_id },
                });
                setSelectedMember(null);
                setSearch('');
                return;
            }

            const result = await checkInMutation({ member_id: memberId }).unwrap();
            const payloadData = normalizeList(result?.data || result);
            const createdRecord = payloadData[0] || result?.data || result?.attendance || result;

            if (createdRecord && typeof createdRecord === 'object') {
                const memberMeta = getLocalizedMemberMeta(createdRecord, t, language);
                const checkInTime = getCheckInTime(createdRecord);
                setNotice({
                    type: 'success',
                    key: 'attendance.checkInSuccess',
                    values: { name: memberMeta.name, nameAr: memberMeta.nameAr, checkInTime },
                });
            } else {
                setNotice({
                    type: 'success',
                    key: 'attendance.checkedInName',
                    values: { name: selectedMemberInfo.name },
                });
            }

            setSelectedMember(null);
            setSearch('');
            if (!USE_MOCK_ATTENDANCE) await refetchAttendance();
        } catch (error) {
            setNotice({ type: 'error', error });
        } finally {
            setIsSubmittingCheckIn(false);
        }
    };

    const attendanceErrorMessage = USE_MOCK_ATTENDANCE
        ? ''
        : attendanceError
            ? extractErrorMessage(attendanceError, t)
            : null;
    const memberSearchErrorMessage = !USE_MOCK_ATTENDANCE && membersError
        ? extractErrorMessage(membersError, t)
        : null;
    const noticeMember = notice?.memberId
        ? mockMemberState.find((member) => member.id === notice.memberId)
        : null;
    const noticeName = noticeMember
        ? language.toLowerCase().startsWith('ar') && noticeMember.nameAr
            ? noticeMember.nameAr
            : noticeMember.name
        : language.toLowerCase().startsWith('ar') && notice?.values?.nameAr
            ? notice.values.nameAr
            : notice?.values?.name;
    const noticeMessage = notice?.key
        ? t(notice.key, {
            ...notice.values,
            name: noticeName,
            time: notice?.values?.checkInTime
                ? formatTime(notice.values.checkInTime, locale)
                : notice?.values?.time,
        })
        : notice?.error
            ? extractErrorMessage(notice.error, t)
            : '';

    const renderApiErrorAlert = (message) => (
        <Alert color="red" variant="light" icon={<HiExclamationTriangle size={18} />}>
            {message}
        </Alert>
    );

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

                <Button
                    leftSection={<FiUsers size={18} />}
                    className="bg-btn-gradient hover:bg-btn-gradient rounded-xl px-4 h-11 text-sm font-semibold shadow-sm border-0"
                    onClick={() => setSelectedMember(members[0])}
                    disabled={!debouncedSearch.trim() || members.length === 0}
                    aria-label={t('attendance.addAction')}
                >
                    {t('attendance.addAction')}
                </Button>
            </div>

            {notice && (
                <Alert
                    icon={notice.type === 'error' ? <HiExclamationTriangle size={18} /> : <FiCheckCircle size={18} />}
                    color={notice.type === 'error' ? 'red' : notice.type === 'info' ? 'yellow' : 'green'}
                    variant="light"
                    title={notice.type === 'error' ? t('attendance.errorTitle') : notice.type === 'info' ? t('attendance.offlineSavedTitle') : t('common.success')}
                    radius="md"
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
                        {pendingSyncState && (
                            <Badge color="yellow" variant="light">
                                {t('attendance.pendingSync')}
                            </Badge>
                        )}
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

                    {isSearchingMembers && (
                        <div className="mt-3 rounded-xl bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
                            {t('attendance.memberSearchLoading')}
                        </div>
                    )}

                    {memberSearchErrorMessage && (
                        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {memberSearchErrorMessage}
                        </div>
                    )}

                    {!debouncedSearch.trim() && !selectedMember && (
                        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
                            {t('attendance.searchHint')}
                        </div>
                    )}

                    {debouncedSearch.trim() && !isSearchingMembers && members.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {members.slice(0, 6).map((member) => {
                                const memberMeta = getLocalizedMemberMeta(member, t, language);
                                const isSelected = selectedMemberInfo?.id === memberMeta.id;
                                const memberStatus = attendanceStatusMeta[memberMeta.attendanceStatus] || attendanceStatusMeta.not_coming;

                                return (
                                    <button
                                        key={memberMeta.id ?? member.id ?? memberMeta.phone ?? memberMeta.name}
                                        type="button"
                                        onClick={() => setSelectedMember(member)}
                                        aria-pressed={isSelected}
                                        className={`w-full rounded-xl border px-3 py-3 text-start transition hover:border-[#85F40F] hover:bg-[#f4feea] dark:hover:bg-slate-900 ${isSelected ? 'border-[#85F40F] bg-[#f4feea] dark:bg-slate-900' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-[#0c101d]'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar size={36} src={memberMeta.photo || undefined} radius="xl" color="green">
                                                {memberMeta.name?.charAt(0)?.toUpperCase() || 'M'}
                                            </Avatar>
                                            <div className="min-w-0 flex-1">
                                                <div className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{memberMeta.name}</div>
                                                <div className="truncate text-xs text-slate-500 dark:text-slate-400">{memberMeta.phone || '—'}</div>
                                            </div>
                                            {USE_MOCK_ATTENDANCE && (
                                                <Badge color={memberStatus.color} variant="light" radius="sm" style={{ textTransform: 'none' }}>
                                                    {t(memberStatus.key)}
                                                </Badge>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {debouncedSearch.trim() && !isSearchingMembers && members.length === 0 && !memberSearchErrorMessage && (
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
                                <Avatar size={46} src={selectedMemberInfo.photo || undefined} radius="xl" color="green">
                                    {selectedMemberInfo.name?.charAt(0)?.toUpperCase() || 'M'}
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <Text fw={700} className="truncate text-slate-800 dark:text-slate-100">{selectedMemberInfo.name}</Text>
                                    <Text size="xs" c="dimmed" className="truncate">{selectedMemberInfo.phone || '—'}</Text>
                                </div>
                            </div>

                            <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                                <div className="flex items-center gap-2">
                                    <span>{t('attendance.status')}:</span>
                                    <Badge
                                        color={attendanceStatusMeta[selectedMemberInfo.attendanceStatus]?.color || 'gray'}
                                        variant="light"
                                        radius="sm"
                                        style={{ textTransform: 'none' }}
                                    >
                                        {t(attendanceStatusMeta[selectedMemberInfo.attendanceStatus]?.key || 'attendance.notComing')}
                                    </Badge>
                                </div>
                                {selectedMemberInfo.checkInTime && (
                                    <div>
                                        {t('attendance.checkInTime')}: {formatTime(selectedMemberInfo.checkInTime, locale)}
                                    </div>
                                )}
                            </div>

                            {USE_MOCK_ATTENDANCE && (
                                <div className="space-y-2">
                                    <Text size="sm" fw={600} className="text-slate-700 dark:text-slate-200">
                                        {t('attendance.attendanceStatus')}
                                    </Text>
                                    <SegmentedControl
                                        fullWidth
                                        value={selectedMemberInfo.attendanceStatus}
                                        onChange={handleAttendanceStatusChange}
                                        data={[
                                            { label: t('attendance.present'), value: 'present' },
                                            { label: t('attendance.late'), value: 'late' },
                                            { label: t('attendance.notComing'), value: 'not_coming' },
                                        ]}
                                    />
                                </div>
                            )}

                            {(!USE_MOCK_ATTENDANCE || selectedMemberInfo.attendanceStatus !== 'not_coming') && (
                                <Button
                                    fullWidth
                                    type="button"
                                    loading={isSubmittingCheckIn}
                                    loaderProps={{ type: 'dots' }}
                                    onClick={handleCheckIn}
                                    disabled={USE_MOCK_ATTENDANCE}
                                    className="h-11 rounded-xl bg-btn-gradient text-sm font-semibold"
                                    aria-label={t(USE_MOCK_ATTENDANCE ? 'attendance.checkedIn' : 'attendance.checkIn')}
                                >
                                    {t(USE_MOCK_ATTENDANCE ? 'attendance.checkedIn' : 'attendance.checkIn')}
                                </Button>
                            )}
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
            </Card>

            <Card className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0e1517] shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <Text fw={700} size="lg" className="text-slate-800 dark:text-white">
                        {t('attendance.todayTableTitle')}
                    </Text>
                </div>

                {attendanceErrorMessage ? (
                    renderApiErrorAlert(attendanceErrorMessage)
                ) : isLoadingAttendance ? (
                    <Table.ScrollContainer minWidth={600}>
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>{t('attendance.memberName')}</Table.Th>
                                    <Table.Th>{t('attendance.phone')}</Table.Th>
                                    <Table.Th>{t('attendance.checkInTime')}</Table.Th>
                                    <Table.Th>{t('attendance.status')}</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <TableSkeleton colCount={4} rowCount={5} />
                        </Table>
                    </Table.ScrollContainer>
                ) : attendanceList.length === 0 ? (
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
                                                <Badge color={memberStatus.color} variant="light" radius="sm" style={{ textTransform: 'none' }}>
                                                    {t(memberStatus.key)}
                                                </Badge>
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
