import { useContext, useEffect, useRef, useState } from "react";
import { StaffAuthContext } from "../Contexts/StaffAuthContext";
import { LogOut, ShieldCheck, ChevronDown, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { SmallBizLogo } from "../Components/SmallBizLogo";

const StaffHeader = () => {
  const { staffInfo, logout } = useContext(StaffAuthContext);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const firstName = staffInfo?.firstName || "Staff";
  const lastName = staffInfo?.lastName || "Operator";
  const email = staffInfo?.email || "staff@smallbiz.com";
  const fullName = `${firstName} ${lastName}`;
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  // Close the menu on outside click or Escape key
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E8E2D8] bg-white/95 backdrop-blur-md shadow-xs text-[#1C1917]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Identity & Portal Branding */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/staff/dashboard"
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F5C4A] rounded-xl"
            aria-label="SmallBiz Staff Portal Home"
          >
            <SmallBizLogo
              variant="compact"
              size="md"
              badge="Staff POS"
              subtitle="Checkout Terminal"
            />
          </Link>
        </div>

        {/* Right Action Icons & User Account */}
        <div className="flex items-center gap-3">
          
          {/* Account Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2.5 p-1 pl-3 pr-2 border border-[#E8E2D8] bg-white hover:bg-[#FAF8F5] rounded-full transition-colors cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F5C4A]"
            >
              <div className="flex flex-col text-right hidden sm:block leading-tight">
                <span className="text-xs font-semibold text-[#1C1917] block truncate max-w-[130px]">
                  {fullName}
                </span>
                <span className="text-[10px] text-[#78716C] block font-normal">
                  Staff Operator
                </span>
              </div>

              {/* Avatar Initials Badge */}
              <div className="h-8 w-8 rounded-full overflow-hidden text-white font-bold text-xs flex items-center justify-center bg-[#1F5C4A] shadow-xs">
                {initials}
              </div>

              <ChevronDown size={14} className="text-[#78716C]" />
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-64 bg-white border border-[#E8E2D8] rounded-xl shadow-lg py-2 z-50 text-[#1C1917]">
                {/* Account Summary */}
                <div className="px-4 py-3 border-b border-[#E8E2D8] bg-[#F2EDE4] rounded-t-xl">
                  <p className="text-xs font-semibold text-[#1C1917] truncate">{fullName}</p>
                  <p className="text-[11px] text-[#78716C] truncate mt-0.5">{email}</p>
                  <div className="mt-2 px-2.5 py-1 inline-flex items-center gap-1.5 text-[10px] font-medium text-[#15803D] bg-[#E6F4EA] rounded-lg border border-[#15803D]/20">
                    <ShieldCheck size={12} className="text-[#15803D]" /> Active Cashier Shift
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    to="/staff/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#57534E] hover:bg-[#FAF8F5] hover:text-[#1C1917] transition-colors"
                  >
                    <ShoppingBag size={15} className="text-[#78716C]" />
                    POS Counter & Inventory
                  </Link>
                </div>

                <div className="border-t border-[#E8E2D8] pt-1 mt-1 px-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      logout?.();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors text-left cursor-pointer"
                  >
                    <LogOut size={15} />
                    Sign Out Terminal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default StaffHeader;
