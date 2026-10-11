/** Form values are strings (what the inputs hold); the payload uses API types. */
export const getEquipmentDefaultValues = (equipment = null) => ({
    ...(equipment?.id ? { id: equipment.id } : {}),
    name: equipment?.name ?? '',
    purchase_date: equipment?.purchase_date ?? '',
    last_maintenance_date: equipment?.last_maintenance_date ?? '',
    maintenance_interval_days:
        equipment?.maintenance_interval_days != null ? String(equipment.maintenance_interval_days) : '',
});

/** gym_id is never sent: the backend derives it from the access token. */
export const toEquipmentPayload = (values) => ({
    name: values.name.trim(),
    purchase_date: values.purchase_date,
    last_maintenance_date: values.last_maintenance_date || null,
    maintenance_interval_days: Number(values.maintenance_interval_days),
});
