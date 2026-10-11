import { Textarea, TextInput } from "@mantine/core";
import { Controller } from "react-hook-form";

const TextInputField = ({
    control,
    name,
    label,
    placeholder,
    description,
    error,
    required = false,
    withAsterisk,
    disabled = false,
    readOnly = false,
    type = "text",
    leftSection,
    rightSection,
    classNames,
    className = "w-full",
    containerClassName = "",
    defaultValue = "",
    textarea = false,
    autosize = true,
    minRows = 3,
    maxRows,
    size = "sm",
    radius = "md",
    ...rest
}) => {
    const hasAsterisk = withAsterisk !== undefined ? withAsterisk : Boolean(required);
    const isTextarea = textarea || type === "textarea";

    const defaultClassNames = {
        input: 'dark:!bg-white/5 dark:!border-white/10 dark:!text-white focus:[&:not([data-error]):not([data-invalid]):not([aria-invalid="true"])]:!border-[#85F40F] font-medium transition-colors',
        label: 'dark:!text-white font-medium text-xs mb-1',
        description: 'text-[11px] text-gray-400 dark:text-gray-400 mb-1',
        ...classNames,
    };

    const textareaClassNames = isTextarea
        ? {
              ...defaultClassNames,
              section: `!items-start !pt-2.5 ${classNames?.section || ''}`.trim(),
          }
        : defaultClassNames;

    const textareaLeftSectionProps = isTextarea
        ? {
              style: { alignItems: 'flex-start', paddingTop: '10px' },
              ...rest.leftSectionProps,
          }
        : rest.leftSectionProps;

    if (control) {
        return (
            <div className={containerClassName}>
                <Controller
                    name={name}
                    defaultValue={defaultValue}
                    control={control}
                    render={({ field }) => (
                        isTextarea ? (
                            <Textarea
                                id={rest.id || name}
                                {...field}
                                label={label}
                                placeholder={placeholder}
                                description={description}
                                error={error}
                                required={required}
                                withAsterisk={hasAsterisk}
                                disabled={disabled}
                                readOnly={readOnly}
                                autosize={autosize}
                                minRows={minRows}
                                maxRows={maxRows}
                                leftSection={leftSection}
                                rightSection={rightSection}
                                leftSectionProps={textareaLeftSectionProps}
                                classNames={textareaClassNames}
                                className={className}
                                size={size}
                                radius={radius}
                                {...rest}
                            />
                        ) : (
                            <TextInput
                                id={rest.id || name}
                                {...field}
                                type={type}
                                autoComplete={rest.autoComplete || "off"}
                                label={label}
                                placeholder={placeholder}
                                description={description}
                                error={error}
                                required={required}
                                withAsterisk={hasAsterisk}
                                disabled={disabled}
                                readOnly={readOnly}
                                leftSection={leftSection}
                                rightSection={rightSection}
                                classNames={defaultClassNames}
                                className={className}
                                size={size}
                                radius={radius}
                                {...rest}
                            />
                        )
                    )}
                />
            </div>
        );
    }

    return (
        <div className={containerClassName}>
            {isTextarea ? (
                <Textarea
                    id={rest.id || name}
                    name={name}
                    label={label}
                    placeholder={placeholder}
                    description={description}
                    error={error}
                    required={required}
                    withAsterisk={hasAsterisk}
                    disabled={disabled}
                    readOnly={readOnly}
                    autosize={autosize}
                    minRows={minRows}
                    maxRows={maxRows}
                    leftSection={leftSection}
                    rightSection={rightSection}
                    leftSectionProps={textareaLeftSectionProps}
                    classNames={textareaClassNames}
                    className={className}
                    size={size}
                    radius={radius}
                    {...rest}
                />
            ) : (
                <TextInput
                    id={rest.id || name}
                    name={name}
                    type={type}
                    autoComplete={rest.autoComplete || "off"}
                    label={label}
                    placeholder={placeholder}
                    description={description}
                    error={error}
                    required={required}
                    withAsterisk={hasAsterisk}
                    disabled={disabled}
                    readOnly={readOnly}
                    leftSection={leftSection}
                    rightSection={rightSection}
                    classNames={defaultClassNames}
                    className={className}
                    size={size}
                    radius={radius}
                    {...rest}
                />
            )}
        </div>
    );
};

export default TextInputField;
