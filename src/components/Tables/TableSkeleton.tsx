import { Table, Skeleton } from "@mantine/core";

const TableSkeleton = ({
    colCount = 5,
    rowCount = 5,
}) => {
    return (
        <Table.Tbody>
            {Array.from({ length: rowCount }).map((_, rIdx) => (
                <Table.Tr
                    key={rIdx}
                    className="border-b border-slate-100 dark:border-white/5 animate-pulse"
                >
                    {Array.from({ length: colCount }).map((_, cIdx) => (
                        <Table.Td key={cIdx} className="p-3.5">
                            {cIdx === 0 ? (
                                <div className="flex items-center gap-3">
                                    <Skeleton height={36} circle />
                                    <div className="space-y-1.5 flex-1">
                                        <Skeleton height={12} width="70%" radius="xl" />
                                        <Skeleton height={9} width="45%" radius="xl" />
                                    </div>
                                </div>
                            ) : cIdx === colCount - 1 ? (
                                <div className="flex items-center justify-end gap-2">
                                    <Skeleton height={28} width={28} radius="md" />
                                    <Skeleton height={28} width={55} radius="md" />
                                </div>
                            ) : (
                                <Skeleton height={12} width={`${55 + (cIdx * 15) % 35}%`} radius="xl" />
                            )}
                        </Table.Td>
                    ))}
                </Table.Tr>
            ))}
        </Table.Tbody>
    );
};

export default TableSkeleton;
