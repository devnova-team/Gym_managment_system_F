import { ActionIcon, Table, Tooltip } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { RiEditLine, RiErrorWarningLine, RiToolsLine } from 'react-icons/ri';
import { TableBody, TableContainer, TableEmptyState, TableFooter, TableHeader, TableSkeleton } from '../../../components/Tables';
import { DueCountdown, DueStatusBadge } from '../../../components/DueStatus';
import { useLanguage } from '../../../Context/LanguageContext';
import { formatISODate } from '../../../utils/dateOnly';

const COLUMN_COUNT = 6;

const EquipmentRow = ({ item, language, onEdit, t }) => (
    <Table.Tr>
        <Table.Td className="p-3.5">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 shrink-0 rounded-xl bg-[#85F40F]/15 text-[#85F40F] flex items-center justify-center">
                    <RiToolsLine size={18} />
                </div>
                <span className="font-semibold text-slate-800 dark:text-white">{item.name}</span>
            </div>
        </Table.Td>
        <Table.Td className="p-3.5 text-sm text-slate-600 dark:text-slate-300">
            {formatISODate(item.purchase_date, language)}
        </Table.Td>
        <Table.Td className="p-3.5 text-sm text-slate-600 dark:text-slate-300">
            {item.last_maintenance_date
                ? formatISODate(item.last_maintenance_date, language)
                : <span className="text-slate-400">{t('equipment.neverServiced', 'Never serviced')}</span>}
        </Table.Td>
        <Table.Td className="p-3.5">
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-800 dark:text-white">
                    {formatISODate(item.next_maintenance_due, language)}
                </span>
                <DueCountdown date={item.next_maintenance_due} />
            </div>
        </Table.Td>
        <Table.Td className="p-3.5">
            <DueStatusBadge status={item.status} />
        </Table.Td>
        <Table.Td className="p-3.5 text-end">
            <Tooltip label={t('common.edit', 'Edit')} withArrow>
                <ActionIcon
                    variant="subtle"
                    color="gray"
                    radius="md"
                    onClick={() => onEdit(item)}
                    aria-label={`${t('common.edit', 'Edit')} ${item.name}`}
                >
                    <RiEditLine size={17} />
                </ActionIcon>
            </Tooltip>
        </Table.Td>
    </Table.Tr>
);

const EquipmentTable = ({
    equipment,
    totalCount,
    isLoading,
    isError,
    onRetry,
    onAdd,
    onEdit,
    page,
    totalPages,
    setPage,
}) => {
    const { t } = useTranslation();
    const { language } = useLanguage();

    const headers = [
        t('equipment.name', 'Equipment name'),
        t('equipment.purchaseDate', 'Purchase Date'),
        t('equipment.lastMaintenance', 'Last Service Date'),
        t('equipment.nextDue', 'Next Due Date'),
        t('common.status', 'Status'),
        { label: t('common.actions', 'Actions'), align: 'end' },
    ];

    if (isError) {
        return (
            <TableContainer>
                <Table.Tbody>
                    <Table.Tr>
                        <Table.Td colSpan={COLUMN_COUNT} className="p-0">
                            <TableEmptyState
                                icon={<RiErrorWarningLine size={28} className="text-rose-500" />}
                                title={t('equipment.loadError', 'Could not load equipment')}
                                description={t('common.errorOccurred', 'An error occurred. Please try again.')}
                                actionLabel={t('common.retry', 'Retry')}
                                onAction={onRetry}
                            />
                        </Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </TableContainer>
        );
    }

    const hasNoEquipment = totalCount === 0;

    return (
        <TableContainer>
            <TableHeader headers={headers} />
            {isLoading ? (
                <TableSkeleton colCount={COLUMN_COUNT} rowCount={5} />
            ) : (
                <TableBody
                    data={equipment}
                    colSpan={COLUMN_COUNT}
                    renderRow={(item) => (
                        <EquipmentRow key={item.id} item={item} language={language} onEdit={onEdit} t={t} />
                    )}
                    emptyIcon={<RiToolsLine size={28} />}
                    emptyMessage={
                        hasNoEquipment
                            ? t('equipment.emptyTitle', 'No equipment yet')
                            : t('common.noResults', 'No matching results')
                    }
                    emptyDescription={
                        hasNoEquipment
                            ? t('equipment.emptyDescription', 'Add your machines to start tracking their maintenance.')
                            : t('common.noResultsHint', 'Try a different search or filter.')
                    }
                    emptyActionLabel={hasNoEquipment ? t('equipment.addEquipment', 'Add Machine/Equipment') : undefined}
                    onEmptyAction={hasNoEquipment ? onAdd : undefined}
                />
            )}
            {!isLoading && totalPages > 1 && (
                <TableFooter page={page} totalPages={totalPages} setPage={setPage} colSpan={COLUMN_COUNT} />
            )}
        </TableContainer>
    );
};

export default EquipmentTable;
