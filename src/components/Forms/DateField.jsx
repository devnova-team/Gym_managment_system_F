import React, { forwardRef, useMemo } from 'react';
import { DatePickerInput } from '@mantine/dates';
import { Controller } from 'react-hook-form';
import { FiCalendar } from 'react-icons/fi';

/**
 * Safely parses any date input (string YYYY-MM-DD or Date object) into a valid local Date object.
 */
const toDateObject = (val) => {
    if (!val) return null;
    if (val instanceof Date) {
        return isNaN(val.getTime()) ? null : val;
    }
    if (typeof val === 'string') {
        const trimmed = val.trim();
        if (!trimmed) return null;
        // Parse YYYY-MM-DD format manually to prevent UTC timezone shifts
        const parts = trimmed.split('-');
        if (parts.length === 3) {
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const day = parseInt(parts[2], 10);
            if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                return new Date(year, month, day);
            }
        }
        const parsed = new Date(trimmed);
        return isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
};

/**
 * Formats a Date object into YYYY-MM-DD string.
 */
const toDateString = (date) => {
    if (!date) return '';
    if (typeof date === 'string') return date;
    if (date instanceof Date && !isNaN(date.getTime())) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
    return '';
};

const DateField = forwardRef(({
    control,
    name,
    label,
    placeholder = 'YYYY-MM-DD',
    description,
    error,
    required = false,
    withAsterisk,
    disabled = false,
    readOnly = false,
    leftSection,
    rightSection,
    clearable = true,
    valueFormat = 'YYYY-MM-DD',
    valueType = 'string', // 'string' (YYYY-MM-DD) or 'date' (Date object)
    minDate,
    maxDate,
    popoverProps,
    classNames,
    className = 'w-full',
    containerClassName = '',
    size = 'sm',
    radius = 'md',
    value: controlledValue,
    onChange: controlledOnChange,
    onBlur: controlledOnBlur,
    ...rest
}, ref) => {
    const hasAsterisk = withAsterisk !== undefined ? withAsterisk : Boolean(required);

    const defaultClassNames = {
        input: 'dark:!bg-white/5 dark:!border-white/10 dark:!text-white focus:[&:not([data-error]):not([data-invalid]):not([aria-invalid="true"])]:!border-[#85F40F] font-medium transition-colors cursor-pointer',
        label: 'dark:!text-white font-medium text-xs mb-1',
        description: 'text-[11px] text-gray-400 dark:text-gray-400 mb-1',
        ...classNames,
    };

    const defaultPopoverProps = useMemo(() => ({
        shadow: 'xl',
        radius: 'lg',
        withinPortal: true,
        transitionProps: { transition: 'fade', duration: 150 },
        classNames: {
            dropdown: 'dark:!bg-[#0e1517] dark:!border-white/10 border border-slate-200 shadow-2xl rounded-2xl! p-2!',
            ...popoverProps?.classNames,
        },
        ...popoverProps,
    }), [popoverProps]);

    const resolvedMinDate = useMemo(() => toDateObject(minDate), [minDate]);
    const resolvedMaxDate = useMemo(() => toDateObject(maxDate), [maxDate]);

    const renderInput = ({ value, onChange, onBlur, fieldRef }) => {
        const dateValue = toDateObject(value);

        const handleChange = (selectedDate) => {
            if (!onChange) return;
            if (valueType === 'date') {
                onChange(selectedDate);
            } else {
                // Return YYYY-MM-DD string (or '' when cleared)
                onChange(toDateString(selectedDate));
            }
        };

        return (
            <DatePickerInput
                ref={fieldRef || ref}
                id={rest.id || name}
                name={name}
                value={dateValue}
                onChange={handleChange}
                onBlur={onBlur}
                label={label}
                placeholder={placeholder}
                description={description}
                error={error}
                required={required}
                withAsterisk={hasAsterisk}
                disabled={disabled}
                readOnly={readOnly}
                clearable={clearable}
                valueFormat={valueFormat}
                minDate={resolvedMinDate}
                maxDate={resolvedMaxDate}
                leftSection={
                    leftSection || (
                        <FiCalendar
                            size={16}
                            className="text-slate-400 dark:text-[#85F40F] transition-colors"
                        />
                    )
                }
                rightSection={rightSection}
                classNames={defaultClassNames}
                className={className}
                popoverProps={defaultPopoverProps}
                size={size}
                radius={radius}
                {...rest}
            />
        );
    };

    if (control) {
        return (
            <div className={containerClassName}>
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) =>
                        renderInput({
                            value: field.value,
                            onChange: field.onChange,
                            onBlur: field.onBlur,
                            fieldRef: field.ref,
                        })
                    }
                />
            </div>
        );
    }

    return (
        <div className={containerClassName}>
            {renderInput({
                value: controlledValue ?? rest.value,
                onChange: controlledOnChange ?? rest.onChange,
                onBlur: controlledOnBlur ?? rest.onBlur,
            })}
        </div>
    );
});

DateField.displayName = 'DateField';

export default DateField;
export { DateField as DatePickerField, DatePickerInput };
