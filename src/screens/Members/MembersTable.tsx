import { useTranslation } from "react-i18next";
import {
  Table,
  Badge,
  Group,
  ActionIcon,
  Tooltip,
  Pagination,
} from "@mantine/core";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const STATUS_COLORS = {
  active: "green",
  expiringSoon: "yellow",
  expired: "red",
  noSubscription: "gray",
};

const ATTENDANCE_COLORS = {
  attended: "green",
  notAttended: "gray",
  unavailable: "yellow",
};

const MembersTable = ({
  members,
  pagination,
  currentPage,
  setCurrentPage,
  onEditClick,
  onDeleteClick,
  canManageMembers,
  canDeleteMembers,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  // Empty state
  if (!members || members.length === 0) {
    return (
      <div className="rounded-2xl bg-white dark:bg-[#0e1517] border border-slate-200 dark:border-slate-800/80 shadow-smoothCard p-12 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("members.empty", "No members found matching your criteria.")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white dark:bg-[#0e1517] border border-slate-200 dark:border-slate-800/80 shadow-smoothCard overflow-hidden">
        <div className="overflow-x-auto">
          <Table
            highlightOnHover
            verticalSpacing="md"
            horizontalSpacing="md"
            className="min-w-full"
          >
            <Table.Thead className="bg-slate-50 dark:bg-[#0c101d]">
              <Table.Tr>
                <Table.Th className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">
                  {t("members.columns.name", "Name")}
                </Table.Th>
                <Table.Th className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">
                  {t("members.columns.phone", "Phone")}
                </Table.Th>
                <Table.Th className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 hidden md:table-cell">
                  {t("members.columns.membershipType", "Membership")}
                </Table.Th>
                <Table.Th className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">
                  {t("members.subscriptionStatus.label", "Subscription status")}
                </Table.Th>
                <Table.Th className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">
                  {t("members.attendanceFilter.label", "Attendance")}
                </Table.Th>
                <Table.Th className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 hidden lg:table-cell">
                  {t("members.columns.createdAt", "Joined")}
                </Table.Th>
                {canManageMembers && (
                  <Table.Th className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 text-end">
                    {t("members.columns.actions", "Actions")}
                  </Table.Th>
                )}
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {members.map((member) => (
                <Table.Tr
                  key={member.id}
                  className="border-t border-slate-100 dark:border-slate-800/60"
                >
                  <Table.Td>
                    <span className="font-semibold text-sm text-slate-800 dark:text-white">
                      {isArabic && member.nameAr ? member.nameAr : member.name}
                    </span>
                  </Table.Td>
                  <Table.Td>
                    <code className="font-mono text-xs text-[#85F40F] bg-[#85F40F]/10 px-2 py-0.5 rounded-md">
                      {member.phone}
                    </code>
                  </Table.Td>
                  <Table.Td className="hidden md:table-cell">
                    <Badge
                      color="blue"
                      variant="light"
                      radius="md"
                      size="sm"
                    >
                      {member.membershipType || "—"}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={STATUS_COLORS[member.subscriptionStatus] || "gray"}
                      variant="light"
                      radius="md"
                      size="sm"
                    >
                      {String(t(
                        `members.subscriptionStatus.${member.subscriptionStatus}`,
                        member.subscriptionStatus,
                      ))}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={ATTENDANCE_COLORS[member.attendanceStatus] || "gray"}
                      variant="light"
                      radius="md"
                      size="sm"
                    >
                      {String(t(
                        `members.attendanceFilter.${member.attendanceStatus}`,
                        member.attendanceStatus,
                      ))}
                    </Badge>
                  </Table.Td>
                  <Table.Td className="hidden lg:table-cell">
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {member.createdAt
                        ? new Date(member.createdAt).toLocaleDateString(
                            isArabic ? "ar-EG" : "en-US",
                          )
                        : "—"}
                    </span>
                  </Table.Td>
                  {canManageMembers && (
                    <Table.Td>
                      <Group gap="xs" justify="flex-end">
                        <Tooltip label={t("common.edit", "Edit")} withArrow>
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => onEditClick(member)}
                          >
                            <FiEdit2 size={16} />
                          </ActionIcon>
                        </Tooltip>
                        {canDeleteMembers && (
                          <Tooltip label={t("common.delete", "Delete")} withArrow>
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              onClick={() => onDeleteClick(member)}
                            >
                              <FiTrash2 size={16} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </Group>
                    </Table.Td>
                  )}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            value={currentPage}
            onChange={setCurrentPage}
            total={pagination.totalPages}
            radius="md"
            classNames={{
              control:
                "data-[active=true]:bg-[#85F40F]! data-[active=true]:text-brand-950! data-[active=true]:border-[#85F40F]!",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MembersTable;