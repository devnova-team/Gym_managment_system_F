import React, { forwardRef } from "react";
import { Table } from "@mantine/core";

const TableHeader = forwardRef(({ headers = [], className = "" }, ref) => {
    return (
        <Table.Thead ref={ref} className="bg-slate-50/80 dark:bg-white/3">
            <Table.Tr className="border-b border-slate-200 dark:border-white/10">
                {headers?.map((head, index) => {
                    const isObj = typeof head === "object" && head !== null;
                    const label = isObj ? head.label : head;
                    const align = isObj && head.align ? head.align : "start";
                    const alignClass =
                        align === "center"
                            ? "text-center!"
                            : align === "end" || align === "right"
                            ? "text-end!"
                            : "text-start!";

                    return (
                        <Table.Th
                            key={index}
                            className={`p-3.5 min-w-20 ${alignClass} text-slate-800 dark:text-white font-bold text-xs uppercase tracking-wider ${className} ${
                                isObj && head.className ? head.className : ""
                            }`}
                            style={{
                                ...(isObj && head.width ? { width: head.width } : {}),
                                textAlign: align === "end" || align === "right" ? "end" : align === "center" ? "center" : "start"
                            }}
                        >
                            {label}
                        </Table.Th>
                    );
                })}
            </Table.Tr>
        </Table.Thead>
    );
});

TableHeader.displayName = "TableHeader";

export default TableHeader;
