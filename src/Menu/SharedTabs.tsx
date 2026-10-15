import React, { memo } from "react";
import { Tabs } from "@mantine/core";

const SharedTabs = memo(({
    tabValue,
    onChange,
    tabValues,
    orientation = "vertical",
    defaultValue,
    variant = "pills",
    showLabels = true,
}) => {
    return (
        <div className="h-full w-full mt-6 flex-1 overflow-y-auto overflow-x-hidden p-1">
            <Tabs
                value={tabValue}
                onChange={onChange}
                orientation={orientation}
                defaultValue={defaultValue}
                variant={variant}
                className="w-full"
            >
                <Tabs.List className={`w-full flex! ${orientation === "horizontal" ? "flex-row! overflow-x-auto!" : "flex-col!"} ${!showLabels ? "items-center!" : "items-stretch!"} gap-1.5! before:hidden! border-none!`}>
                    {tabValues?.map((tab) => {
                        const isActive = tabValue === tab?.value;
                        return (
                            <Tabs.Tab
                                key={tab?.id}
                                value={tab?.value}
                                aria-label={tab?.label}
                                className={`flex! justify-start! items-center! 
                                    ${!showLabels ? "min-w-11! w-11! px-2.5! py-2.5!" : "w-full! px-3.5! py-3!"}  
                                    rounded-2xl! transition-all! duration-200! cursor-pointer! font-medium! text-sm! 
                                    ${isActive
                                        ? "bg-[#85F40F]/15! dark:bg-linear-to-r! dark:from-brand-800/85! dark:to-[#132D00]/95! text-brand-800! dark:text-[#85F40F]! border! border-[#85F40F]/50! dark:border-[#85F40F]/25! shadow-xs! dark:shadow-[0_0_15px_rgba(39,80,1,0.5)]!"
                                        : "text-slate-600! hover:bg-slate-100! hover:text-slate-900! dark:text-slate-400! dark:hover:bg-white/5! dark:hover:text-white! border! border-transparent!"
                                    }`}
                            >
                                <div className={`w-full gap-3.5 flex ${!showLabels ? "justify-center" : "justify-start"} items-center min-w-0`}>
                                    <span className={`text-xl shrink-0 flex items-center justify-center transition-colors ${isActive ? "text-brand-800 dark:text-[#85F40F]" : "text-slate-500 dark:text-slate-400"}`}>
                                        {tab?.icon}
                                    </span>
                                    {showLabels && (
                                        <span className={`truncate text-start text-xs md:text-sm leading-tight flex-1 ${isActive ? "font-bold text-brand-800 dark:text-[#85F40F]" : "font-medium text-slate-700 dark:text-slate-300"}`}>
                                            {tab?.label}
                                        </span>
                                    )}
                                </div>
                            </Tabs.Tab>
                        );
                    })}
                </Tabs.List>
            </Tabs>
        </div>
    );
});

export default SharedTabs;
