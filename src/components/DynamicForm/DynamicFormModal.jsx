import { Modal } from "@mantine/core";
import DynamicForm from "./DynamicForm";

const DynamicFormModal = ({
  opened,
  onClose,
  title,
  subtitle,
  fields = [],
  validationSchema,
  onSubmit,
  isLoading = false,
  defaultValues,
  submitText,
  submitIcon,
  cancelText,
  size = "lg",
  icon,
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {icon || (
              <span className="w-2.5 h-2.5 rounded-full bg-[#85F40F] inline-block shadow-[0_0_8px_#85F40F]" />
            )}
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      }
      centered
      size={size}
      radius="lg"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 4,
      }}
      classNames={{
        header:
          "dark:!bg-[#0e1517] border-b dark:!border-slate-800 !px-5 !py-4 shrink-0",
        content:
          "dark:!bg-[#0e1517] border border-slate-200 dark:!border-slate-800 shadow-2xl !rounded-2xl overflow-hidden max-h-[90vh] flex flex-col",
        close: "dark:!text-white dark:hover:!bg-white/10 transition-colors",
        body: "!p-5 overflow-y-auto max-h-[calc(90vh-75px)]",
      }}
    >
      <DynamicForm
        fields={fields}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        isLoading={isLoading}
        defaultValues={defaultValues}
        onCancel={onClose}
        submitText={submitText}
        submitIcon={submitIcon}
        cancelText={cancelText}
      />
    </Modal>
  );
};

export default DynamicFormModal;
