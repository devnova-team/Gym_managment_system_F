import { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate, useParams, Outlet, useLocation } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { IoIosArrowBack } from "react-icons/io";
import { HiOutlineXMark } from "react-icons/hi2";
import {
  RiMegaphoneLine,
  RiShieldUserLine,
  RiWallet3Line,
  RiStore2Line,
  RiNotification3Line,
  RiUserStarLine,
} from "react-icons/ri";
import { FiActivity, FiCalendar, FiUsers } from "react-icons/fi";
import { MdOutlineFitnessCenter } from "react-icons/md";
import SharedTabs from "../Menu/SharedTabs";
import Logo from "../components/Logo.jsx";
import NavBar from "../Header/NavBar";
import DashboardFooter from "../components/DashboardFooter";
import { AuthContext } from "../AuthContext/AuthProvider";

const TAB_VALUES_TEMPLATE = [
  {
    id: 1,
    value: "overview",
    icon: <FiActivity size={20} />,
    labelKey: "nav.dashboard",
  },
  {
    id: 2,
    value: "members",
    icon: <RiUserStarLine size={20} />,
    labelKey: "nav.members",
  },
  {
    id: 3,
    value: "attendance",
    icon: <FiUsers size={20} />,
    labelKey: "nav.attendance",
  },
  {
    id: 4,
    value: "communication",
    icon: <RiMegaphoneLine size={20} />,
    labelKey: "nav.communication",
  },
  {
    id: 5,
    value: "staff",
    icon: <RiShieldUserLine size={20} />,
    labelKey: "nav.staff",
  },
  {
    id: 6,
    value: "expenses",
    icon: <RiWallet3Line size={20} />,
    labelKey: "nav.expenses",
    ownerOnly: true,
  },
  {
    id: 7,
    value: "reports",
    icon: <FiCalendar size={20} />,
    labelKey: "nav.reports",
    ownerOnly: true,
  },
  {
    id: 8,
    value: "store",
    icon: <RiStore2Line size={20} />,
    labelKey: "nav.store",
    ownerOnly: true,
  },
  {
    id: 9,
    value: "equipment",
    icon: <MdOutlineFitnessCenter size={20} />,
    labelKey: "nav.equipment",
    ownerOnly: true,
  },
  {
    id: 10,
    value: "reminders",
    icon: <RiNotification3Line size={20} />,
    labelKey: "nav.reminders",
    ownerOnly: true,
  },
];

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const { tabValue } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isOwner } = useContext(AuthContext);

  // Filter tabs by role and memoize translated labels
  const tabValues = useMemo(() => {
    return TAB_VALUES_TEMPLATE.filter((tab) => !tab.ownerOnly || isOwner).map(
      (tab) => ({
        ...tab,
        label: t(tab.labelKey, tab.value),
      }),
    );
  }, [t, isOwner]);

  const currentTab = useMemo(
    () => tabValue || pathname.split("/").pop() || "overview",
    [tabValue, pathname],
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const isSmallScreen = useMediaQuery("(max-width: 1200px)");
  const isMobileScreen = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (isMobileScreen || isSmallScreen) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobileScreen, isSmallScreen]);

  return (
    <div className="h-screen w-full overflow-hidden bg-bg-light dark:bg-[#0c101d] text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Mobile backdrop */}
      {isMobileScreen && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Application Frame */}
      <div className="w-full flex h-full overflow-hidden">
        {/* Sidebar */}
        {(!isMobileScreen || (isMobileScreen && isSidebarOpen)) && (
          <div
            data-sidebar="true"
            className={`
                            ${
                              isMobileScreen
                                ? `fixed inset-y-0 ${isRTL ? "right-0" : "left-0"} w-65 z-40`
                                : isSidebarOpen
                                  ? "w-[18%] min-w-64 relative"
                                  : "w-[5.5%] min-w-18 relative"
                            } 
                            bg-white dark:bg-[#0e1517] border-r border-slate-200 dark:border-slate-800/80
                            text-slate-800 dark:text-white px-3 py-4 flex flex-col justify-start items-start h-full
                            transition-all duration-300 ease-in-out shadow-xs dark:shadow-xl z-20
                        `}
          >
            {/* Mobile close button */}
            {isMobileScreen && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className={`
                                    absolute top-4 ${isRTL ? "left-4" : "right-4"}
                                    text-slate-700 hover:text-slate-900 dark:text-white dark:hover:text-gray-200 transition-colors
                                    p-1 cursor-pointer z-50
                                `}
                aria-label="Close Sidebar"
              >
                <HiOutlineXMark size={26} />
              </button>
            )}

            {/* Desktop collapse toggle button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`
                                absolute top-1/2 transform -translate-y-1/2 z-30
                                ${isRTL ? "-left-3.5" : "-right-3.5"}
                                bg-white hover:bg-slate-50 dark:bg-[#0e1517] dark:hover:bg-[#151f22] text-brand-800 dark:text-[#85F40F] rounded-full p-1.5 cursor-pointer shadow-md
                                hidden md:flex items-center justify-center border border-slate-200 dark:border-slate-800
                                transition-all duration-200
                            `}
              aria-label="Toggle Sidebar width"
            >
              <IoIosArrowBack
                size={18}
                className={`transition-transform duration-300 ${
                  isRTL
                    ? isSidebarOpen
                      ? "rotate-180"
                      : "rotate-0"
                    : isSidebarOpen
                      ? "rotate-0"
                      : "rotate-180"
                }`}
              />
            </button>

            {/* Brand Logo */}
            <Logo
              showLabels={isSidebarOpen || isMobileScreen}
              isSidebarOpen={isSidebarOpen || isMobileScreen}
            />

            {/* Shared Navigation Menu */}
            <SharedTabs
              tabValue={currentTab}
              onChange={(value) => {
                setSearchQuery("");
                navigate(`/dashboard/${value}`);
                if (isMobileScreen) setIsSidebarOpen(false);
              }}
              tabValues={tabValues}
              orientation="vertical"
              defaultValue={"overview"}
              showLabels={isSidebarOpen || isMobileScreen}
            />
          </div>
        )}

        {/* Right Area: Header Navbar + Dynamic Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <NavBar
            setIsSidebarOpen={setIsSidebarOpen}
            isSidebarOpen={isSidebarOpen}
          />

          {/* Scrollable View Content */}
          <main
            data-panel="true"
            className="flex-1 w-full overflow-y-auto max-lg:no-scrollbar bg-slate-50 dark:bg-[#0c101d] p-4 md:p-6 lg:p-8 transition-colors flex flex-col justify-between"
          >
            <div className="flex-1 w-full">
              <Outlet
                context={{
                  setIsSidebarOpen,
                  isSidebarOpen,
                  isMobileScreen,
                  searchQuery,
                  setSearchQuery,
                }}
              />
            </div>
            <DashboardFooter />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
