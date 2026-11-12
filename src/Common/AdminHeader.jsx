import { useState, useRef, useEffect, useContext } from 'react';
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Menu,
  ShieldCheck,
  LayoutGrid,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminAuthContext } from '../Contexts/AdminAuthContext';
import { SmallBizLogo } from '../Components/SmallBizLogo';

const ModernAdminHeader = ({ onMenuToggle }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Low stock alert: SKU#8812 - Essential Widget", time: "3m ago", unread: true },
    { id: 2, title: "Daily sales transaction log updated", time: "1h ago", unread: true },
    { id: 3, title: "Supplier catalog synchronized", time: "1d ago", unread: false },
  ]);

  const profileRef = useRef(null);
  const notifyRef = useRef(null);

  const { adminInfo, AdminSignOut } = useContext(adminAuthContext);

  const admin = {
    name: adminInfo?.fullName || "System Administrator",
    email: adminInfo?.email || "admin@smallbiz.com",
    role: adminInfo?.role || "Store Owner / Admin",
    avatar: adminInfo?.profileImage,
    currentOutlet: adminInfo?.companyName || "SmallBiz Store Hub",
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notifyRef.current && !notifyRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowProfileMenu(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const getInitials = (name) => {
    if (!name) return "AD";
    const parts = name.trim().split(' ');
    const initials = parts.map((n) => n[0]).slice(0, 2).join('');
    return initials.toUpperCase() || "AD";
  };

  const initials = getInitials(admin.name);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E8E2D8] px-4 sm:px-8 py-3.5 flex items-center justify-between text-[#1C1917] transition-all">
      
      {/* Left Section: Brand & Outlet Info */}
      <div className="flex items-center gap-3 sm:gap-4">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="p-2 text-[#57534E] hover:text-[#1C1917] hover:bg-[#F2EDE4] rounded-xl lg:hidden transition-colors cursor-pointer border border-[#E8E2D8] focus-visible:outline-2 focus-visible:outline-[#1F5C4A]"
            aria-label="Toggle Dashboard Menu"
          >
            <Menu size={18} />
          </button>
        )}

        {/* Brand Logo */}
        <Link
          to="/admin/dashboard"
          className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F5C4A] rounded-xl"
          aria-label="SmallBiz Admin Dashboard"
        >
          <SmallBizLogo
            variant="compact"
            size="md"
            badge="Admin"
            subtitle="Operations"
          />
        </Link>
      </div>

      {/* Center Section: Quick Search */}
      <div className="hidden lg:flex items-center max-w-md w-full mx-6">
        <div className="relative w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
          <input
            type="text"
            placeholder="Search catalog, SKUs, suppliers..."
            className="w-full pl-9 pr-14 py-2 bg-white border border-[#E8E2D8] rounded-xl text-xs text-[#1C1917] placeholder-[#78716C] outline-none transition-all focus:border-[#1F5C4A] focus:ring-2 focus:ring-[#1F5C4A]/20"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-[#78716C] bg-[#FAF8F5] border border-[#E8E2D8] rounded">Ctrl</kbd>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-[#78716C] bg-[#FAF8F5] border border-[#E8E2D8] rounded">K</kbd>
          </div>
        </div>
      </div>

      {/* Right Section: Notifications & Profile Menu */}
      <div className="flex items-center gap-2.5 sm:gap-3">

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifyRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 text-[#57534E] hover:text-[#1C1917] bg-white hover:bg-[#FAF8F5] border border-[#E8E2D8] hover:border-[#CFC6B8] rounded-xl transition-colors cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-[#1F5C4A]"
            aria-label="View notifications"
          >
            <Bell size={18} className="text-[#57534E]" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#D99A2B]"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-[#E8E2D8] rounded-xl shadow-lg py-2 z-50 text-[#1C1917]">
              <div className="px-4 py-3 border-b border-[#E8E2D8] flex justify-between items-center bg-[#F2EDE4] rounded-t-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#1C1917]">System Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FBF1DC] text-[#1C1917] border border-[#D99A2B]/30">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] font-medium text-[#1F5C4A] hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#E8E2D8]">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 flex items-start gap-3 transition-colors hover:bg-[#FAF8F5] ${
                      item.unread ? 'bg-[#FAF8F5]' : ''
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-[#1F5C4A]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#1C1917] leading-snug">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-[#78716C] mt-0.5 font-normal">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 pt-2.5 border-t border-[#E8E2D8] text-center">
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="w-full text-center py-1 text-xs font-medium text-[#57534E] hover:text-[#1C1917] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 pl-3 pr-2 rounded-full border border-[#E8E2D8] bg-white hover:bg-[#FAF8F5] transition-colors cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-[#1F5C4A]"
          >
            <div className="flex flex-col text-right hidden sm:block leading-tight">
              <span className="text-xs font-semibold text-[#1C1917] block truncate max-w-[130px]">
                {admin.name}
              </span>
              <span className="text-[10px] text-[#78716C] block font-normal">
                Store Owner
              </span>
            </div>

            {/* Avatar */}
            <div className="h-8 w-8 rounded-full overflow-hidden text-white font-bold text-xs flex items-center justify-center bg-[#1F5C4A] shadow-xs">
              {admin.avatar ? (
                <img src={admin.avatar} alt="Admin avatar" className="h-full w-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            <ChevronDown size={14} className="text-[#78716C]" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-64 bg-white border border-[#E8E2D8] rounded-xl shadow-lg py-2 z-50 text-[#1C1917]">
              {/* Account Info Header */}
              <div className="px-4 py-3 border-b border-[#E8E2D8] bg-[#F2EDE4] rounded-t-xl">
                <p className="text-xs font-semibold text-[#1C1917] truncate">{admin.name}</p>
                <p className="text-[11px] text-[#78716C] truncate mt-0.5">{admin.email}</p>
                <div className="mt-2 px-2.5 py-1 inline-flex items-center gap-1.5 text-[10px] font-medium text-[#15803D] bg-[#E6F4EA] rounded-lg border border-[#15803D]/20">
                  <ShieldCheck size={12} className="text-[#15803D]" /> Verified Administrator
                </div>
              </div>

              {/* Navigation Options */}
              <div className="py-1.5">
                <Link
                  to="/admin/dashboard"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-[#57534E] hover:text-[#1C1917] hover:bg-[#FAF8F5] transition-colors"
                >
                  <LayoutGrid size={15} className="text-[#78716C]" />
                  Dashboard Overview
                </Link>
                <Link
                  to="/admin/staff"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-[#57534E] hover:text-[#1C1917] hover:bg-[#FAF8F5] transition-colors"
                >
                  <Users size={15} className="text-[#78716C]" />
                  Staff Team Directory
                </Link>
                <Link
                  to="/my_suppliers"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-[#57534E] hover:text-[#1C1917] hover:bg-[#FAF8F5] transition-colors"
                >
                  <User size={15} className="text-[#78716C]" />
                  Supplier Directory
                </Link>
                <Link
                  to="/post_product"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-[#57534E] hover:text-[#1C1917] hover:bg-[#FAF8F5] transition-colors"
                >
                  <Settings size={15} className="text-[#78716C]" />
                  Add New Product
                </Link>
              </div>

              <div className="border-t border-[#E8E2D8] pt-1.5 mt-1 px-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    AdminSignOut?.();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors text-left cursor-pointer"
                >
                  <LogOut size={15} />
                  Sign Out of Console
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ModernAdminHeader;
