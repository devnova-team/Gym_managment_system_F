import { Switch } from "@mantine/core";
import { Controller } from "react-hook-form";

const SwitchField = ({
  control,
  name,
  label,
  description,
  leftIcon,
  containerClassName = "",
  color = "lime",
  size = "md",
  ...rest
}) => {
  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div
            className={`p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-white/2 flex items-center justify-between gap-3 ${containerClassName}`}
          >
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                {leftIcon}
                {label}
              </span>
              {description && (
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  {description}
                </span>
              )}
            </div>
            <Switch
              checked={Boolean(field.value)}
              onChange={(e) => field.onChange(e.currentTarget.checked)}
              color={color}
              size={size}
              className="shrink-0"
              {...rest}
            />
          </div>
        )}
      />
    );
  }

  return (
    <div
      className={`p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-white/2 flex items-center justify-between gap-3 ${containerClassName}`}
    >
      <div className="flex flex-col">
        <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
          {leftIcon}
          {label}
        </span>
        {description && (
          <span className="text-[11px] text-gray-500 dark:text-gray-400">
            {description}
          </span>
        )}
      </div>
      <Switch
        name={name}
        color={color}
        size={size}
        className="shrink-0"
        {...rest}
      />
    </div>
  );
};

export default SwitchField;
