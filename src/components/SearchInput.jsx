import { Input } from "@mantine/core";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";

const SearchInput = ({
    id,
    name = "search",
    placeholder = "Search...",
    value,
    onChange,
    onClear,
    className,
    ...rest
}) => {
    return (
        <Input
            id={id || rest.id || name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            rightSectionPointerEvents="all"
            className={`flex items-center justify-center relative ${className}`}
            aria-label={placeholder}
            classNames={{
                input: `py-2! px-10! rounded-xl! w-full! placeholder:text-sm outline-none focus:ring-0 dark:bg-[#0c101d]! dark:text-white! dark:border-slate-800! focus:border-[#85F40F]! dark:placeholder:text-slate-500 border border-slate-200`,
            }}
            rightSection={
                <HiXMark
                    className="text-lg cursor-pointer text-[#85F40F]"
                    aria-label="Clear input"
                    role="button"
                    style={{
                        display: value ? undefined : "none",
                    }}
                    onClick={onClear}
                />
            }
            leftSection={
                <HiMagnifyingGlass className="text-lg text-[#85F40F] font-bold" aria-hidden="true" />
            }
        />
    );
};

export default SearchInput;
