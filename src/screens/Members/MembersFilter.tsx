import { useTranslation } from "react-i18next";
import { TextInput, Select } from "@mantine/core";
import { FiSearch } from "react-icons/fi";

const MembersFilter = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  planFilter,
  setPlanFilter,
  attendanceFilter,
  setAttendanceFilter,
  planOptions,
  subscriptionsUnavailable,
  attendanceUnavailable,
}) => {
  const { t } = useTranslation();

  const inputClassNames = {
    input:
      "rounded-xl! dark:bg-[#0c101d]! dark:text-white! dark:border-slate-800! focus:border-[#85F40F]!",
  };

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-[#0e1517] border border-slate-200 dark:border-slate-800/80 shadow-smoothCard">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
        <TextInput
          placeholder={t(
            "members.searchPlaceholder",
            "Search by name or phone...",
          )}
          leftSection={<FiSearch size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          className="w-full xl:col-span-2"
          classNames={inputClassNames}
        />

        <Select
          value={statusFilter}
          onChange={(value) => setStatusFilter(value || "all")}
          data={[
            { value: "all", label: t("common.all", "All") },
            { value: "active", label: t("members.subscriptionStatus.active", "Active") },
            { value: "expiringSoon", label: t("members.subscriptionStatus.expiringSoon", "Expiring soon") },
            { value: "expired", label: t("members.subscriptionStatus.expired", "Expired") },
            { value: "noSubscription", label: t("members.subscriptionStatus.noSubscription", "No subscription") },
          ]}
          disabled={subscriptionsUnavailable}
          aria-label={t("members.subscriptionStatus.label", "Subscription status")}
          className="w-full md:w-48"
          classNames={inputClassNames}
        />

        <Select
          value={planFilter}
          onChange={(value) => setPlanFilter(value || "all")}
          data={[{ value: "all", label: t("members.planFilter.all", "All plans") }, ...planOptions]}
          disabled={subscriptionsUnavailable}
          aria-label={t("members.planFilter.label", "Subscription plan")}
          className="w-full md:w-48"
          classNames={inputClassNames}
        />

        <Select
          value={attendanceFilter}
          onChange={(value) => setAttendanceFilter(value || "all")}
          data={[
            { value: "all", label: t("common.all", "All") },
            { value: "attended", label: t("members.attendanceFilter.present", "Currently inside") },
            { value: "notAttended", label: t("members.attendanceFilter.absent", "Not currently inside") },
          ]}
          disabled={attendanceUnavailable}
          aria-label={t("members.attendanceFilter.label", "Current attendance")}
          className="w-full md:w-48"
          classNames={inputClassNames}
        />
      </div>
    </div>
  );
};

export default MembersFilter;
