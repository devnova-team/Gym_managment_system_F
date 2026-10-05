import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiHome, FiShieldOff } from "react-icons/fi";

const Unauthorized = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#0c101d]">
      <div className="w-full max-w-md bg-white dark:bg-[#0e1517] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-8 text-center shadow-smoothCard">
        {/* Icon */}
        <div className="inline-flex p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 mb-4">
          <FiShieldOff size={32} />
        </div>

        {/* Page Title */}
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2">
          {t("auth.unauthorizedTitle", "Access Denied")}
        </h1>

        {/* Subtitle */}
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-6">
          {t(
            "auth.unauthorizedMessage",
            "You don't have permission to access this page. Please contact your administrator if you believe this is a mistake."
          )}
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 bg-btn-gradient text-brand-950 font-bold px-4 py-2.5 rounded-xl mx-auto"
        >
          <FiHome size={18} />
          <span>{t("auth.backToDashboard", "Back to Dashboard")}</span>
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;