import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Paper, Table, Tooltip } from '@mantine/core';
import { RiDeleteBinLine, RiEditLine, RiVipDiamondLine } from 'react-icons/ri';
import { TableBody, TableHeader, TableSkeleton } from '../../../components/Tables';
import { DURATION_PRESETS } from '../../../features/plans/validation/planValidation';
import { formatCurrency } from '../../../utils/formatters';

const TABLE_HEADERS = [
    { labelKey: 'plans.table.name', width: '24%' },
    { labelKey: 'plans.table.type', width: '16%' },
    { labelKey: 'plans.table.duration', width: '18%' },
    { labelKey: 'plans.table.price', width: '14%' },
    { labelKey: 'plans.table.absenceThreshold', width: '16%' },
];

const PlanRow = ({ plan, locale, canManage, onEdit, onDelete }) => {
    const { t } = useTranslation();
    const preset = DURATION_PRESETS.find(({ days }) => days === Number(plan.duration_days));

    return (
        <Table.Tr className="hover:bg-slate-50/70 dark:hover:bg-white/4 transition-colors text-xs border-b border-slate-100 dark:border-white/5">
            <Table.Td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">{plan.name}</Table.Td>
            <Table.Td className="p-3.5 text-slate-600 dark:text-slate-300">
                {t(`subscriptions.planTypes.${plan.type}`, { defaultValue: plan.type })}
            </Table.Td>
            <Table.Td className="p-3.5">
                {preset && <div className="font-bold text-slate-800 dark:text-white">{t(`plans.durations.${preset.key}`)}</div>}
                <div className="text-[11px] text-slate-400 dark:text-slate-500">
                    {t('plans.daysCount', { count: Number(plan.duration_days) })}
                </div>
            </Table.Td>
            <Table.Td className="p-3.5 font-black text-sm text-emerald-600 dark:text-emerald-400">
                {formatCurrency(plan.price, 'EGP', locale)}
            </Table.Td>
            <Table.Td className="p-3.5 text-slate-600 dark:text-slate-300">
                {t('plans.daysCount', { count: Number(plan.absence_threshold_days) })}
            </Table.Td>
            {canManage && (
                <Table.Td className="p-3.5 text-center!">
                    <div className="inline-flex items-center gap-1.5">
                        <Tooltip label={t('common.edit')} withArrow>
                            <ActionIcon variant="light" color="lime" radius="md" onClick={() => onEdit(plan)} aria-label={t('common.edit')}>
                                <RiEditLine size={15} />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label={t('common.delete')} withArrow>
                            <ActionIcon variant="light" color="red" radius="md" onClick={() => onDelete(plan)} aria-label={t('common.delete')}>
                                <RiDeleteBinLine size={15} />
                            </ActionIcon>
                        </Tooltip>
                    </div>
                </Table.Td>
            )}
        </Table.Tr>
    );
};

const PlansTable = ({ plans, isLoading, canManage, onCreate, onEdit, onDelete }) => {
    const { t, i18n } = useTranslation();
    const locale = i18n.dir() === 'rtl' ? 'ar-EG' : 'en-US';

    const headers = useMemo(() => {
        const columns = TABLE_HEADERS.map(({ labelKey, ...rest }) => ({ label: t(labelKey), ...rest }));
        return canManage ? [...columns, { label: t('common.actions'), width: '12%', align: 'center' }] : columns;
    }, [t, canManage]);

    return (
        <Paper
            p={{ base: 'xs', sm: 'md' }}
            radius="lg"
            className="w-full bg-white dark:bg-[#0e1517]! border border-slate-200 dark:border-slate-800 shadow-smoothCard overflow-hidden"
        >
            <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-white/5 scrollbar-thin">
                <Table highlightOnHover verticalSpacing="sm" horizontalSpacing="md" className="w-full text-xs sm:text-sm whitespace-nowrap min-w-175">
                    <TableHeader headers={headers} />
                    {isLoading ? (
                        <TableSkeleton colCount={headers.length} rowCount={4} />
                    ) : (
                        <TableBody
                            data={plans}
                            colSpan={headers.length}
                            emptyIcon={<RiVipDiamondLine size={28} />}
                            emptyMessage={t('plans.emptyTitle')}
                            emptyDescription={t(canManage ? 'plans.emptyDescOwner' : 'plans.emptyDescStaff')}
                            emptyActionLabel={canManage ? t('plans.create') : undefined}
                            onEmptyAction={onCreate}
                            renderRow={(plan) => (
                                <PlanRow
                                    key={plan.id}
                                    plan={plan}
                                    locale={locale}
                                    canManage={canManage}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            )}
                        />
                    )}
                </Table>
            </div>
        </Paper>
    );
};

export default PlansTable;
