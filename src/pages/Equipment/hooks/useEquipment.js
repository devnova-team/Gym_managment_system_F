import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebouncedValue } from '@mantine/hooks';
import { useToast } from '../../../Context/ToastContext';
import { useMockCollection } from '../../../hooks/useMockCollection';
import { ALL_STATUSES, countByDueStatus } from '../../../components/DueStatus';
import { todayISO } from '../../../utils/dateOnly';
import { EQUIPMENT_PAGE_SIZE, EQUIPMENT_STORAGE_KEY } from '../constants/equipmentConstants';
import { MOCK_EQUIPMENT } from '../constants/mockEquipment';
import { compareByNextDue, withMaintenanceStatus } from '../utils/maintenance';

// API phase: replace useMockCollection with useGetEquipmentQuery,
// useCreateEquipmentMutation and useUpdateEquipmentMutation from equipmentApi.
export const useEquipment = () => {
    const { t } = useTranslation();
    const { toast } = useToast();

    const { data, isLoading, isError, refetch, create, update, isMutating } = useMockCollection({
        storageKey: EQUIPMENT_STORAGE_KEY,
        seed: MOCK_EQUIPMENT,
        uniqueField: 'name',
        uniqueMessage: t('equipment.validation.nameTaken', 'Equipment with this name already exists'),
    });

    const [statusFilter, setStatusFilterState] = useState(ALL_STATUSES);
    const [search, setSearchState] = useState('');
    const [page, setPage] = useState(1);
    const [debouncedSearch] = useDebouncedValue(search, 300);

    const setStatusFilter = useCallback((value) => {
        setStatusFilterState(value);
        setPage(1);
    }, []);

    const setSearch = useCallback((value) => {
        setSearchState(value);
        setPage(1);
    }, []);

    const equipment = useMemo(() => {
        const today = todayISO();
        return data.map((item) => withMaintenanceStatus(item, today)).sort(compareByNextDue);
    }, [data]);

    const statusCounts = useMemo(() => countByDueStatus(equipment, (item) => item.status), [equipment]);

    const filteredEquipment = useMemo(() => {
        const query = debouncedSearch.trim().toLowerCase();
        return equipment.filter(
            (item) =>
                (statusFilter === ALL_STATUSES || item.status === statusFilter) &&
                (!query || item.name.toLowerCase().includes(query))
        );
    }, [equipment, statusFilter, debouncedSearch]);

    const totalPages = Math.max(1, Math.ceil(filteredEquipment.length / EQUIPMENT_PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pagedEquipment = filteredEquipment.slice(
        (currentPage - 1) * EQUIPMENT_PAGE_SIZE,
        currentPage * EQUIPMENT_PAGE_SIZE
    );

    /** Creates or updates; rejects with the API error so the form can show field errors. */
    const saveEquipment = useCallback(
        async (payload, id) => {
            if (id) {
                await update(id, payload);
                toast.success(t('equipment.updated', 'Equipment updated successfully'));
            } else {
                await create(payload);
                toast.success(t('equipment.created', 'Equipment added successfully'));
            }
        },
        [create, update, toast, t]
    );

    return {
        equipment: pagedEquipment,
        totalCount: equipment.length,
        filteredCount: filteredEquipment.length,
        statusCounts,
        statusFilter,
        setStatusFilter,
        search,
        setSearch,
        page: currentPage,
        totalPages,
        setPage,
        isLoading,
        isError,
        refetch,
        saveEquipment,
        isSaving: isMutating,
    };
};

export default useEquipment;
