import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper, Table } from '@mantine/core';
import { RiVipCrownLine } from 'react-icons/ri';
import { TableBody, TableFooter, TableHeader, TableSkeleton } from '../../../components/Tables';
import SubscriptionRow from './SubscriptionRow';

const TABLE_HEADERS = [
    { labelKey: 'subscriptions.table.member', width: '22%' },
    { labelKey: 'subscriptions.table.plan', width: '20%' },
    { labelKey: 'subscriptions.table.period', width: '22%' },
    { labelKey: 'subscriptions.table.status', width: '14%' },
    { labelKey: 'subscriptions.table.payment', width: '10%' },
];
const ACTIONS_HEADER = { labelKey: 'common.actions', width: '12%', align: 'center' };

const SubscriptionsTable = ({
    subscriptions,
    isLoading,
    hasAnySubscription,
    canManage,
    page,
    setPage,
    totalPages,
    totalCount,
    onRenew,
    onCreate,
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
                            data={subscriptions}
                            colSpan={headers.length}
                            emptyIcon={<RiVipCrownLine size={28} />}
                            emptyMessage={t(hasAnySubscription ? 'subscriptions.noResultsTitle' : 'subscriptions.emptyTitle')}
                            emptyDescription={t(hasAnySubscription ? 'subscriptions.noResultsDesc' : 'subscriptions.emptyDesc')}
                            emptyActionLabel={canManage && !hasAnySubscription ? t('subscriptions.create') : undefined}
                            onEmptyAction={onCreate}
                            renderRow={(item) => (
                                <SubscriptionRow key={item.id} item={item} locale={locale} onRenew={canManage ? onRenew : undefined} />
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

export default SubscriptionsTable;
