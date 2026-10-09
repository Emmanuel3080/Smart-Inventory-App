import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  Settings,
  MapPin,
  Menu,
  ShieldCheck,
  LayoutGrid,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminAuthContext } from '../Contexts/AdminAuthContext';

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
    email: adminInfo?.email || "admin@sme.com",
    role: adminInfo?.role || "Store Owner / Admin",
    avatar: adminInfo?.profileImage,
    currentOutlet: adminInfo?.companyName || "SME Retail Hub",
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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E8E2D8] px-4 sm:px-8 py-3.5 flex items-center justify-between text-stone-900 transition-all">
      
      {/* Left Section: Brand & Outlet Info */}
      <div className="flex items-center gap-3 sm:gap-4">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="p-2 text-stone-700 hover:text-stone-900 hover:bg-[#F5EFE6] rounded-xl lg:hidden transition-colors cursor-pointer border border-[#E8E2D8]"
            aria-label="Toggle Dashboard Menu"
          >
            <Menu size={18} />
          </button>
        )}

        {/* Brand Logo */}
        <Link to="/admin" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-stone-900 flex items-center justify-center text-white shadow-xs">
            <LayoutGrid size={18} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-stone-900 text-base tracking-tight flex items-center gap-1.5">
              SME.OS
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#F2EDE4] text-stone-700 border border-[#E0D9CD]">
                PRO
              </span>
            </span>
            <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wider hidden sm:block">
              Admin Console
            </span>
          </div>
        </Link>

        {/* Active Outlet Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#FAF7F2] border border-[#E8E2D8] rounded-full">
          <MapPin size={13} className="text-stone-600 flex-shrink-0" />
          <span className="text-xs font-medium text-stone-700 tracking-tight truncate max-w-[170px]">
            {admin.currentOutlet}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
        </div>
      </div>

      {/* Center Section: Quick Search */}
      <div className="hidden lg:flex items-center max-w-md w-full mx-6">
        <div className="relative w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search catalog, SKUs, suppliers..."
            className="w-full pl-9 pr-14 py-2 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl text-xs text-stone-900 placeholder-stone-400 outline-none transition-all focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-stone-500 bg-white border border-[#E0D9CD] rounded">Ctrl</kbd>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-stone-500 bg-white border border-[#E0D9CD] rounded">K</kbd>
          </div>
        </div>
      </div>

      {/* Right Section: Notifications & Profile Menu */}
      <div className="flex items-center gap-2.5 sm:gap-3">

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifyRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 text-stone-700 hover:text-stone-900 bg-white hover:bg-[#FAF7F2] border border-[#E8E2D8] hover:border-stone-400 rounded-xl transition-colors cursor-pointer shadow-xs"
            aria-label="View notifications"
          >
            <Bell size={18} className="text-stone-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-600"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-[#E8E2D8] rounded-2xl shadow-xl py-2 z-50 text-stone-900">
              <div className="px-4 py-3 border-b border-[#E8E2D8] flex justify-between items-center bg-[#FAF7F2] rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-stone-900">System Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F5EFE6] text-stone-800 border border-[#E5DCCE]">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#F2ECE1]">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 flex items-start gap-3 transition-colors hover:bg-[#FAF7F2] ${
                      item.unread ? 'bg-[#FAF7F2]/60' : ''
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-stone-700" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-stone-800 leading-snug">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-stone-400 mt-0.5 font-normal">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 pt-2.5 border-t border-[#E8E2D8] text-center">
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="w-full text-center py-1 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
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
            className="flex items-center gap-2.5 p-1 pl-3 pr-2 rounded-full border border-[#E8E2D8] bg-white hover:bg-[#FAF7F2] transition-colors cursor-pointer shadow-xs"
          >
            <div className="flex flex-col text-right hidden sm:block leading-tight">
              <span className="text-xs font-semibold text-stone-900 block truncate max-w-[130px]">
                {admin.name}
              </span>
              <span className="text-[10px] text-stone-500 block font-normal">
                Store Owner
              </span>
            </div>

            {/* Avatar */}
            <div className="h-8 w-8 rounded-full overflow-hidden text-stone-100 font-bold text-xs flex items-center justify-center bg-stone-900 shadow-xs">
              {admin.avatar ? (
                <img src={admin.avatar} alt="Admin avatar" className="h-full w-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            <ChevronDown size={14} className="text-stone-500" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-64 bg-white border border-[#E8E2D8] rounded-2xl shadow-xl py-2 z-50 text-stone-900">
              {/* Account Info Header */}
              <div className="px-4 py-3 border-b border-[#E8E2D8] bg-[#FAF7F2] rounded-t-2xl">
                <p className="text-xs font-semibold text-stone-900 truncate">{admin.name}</p>
                <p className="text-[11px] text-stone-500 truncate mt-0.5">{admin.email}</p>
                <div className="mt-2 px-2.5 py-1 inline-flex items-center gap-1.5 text-[10px] font-medium text-stone-700 bg-white rounded-lg border border-[#E8E2D8]">
                  <ShieldCheck size={12} className="text-emerald-700" /> Verified Administrator
                </div>
              </div>

              {/* Navigation Options */}
              <div className="py-1.5">
                <Link
                  to="/admin"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-[#FAF7F2] transition-colors"
                >
                  <LayoutGrid size={15} className="text-stone-500" />
                  Dashboard Overview
                </Link>
                <Link
                  to="/my_suppliers"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-[#FAF7F2] transition-colors"
                >
                  <User size={15} className="text-stone-500" />
                  Supplier Directory
                </Link>
                <Link
                  to="/post_product"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-[#FAF7F2] transition-colors"
                >
                  <Settings size={15} className="text-stone-500" />
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
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors text-left cursor-pointer"
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