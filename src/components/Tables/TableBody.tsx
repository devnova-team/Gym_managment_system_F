import { Table } from "@mantine/core";
import TableEmptyState from "./TableEmptyState";

const TableBody = ({
    data = [],
    renderRow,
    colSpan = 1,
    emptyMessage = "No Data Found",
    emptyDescription = "There are no records matching your current filter or query.",
    emptyIcon,
    emptyActionLabel,
    onEmptyAction,
}) => {
    return (
        <Table.Tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {data && data.length > 0 ? (
                data.map((item, index) => renderRow(item, index))
            ) : (
                <Table.Tr>
                    <Table.Td colSpan={colSpan} className="p-0">
                        <TableEmptyState
                            title={emptyMessage}
                            description={emptyDescription}
                            icon={emptyIcon}
                            actionLabel={emptyActionLabel}
                            onAction={onEmptyAction}
                        />
                    </Table.Td>
                </Table.Tr>
            )}
        </Table.Tbody>
    );
};

export default TableBody;
