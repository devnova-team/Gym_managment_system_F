import { Table } from "@mantine/core";
import PaginationComp from "../Pagination";

const TableFooter = ({
    activePage,
    page,
    setPage,
    total,
    totalPages,
    colSpan = 1,
    size = "sm",
    totalItems,
    itemName = "records",
    scrollRef,
    targetRef
}) => {
    const currentPage = activePage || page || 1;
    const finalTotal = totalPages || total || 1;

    if (!finalTotal || finalTotal <= 0) return null;

    return (
        <Table.Tfoot>
            <Table.Tr className="border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/2">
                <Table.Td colSpan={colSpan} className="py-2.5! px-3">
                    <div className="flex items-center justify-center w-full">
                        <PaginationComp
                            activePage={currentPage}
                            totalPages={finalTotal}
                            onPageChange={setPage}
                            size={size}
                            className="py-0!"
                            scrollRef={scrollRef || targetRef}
                        />
                    </div>
                </Table.Td>
            </Table.Tr>
        </Table.Tfoot>
    );
};

export default TableFooter;