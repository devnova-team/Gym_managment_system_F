import { Select } from "@mantine/core";
import { Controller } from "react-hook-form";

const SelectField = ({
  control,
  name,
  label,
  placeholder,
  description,
  data = [],
  error,
  required = false,
  withAsterisk,
  disabled = false,
  leftSection,
  classNames,
  className = "w-full",
  containerClassName = "",
  size = "sm",
  radius = "md",
  ...rest
}) => {
  const hasAsterisk =
    withAsterisk !== undefined ? withAsterisk : Boolean(required);

  const defaultClassNames = {
    input:
      "dark:!bg-white/5 dark:!border-white/10 dark:!text-white focus:!border-[#85F40F] font-medium transition-colors",
    label: "dark:!text-white font-medium text-xs mb-1",
    description: "text-[11px] text-gray-400 dark:text-gray-400 mb-1",
    dropdown: "dark:!bg-[#0e1517] dark:!border-slate-800",
    option:
      "text-xs font-medium dark:text-gray-200 hover:!bg-[#85F40F]/15 dark:hover:!bg-[#85F40F]/10",
    ...classNames,
  };

  if (control) {
    return (
      <div className={containerClassName}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select
              id={rest.id || name}
              {...field}
              label={label}
              placeholder={placeholder}
              description={description}
              data={data}
              error={error}
              required={required}
              withAsterisk={hasAsterisk}
              disabled={disabled}
              leftSection={leftSection}
              classNames={defaultClassNames}
              className={className}
              size={size}
              radius={radius}
              {...rest}
            />
          )}
        />
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <Select
        id={rest.id || name}
        name={name}
        label={label}
        placeholder={placeholder}
        description={description}
        data={data}
        error={error}
        required={required}
        withAsterisk={hasAsterisk}
        disabled={disabled}
        leftSection={leftSection}
        classNames={defaultClassNames}
        className={className}
        size={size}
        radius={radius}
        {...rest}
      />
    </div>
  );
};

export default SelectField;
