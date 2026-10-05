import { Modal, Button, Text } from '@mantine/core';
import { RiAlertLine, RiDeleteBinLine, RiQuestionLine } from 'react-icons/ri';

export const COLOR_CONFIGS = {
    red: {
        icon: RiDeleteBinLine,
        boxBg: 'bg-rose-500/10 border-rose-500/20',
        textColor: 'text-rose-600 dark:text-rose-400',
        buttonBg: 'bg-rose-600! hover:bg-rose-700!',
        iconColor: 'text-rose-600 dark:text-rose-400'
    },
    amber: {
        icon: RiAlertLine,
        boxBg: 'bg-amber-500/10 border-amber-500/20',
        textColor: 'text-amber-600 dark:text-amber-400',
        buttonBg: 'bg-amber-600! hover:bg-amber-700!',
        iconColor: 'text-amber-600 dark:text-amber-400'
    },
    blue: {
        icon: RiQuestionLine,
        boxBg: 'bg-blue-500/10 border-blue-500/20',
        textColor: 'text-blue-600 dark:text-blue-400',
        buttonBg: 'bg-blue-600! hover:bg-blue-700!',
        iconColor: 'text-blue-600 dark:text-blue-400'
    }
};

export function ConfirmModal({
    opened,
    close,
    title,
    description,
    handleConfirm,
    actionText = 'Confirm',
    cancelText = 'Cancel',
    isLoading = false,
    color = 'red',
    confirmDisabled = false,
    withCloseButton = false
}) {
    const config = COLOR_CONFIGS[color?.toLowerCase()] || COLOR_CONFIGS.red;
    const IconComp = config.icon;

    return (
        <Modal
            opened={opened}
            onClose={close}
            centered
            size="md"
            title={title}
            withCloseButton={withCloseButton}
            closeButtonProps={{ disabled: isLoading }}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            classNames={{
                content: 'bg-white! dark:bg-[#0e1517]! border border-slate-200 dark:border-white/10! rounded-2xl! shadow-2xl p-5',
                header: 'bg-transparent! p-0! mb-4! min-h-0! text-slate-900 dark:text-white',
                title: 'text-lg! font-black! text-slate-900 dark:text-white',
                close: 'text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg',
                body: 'p-0!',
            }}
        >
            <div className="space-y-4">
                <div className={`flex items-start gap-3 p-3.5 rounded-xl border ${config.boxBg}`}>
                    <div className="shrink-0 mt-0.5">
                        <IconComp size={20} className={config.iconColor} />
                    </div>
                    <Text className={`text-xs! font-medium! leading-relaxed! ${config.textColor}`}>
                        {description}
                    </Text>
                </div>

                <div className="flex items-center gap-3 pt-1 justify-end">
                    <Button
                        variant="default"
                        size="md"
                        radius="xs"
                        className="min-w-26 font-bold border-slate-200! dark:border-white/10! bg-white! dark:bg-white/5! text-slate-600! dark:text-white! hover:bg-slate-50! dark:hover:bg-white/10! transition-all rounded-xl!"
                        disabled={isLoading}
                        onClick={close}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        size="md"
                        radius="xs"
                        onClick={handleConfirm}
                        disabled={confirmDisabled || isLoading}
                        loading={isLoading}
                        className={`min-w-26 font-black shadow-sm transition-all rounded-xl! ${config.buttonBg}`}
                    >
                        {actionText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default ConfirmModal;
