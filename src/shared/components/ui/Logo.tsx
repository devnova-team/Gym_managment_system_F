import { useRouter } from 'next/navigation';
import { MdFitnessCenter } from 'react-icons/md';

const Logo = ({ showLabels = true, isSidebarOpen = true }) => {
    const router = useRouter();
    const shouldShowText = showLabels && isSidebarOpen;

    return (
        <div
            className="w-full flex items-center justify-start! gap-3 cursor-pointer py-2 px-1 select-none"
            onClick={() => router.push('/dashboard')}
        >
            <div className="w-11 h-11 shrink-0 rounded-2xl bg-linear-to-br from-[#85F40F] to-[#6CC80A] text-[#0e1517] flex items-center justify-center font-black text-xl shadow-[0_0_22px_rgba(133,244,15,0.45)] transition-all duration-300">
                <MdFitnessCenter size={24} className="text-[#0e1517] transform -rotate-45" />
            </div>
            {shouldShowText && (
                <div className="animate-[fadeIn_0.3s_ease-in] min-w-0 text-start">
                    <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white mb-0 leading-none">
                        Fitness Centre
                    </h1>
                </div>
            )}
        </div>
    );
};

export default Logo;
