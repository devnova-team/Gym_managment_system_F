import { useEffect, useRef } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mantine/core';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { HiOutlineCheck } from 'react-icons/hi2';

const DynamicForm = ({
    fields = [],
    validationSchema,
    onSubmit: customSubmit,
    isLoading = false,
    defaultValues,
    onCancel,
    submitText = 'Save Changes',
    submitIcon = <HiOutlineCheck size={18} />,
    cancelText = 'Cancel',
    className = 'w-full',
}) => {
    const {
        handleSubmit,
        control,
        formState: { errors, isValid, isDirty },
        reset,
        setValue,
        watch,
    } = useForm({
        resolver: validationSchema ? yupResolver(validationSchema) : undefined,
        mode: 'onChange',
        defaultValues,
    });

    const prevDefaultValuesRef = useRef(defaultValues);
    useEffect(() => {
        if (isLoading) return;
        if (defaultValues && defaultValues !== prevDefaultValuesRef.current) {
            prevDefaultValuesRef.current = defaultValues;
            reset(defaultValues);
        }
    }, [defaultValues, reset, isLoading]);

    const formValues = useWatch({ control });

    const getColSpanClass = (fieldItem) => {
        if (fieldItem.className) return fieldItem.className;
        if (fieldItem.colSpan === 6) return 'col-span-12 sm:col-span-6';
        if (fieldItem.colSpan === 4) return 'col-span-12 sm:col-span-4';
        if (fieldItem.colSpan === 3) return 'col-span-12 sm:col-span-3';
        if (fieldItem.colSpan === 8) return 'col-span-12 sm:col-span-8';
        return 'col-span-12';
    };

    const onSubmit = (data) => customSubmit?.(data, { reset, setValue });

    const isSubmitDisabled = Boolean((!isDirty && defaultValues?.id) || !isValid || isLoading);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={className}>
            <div className="grid grid-cols-12 gap-4">
                {fields?.map((fieldItem) => {
                    if (!fieldItem || typeof fieldItem.component !== 'function') {
                        return null;
                    }

                    const shouldRender =
                        formValues && typeof fieldItem.condition === 'function'
                            ? fieldItem.condition(formValues)
                            : true;

                    if (!shouldRender) return null;

                    return (
                        <div key={fieldItem.id || fieldItem.name} className={getColSpanClass(fieldItem)}>
                            <Controller
                                name={fieldItem.name}
                                control={control}
                                render={({ field }) =>
                                    fieldItem.component({
                                        field: {
                                            id: fieldItem.id || fieldItem.name,
                                            name: fieldItem.name,
                                            ...field,
                                        },
                                        error: errors[fieldItem.name]?.message,
                                        formValues,
                                        setValue,
                                        watch,
                                    })
                                }
                            />
                        </div>
                    );
                })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-5 mt-4 border-t border-slate-200 dark:border-slate-800 w-full">
                {onCancel && (
                    <Button
                        variant="outline"
                        color='gray'
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        radius="md"
                        className="w-full! sm:w-auto! h-10 px-6 border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-semibold transition-all cursor-pointer justify-center"
                    >
                        {cancelText}
                    </Button>
                )}

                <Button
                    type="submit"
                    loading={isLoading}
                    disabled={isSubmitDisabled}
                    radius="md"
                    leftSection={submitIcon}
                    className={`w-full! sm:w-auto! h-10 px-7 font-bold text-sm bg-linear-to-r from-[#85F40F] to-[#6CC80A] hover:from-[#95E913] hover:to-[#79BE0D] text-brand-950 transition-all duration-200 btn-brand-submit justify-center ${
                        isSubmitDisabled
                            ? 'opacity-50! shadow-none! cursor-not-allowed!'
                            : 'active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(133,244,15,0.35)]'
                    }`}
                    style={{
                        backgroundImage: 'linear-gradient(to right, #85F40F, #6CC80A)',
                        backgroundColor: 'transparent',
                        color: '#061400',
                        opacity: isSubmitDisabled ? 0.5 : 1,
                        boxShadow: isSubmitDisabled ? 'none' : undefined,
                        cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
                    }}
                >
                    {submitText}
                </Button>
            </div>
        </form>
    );
};

export default DynamicForm;
