import React, { useContext, useEffect, useRef, useState } from "react";
import { StaffAuthContext } from "../Contexts/StaffAuthContext";
import { LogOut, ShieldCheck, ChevronDown, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const StaffHeader = () => {
  const { staffInfo, logout } = useContext(StaffAuthContext);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const firstName = staffInfo?.firstName || "Staff";
  const lastName = staffInfo?.lastName || "Operator";
  const email = staffInfo?.email || "staff@sme.com";
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
    <header className="sticky top-0 z-40 w-full border-b border-[#E8E2D8] bg-white/95 backdrop-blur-md shadow-xs text-stone-900">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Identity & Portal Branding */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/staff"
            className="flex items-center gap-2.5 group focus:outline-none rounded-xl"
            aria-label="SME Staff Portal Home"
          >
            <div className="w-9 h-9 rounded-xl bg-stone-900 flex items-center justify-center text-white shadow-xs">
              <ShoppingBag size={18} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-stone-900 text-base tracking-tight">
                SME.POS
              </span>
              <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wider hidden sm:block">
                Staff Checkout Terminal
              </span>
            </div>
          </Link>

          {/* Active Status Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#FAF7F2] border border-[#E8E2D8] rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span className="text-xs font-medium text-stone-700 tracking-tight">
              Register Active • Till #01
            </span>
          </div>
        </div>

        {/* Right Action Icons & User Account */}
        <div className="flex items-center gap-3">
          
          {/* Account Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2.5 p-1 pl-3 pr-2 border border-[#E8E2D8] bg-white hover:bg-[#FAF7F2] rounded-full transition-colors cursor-pointer shadow-xs"
            >
              <div className="flex flex-col text-right hidden sm:block leading-tight">
                <span className="text-xs font-semibold text-stone-900 block truncate max-w-[130px]">
                  {fullName}
                </span>
                <span className="text-[10px] text-stone-500 block font-normal">
                  Staff Operator
                </span>
              </div>

              {/* Avatar Initials Badge */}
              <div className="h-8 w-8 rounded-full overflow-hidden text-stone-100 font-bold text-xs flex items-center justify-center bg-stone-900 shadow-xs">
                {initials}
              </div>

              <ChevronDown size={14} className="text-stone-500" />
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-64 bg-white border border-[#E8E2D8] rounded-2xl shadow-xl py-2 z-50 text-stone-900">
                {/* Account Summary */}
                <div className="px-4 py-3 border-b border-[#E8E2D8] bg-[#FAF7F2] rounded-t-2xl">
                  <p className="text-xs font-semibold text-stone-900 truncate">{fullName}</p>
                  <p className="text-[11px] text-stone-500 truncate mt-0.5">{email}</p>
                  <div className="mt-2 px-2.5 py-1 inline-flex items-center gap-1.5 text-[10px] font-medium text-stone-700 bg-white rounded-lg border border-[#E8E2D8]">
                    <ShieldCheck size={12} className="text-emerald-700" /> Active Cashier Shift
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    to="/staff"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-[#FAF7F2] hover:text-stone-900 transition-colors"
                  >
                    <ShoppingBag size={15} className="text-stone-500" />
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
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors text-left cursor-pointer"
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