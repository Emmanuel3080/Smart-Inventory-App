import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  RefreshCw,
  LogOut,
  ShoppingBag,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { StaffAuthContext } from "../Contexts/StaffAuthContext";
import { SmallBizLogo } from "../Components/SmallBizLogo";

const StaffPending = () => {
  const { staffInfo, isAuthenticated, logout } = useContext(StaffAuthContext);
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  const fullName =
    staffInfo?.firstName && staffInfo?.lastName
      ? `${staffInfo.firstName} ${staffInfo.lastName}`
      : staffInfo?.firstName || "Staff Member";

  const email = staffInfo?.email || "staff@store.com";

  const handleRefreshStatus = async () => {
    setChecking(true);
    try {
      const updatedProfile = await isAuthenticated();
      if (updatedProfile && updatedProfile.adminId) {
        toast.success("Store assignment confirmed! Launching your sales dashboard.");
        navigate("/staff/dashboard");
      } else {
        toast.info(
          "Your account is still pending administrator assignment. Please contact your store owner."
        );
      }
    } catch (err) {
      console.error("Status check failed:", err);
      toast.error("Failed to verify status. Please check your connection.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-stone-200 selection:text-stone-900">
      {/* Top Header */}
      <header className="w-full border-b border-[#E8E2D8] bg-white/95 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <SmallBizLogo
            variant="compact"
            size="md"
            badge="Staff"
            subtitle="Checkout Terminal"
          />

          <button
            onClick={logout}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#E8E2D8] bg-white hover:bg-[#FAF7F2] text-xs font-medium text-stone-700 transition-colors cursor-pointer"
          >
            <LogOut size={13} className="text-stone-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg bg-white border border-[#E8E2D8] rounded-2xl p-7 sm:p-10 shadow-xs space-y-6">
          {/* Header Status Badge */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shadow-xs">
              <Clock size={28} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium tracking-wide">
              <Clock size={12} className="text-amber-700" />
              Unassigned Staff Account
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
              Awaiting Admin Linkage
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              Hello, <strong className="text-stone-900">{fullName}</strong>. Your staff account has been created, but it is not linked to an active store administrator yet.
            </p>
          </div>

          {/* Account Profile Card */}
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-xs space-y-2">
            <div className="flex items-center justify-between py-1 border-b border-[#E8E2D8]">
              <span className="text-stone-500 font-medium">Logged in as:</span>
              <span className="font-semibold text-stone-900">{fullName}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-[#E8E2D8]">
              <span className="text-stone-500 font-medium">Registered Email:</span>
              <span className="font-mono text-stone-800 font-medium">{email}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-stone-500 font-medium">POS Terminal Status:</span>
              <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Pending Store Assignment
              </span>
            </div>
          </div>

          {/* Helpful Information Box */}
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-600 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-stone-900">
              <HelpCircle size={15} className="text-stone-600" />
              How do I get connected?
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              To operate the POS terminal and access inventory products, your store owner/administrator must invite your email or assign your staff profile in their Admin Console.
            </p>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Once your administrator has invited or linked you, click the <strong>Check Assignment Status</strong> button below to activate your POS register without needing to sign in again.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleRefreshStatus}
              disabled={checking}
              className="w-full py-3 rounded-xl flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-semibold transition-colors shadow-xs active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              <RefreshCw
                size={14}
                className={checking ? "animate-spin text-stone-50" : ""}
              />
              <span>{checking ? "Checking Server Assignment..." : "Check Assignment Status"}</span>
            </button>

            <button
              onClick={logout}
              className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 border border-[#E8E2D8] bg-white hover:bg-[#FAF7F2] text-stone-700 text-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut size={13} className="text-stone-500" />
              <span>Sign Out of Terminal</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E2D8] py-4 text-center text-xs text-stone-500 bg-white">
        <p>&copy; {new Date().getFullYear()} SmallBiz. Staff Point of Sale System.</p>
      </footer>
    </div>
  );
};

export default StaffPending;
