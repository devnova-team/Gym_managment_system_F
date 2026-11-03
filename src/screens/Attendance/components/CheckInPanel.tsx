import { useTranslation } from 'react-i18next';
import { Alert, Avatar, Button, Paper, Text } from '@mantine/core';
import { FiCheckCircle } from 'react-icons/fi';
import { HiExclamationTriangle } from 'react-icons/hi2';
import SearchInput from '../../../components/SearchInput';
import { useMemberSubscription } from '../../../features/subscriptions/hooks/useSubscriptions';

const MAX_RESULTS = 6;

const Hint = ({ children }) => (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
        {children}
    </div>
);

const MemberButton = ({ member, isSelected, onSelect }) => (
    <button
        type="button"
        onClick={() => onSelect(member)}
        aria-pressed={isSelected}
        className={`w-full rounded-xl border px-3 py-3 text-start transition cursor-pointer hover:border-[#85F40F] hover:bg-[#f4feea] dark:hover:bg-slate-900 ${isSelected ? 'border-[#85F40F] bg-[#f4feea] dark:bg-slate-900' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-[#0c101d]'}`}
    >
        <div className="flex items-center gap-3">
            <Avatar size={36} src={member.photo_url || undefined} radius="xl" color="green">
                {member.name?.charAt(0)?.toUpperCase() || 'M'}
            </Avatar>
            <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{member.name}</div>
                <div className="truncate text-xs text-slate-500 dark:text-slate-400" dir="ltr">{member.phone || '—'}</div>
            </div>
        </div>
    </button>
);

// Warnings from the member's latest subscription. The backend remains the final authority on check-in.
const SubscriptionNotice = ({ memberId }) => {
    const { t } = useTranslation();
    const { subscription, status, isLoading } = useMemberSubscription(memberId);

    if (isLoading) return null;
    if (!subscription) return <Alert color="yellow" variant="light" icon={<HiExclamationTriangle size={18} />}>{t('attendance.noSubscription')}</Alert>;
    if (status === 'expired') return <Alert color="red" variant="light" icon={<HiExclamationTriangle size={18} />}>{t('attendance.expiredWarning')}</Alert>;
    if (subscription.payment_status !== 'paid') return <Alert color="yellow" variant="light" icon={<HiExclamationTriangle size={18} />}>{t('attendance.unpaidWarning')}</Alert>;
    return null;
};

const CheckInPanel = ({
    search,
    onSearchChange,
    members,
    isSearching,
    isError,
    selectedMember,
    onSelect,
    onClear,
    onCheckIn,
    isCheckingIn,
    hasPendingCheckIn,
    isOnline,
}) => {
    const { t } = useTranslation();
    const hasQuery = Boolean(search.trim());

    return (
        <Paper
            radius="lg"
            p={{ base: 'md', sm: 'lg' }}
            className="bg-white dark:bg-[#0e1517]! border border-slate-200 dark:border-slate-800 shadow-smoothCard"
        >
            <Text fw={700} size="sm" className="text-slate-700 dark:text-slate-200">{t('attendance.searchTitle')}</Text>
            <Text size="xs" c="dimmed" mb="sm">{t('attendance.searchSubtitle')}</Text>

            <SearchInput
                id="attendance-member-search"
                name="attendance-member-search"
                placeholder={t('attendance.searchPrompt')}
                clearLabel={t('common.clearSearch')}
                value={search}
                onChange={(event) => onSearchChange(event.currentTarget.value)}
                onClear={onClear}
            />

            <div className="mt-4 space-y-2">
                {!hasQuery && !selectedMember && <Hint>{t('attendance.searchHint')}</Hint>}
                {hasQuery && isError && <Hint>{t('attendance.memberSearchError')}</Hint>}
                {hasQuery && !isError && isSearching && members.length === 0 && <Hint>{t('attendance.memberSearchLoading')}</Hint>}
                {hasQuery && !isError && !isSearching && members.length === 0 && <Hint>{t('attendance.noMemberFound')}</Hint>}

                {hasQuery && members.slice(0, MAX_RESULTS).map((member) => (
                    <MemberButton
                        key={member.id}
                        member={member}
                        isSelected={String(selectedMember?.id) === String(member.id)}
                        onSelect={onSelect}
                    />
                ))}
            </div>

            {selectedMember && (
                <div className="mt-4 space-y-3 border-t border-slate-100 dark:border-white/5 pt-4">
                    <Text fw={700} size="sm" className="text-slate-700 dark:text-slate-200">
                        {t('attendance.memberInfo')}: {selectedMember.name}
                    </Text>

                    <SubscriptionNotice memberId={selectedMember.id} />

                    {hasPendingCheckIn && (
                        <Alert color="yellow" variant="light" icon={<FiCheckCircle size={18} />}>
                            {t('attendance.pendingExists')}
                        </Alert>
                    )}

                    <Button
                        fullWidth
                        type="button"
                        loading={isCheckingIn}
                        loaderProps={{ type: 'dots' }}
                        disabled={hasPendingCheckIn}
                        onClick={onCheckIn}
                        className="h-11 rounded-xl bg-btn-gradient text-sm font-semibold disabled:opacity-50"
                    >
                        {isOnline ? t('attendance.checkIn') : t('attendance.checkInOffline')}
                    </Button>
                </div>
            )}
        </Paper>
    );
};

export default CheckInPanel;
