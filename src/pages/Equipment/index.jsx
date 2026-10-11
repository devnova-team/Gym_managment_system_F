import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from '@mantine/core';
import { RiAlarmWarningLine, RiToolsLine } from 'react-icons/ri';
import PageHeader from '../../components/PageHeader';
import SearchInput from '../../components/SearchInput';
import { DueStatusTabs } from '../../components/DueStatus';
import { DUE_STATUS } from '../../utils/dateOnly';
import { useEquipment } from './hooks/useEquipment';
import EquipmentTable from './components/EquipmentTable';
import EquipmentFormModal from './form/EquipmentFormModal';

const CLOSED_FORM = { opened: false, equipment: null };

const Equipment = () => {
    const { t } = useTranslation();
    const {
        equipment,
        totalCount,
        statusCounts,
        statusFilter,
        setStatusFilter,
        search,
        setSearch,
        page,
        totalPages,
        setPage,
        isLoading,
        isError,
        refetch,
        saveEquipment,
        isSaving,
    } = useEquipment();

    const [form, setForm] = useState(CLOSED_FORM);
    const openCreate = () => setForm({ opened: true, equipment: null });
    const openEdit = (item) => setForm({ opened: true, equipment: item });
    const closeForm = () => setForm(CLOSED_FORM);

    const needsAttention = statusCounts[DUE_STATUS.OVERDUE] + statusCounts[DUE_STATUS.DUE];

    return (
        <div className="w-full space-y-6 pb-10">
            <PageHeader
                icon={<RiToolsLine size={22} />}
                title={t('equipment.title', 'Equipment & Maintenance')}
                subtitle={t('equipment.subtitle', 'Equipment registry with maintenance schedules.')}
                actionLabel={t('equipment.addEquipment', 'Add Machine/Equipment')}
                onAction={openCreate}
            />

            {!isLoading && needsAttention > 0 && (
                <Alert
                    color="red"
                    radius="lg"
                    variant="light"
                    icon={<RiAlarmWarningLine size={20} />}
                    title={t('equipment.maintenanceDue', 'Maintenance Required')}
                >
                    {t('equipment.attentionSummary', {
                        overdue: statusCounts[DUE_STATUS.OVERDUE],
                        due: statusCounts[DUE_STATUS.DUE],
                        defaultValue: '{{overdue}} overdue and {{due}} due today.',
                    })}
                </Alert>
            )}

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <DueStatusTabs value={statusFilter} onChange={setStatusFilter} counts={statusCounts} total={totalCount} />
                <SearchInput
                    className="w-full lg:w-72"
                    placeholder={t('equipment.searchPlaceholder', 'Search equipment...')}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    onClear={() => setSearch('')}
                    clearLabel={t('common.clearSearch', 'Clear search')}
                />
            </div>

            <EquipmentTable
                equipment={equipment}
                totalCount={totalCount}
                isLoading={isLoading}
                isError={isError}
                onRetry={refetch}
                onAdd={openCreate}
                onEdit={openEdit}
                page={page}
                totalPages={totalPages}
                setPage={setPage}
            />

            <EquipmentFormModal
                opened={form.opened}
                equipment={form.equipment}
                onClose={closeForm}
                onSave={saveEquipment}
                isSaving={isSaving}
            />
        </div>
    );
};

export default Equipment;
