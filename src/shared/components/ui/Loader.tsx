import { Loader as MantineLoader } from '@mantine/core';

const Loader = ({ isLoading = true, message }) => {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 dark:bg-[#0c101d]/80 backdrop-blur-xs">
            <MantineLoader size="lg" color="main" type="bars" />
            {message && (
                <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {message}
                </p>
            )}
        </div>
    );
};

export default Loader;
