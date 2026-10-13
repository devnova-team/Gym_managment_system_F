import { useTranslation } from "react-i18next";
import { TextInput, Select } from "@mantine/core";
import { FiSearch } from "react-icons/fi";

const MembersFilter = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  membershipTypeFilter,
  setMembershipTypeFilter,
}) => {
  const { t } = useTranslation();

  const inputClassNames = {
    input:
      "rounded-xl! dark:bg-[#0c101d]! dark:text-white! dark:border-slate-800! focus:border-[#85F40F]!",
  };

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-[#0e1517] border border-slate-200 dark:border-slate-800/80 shadow-smoothCard">
      <div className="flex flex-col md:flex-row gap-3">
        <TextInput
          placeholder={t(
            "members.searchPlaceholder",
            "Search by name or phone...",
          )}
          leftSection={<FiSearch size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          className="flex-1"
          classNames={inputClassNames}
        />

        <Select
          value={statusFilter}
          onChange={(value) => setStatusFilter(value || "all")}
          data={[
            { value: "all", label: t("members.status.all", "All Statuses") },
            { value: "active", label: t("members.status.active", "Active") },
            { value: "expired", label: t("members.status.expired", "Expired") },
            {
              value: "suspended",
              label: t("members.status.suspended", "Suspended"),
            },
          ]}
          className="w-full md:w-48"
          classNames={inputClassNames}
        />

        <Select
          value={membershipTypeFilter}
          onChange={(value) => setMembershipTypeFilter(value || "all")}
          data={[
            {
              value: "all",
              label: t("members.membershipType.all", "All Types"),
            },
            {
              value: "Monthly",
              label: t("members.membershipType.monthly", "Monthly"),
            },
            {
              value: "Annual",
              label: t("members.membershipType.annual", "Annual"),
            },
          ]}
          className="w-full md:w-48"
          classNames={inputClassNames}
        />
      </div>
    </div>
  );
};

export default MembersFilter;
