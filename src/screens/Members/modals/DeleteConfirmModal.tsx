import { Modal, Button, Group, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { FiTrash2, FiAlertTriangle } from "react-icons/fi";

const DeleteConfirmModal = ({
  opened,
  onClose,
  onConfirm,
  memberName,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="sm"
      radius="lg"
      closeOnClickOutside={!isLoading}
      closeOnEscape={!isLoading}
      withCloseButton={!isLoading}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 4,
      }}
      classNames={{
        header: "dark:!bg-[#0e1517] border-b dark:!border-slate-800 !px-5 !py-4",
        content:
          "dark:!bg-[#0e1517] border border-slate-200 dark:!border-slate-800 shadow-2xl !rounded-2xl overflow-hidden",
        close:
          "dark:!text-white dark:hover:!bg-white/10 transition-colors",
        body: "!p-5",
      }}
      title={
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-rose-100 dark:bg-rose-950/40">
            <FiAlertTriangle
              size={18}
              className="text-rose-600 dark:text-rose-400"
            />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t("members.deleteConfirmTitle", "Confirm Deletion")}
          </h3>
        </div>
      }
    >
      <Text
        size="sm"
        className="text-slate-600 dark:text-slate-400 mb-5 leading-relaxed"
      >
        {t("members.deleteConfirmMessage", "Are you sure you want to delete")}{" "}
        <span className="font-bold text-slate-900 dark:text-white">
          {memberName}
        </span>
        ?
      </Text>

      <Group justify="flex-end" gap="sm">
        <Button
          variant="default"
          onClick={onClose}
          disabled={isLoading}
          radius="md"
          className="border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-semibold transition-all"
        >
          {t("common.cancel", "Cancel")}
        </Button>

        <Button
          color="red"
          onClick={onConfirm}
          loading={isLoading}
          disabled={isLoading}
          radius="md"
          leftSection={<FiTrash2 size={16} />}
          className="font-bold"
        >
          {t("common.confirmDelete", "Delete")}
        </Button>
      </Group>
    </Modal>
  );
};

export default DeleteConfirmModal;