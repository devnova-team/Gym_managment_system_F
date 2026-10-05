import { Paper, Table } from "@mantine/core";
import { useTheme } from "../../Context/ThemeContext";

const TableContainer = ({
    children,
    className = "",
    minWidth = "850px",
    verticalSpacing = "sm",
    highlightOnHover = true,
}) => {
    const { isDarkMode } = useTheme();

    return (
        <Paper
            radius="2xl"
            style={{
                backgroundColor: isDarkMode ? '#0e1517' : '#ffffff',
                borderColor: isDarkMode ? 'rgba(51, 65, 85, 0.8)' : '#e2e8f0',
            }}
            className={`w-full bg-white dark:bg-[#0e1517]! border border-slate-200 dark:border-slate-800 shadow-smoothCard overflow-hidden relative ${className}`}
        >
            <div className="w-full overflow-x-auto scrollbar-thin">
                <Table
                    verticalSpacing={verticalSpacing}
                    highlightOnHover={highlightOnHover}
                    className="w-full"
                    style={{
                        minWidth,
                        '--table-hover-color': isDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)'
                    }}
                >
                    {children}
                </Table>
            </div>
        </Paper>
    );
};

export default TableContainer;
