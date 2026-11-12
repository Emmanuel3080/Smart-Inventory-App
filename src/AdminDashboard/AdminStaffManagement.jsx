import { useEffect, useState, useCallback } from "react";
import ModernAdminHeader from "../Common/AdminHeader";
import InviteStaffModal from "./InviteStaffModal";
import StaffDetailsModal from "./StaffDetailsModal";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  UserPlus,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  Eye,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

const SORT_OPTIONS = [
  { value: "createdAt", label: "Date Added" },
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
  { value: "email", label: "Email Address" },
  { value: "role", label: "Role" },
  { value: "isActive", label: "Account Status" },
  { value: "updatedAt", label: "Last Updated" },
];

const LIMIT_OPTIONS = [5, 10, 20, 50];

const AdminStaffManagement = () => {
  const baseUrl = import.meta.env.VITE_API_URL;

  // Filter, Search, Sort & Pagination State
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'active', 'inactive'
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Data & Status State
  const [staffList, setStaffList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Global Dashboard Statistics
  const [globalStats, setGlobalStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    loaded: false,
  });

  // Modals State
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Debounce search input (400ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
    setPage(1);
  };

  // Main Staff Listing API Effect
  useEffect(() => {
    let isMounted = true;

    const loadStaff = async () => {
      const token = localStorage.getItem("accesToken");
      if (!token) {
        if (isMounted) {
          setErrorMessage("Administrative authentication token not found. Please sign in.");
          setLoading(false);
        }
        return;
      }

      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sortBy: sortBy,
          sortOrder: sortOrder,
        });

        if (debouncedSearch) {
          queryParams.set("search", debouncedSearch);
        }

        if (statusFilter !== "all") {
          queryParams.set("status", statusFilter);
        }

        const response = await fetch(`${baseUrl}/api/v1/staff?${queryParams.toString()}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (isMounted) {
          if (response.ok) {
            const rawList =
              data.staff ||
              data.data ||
              data.staffMembers ||
              data.results ||
              (Array.isArray(data) ? data : []);

            const resolvedTotal =
              data.total ||
              data.pagination?.total ||
              data.count ||
              data.totalStaff ||
              rawList.length;

            const resolvedPages =
              data.totalPages ||
              data.pagination?.totalPages ||
              Math.max(1, Math.ceil(resolvedTotal / limit));

            setStaffList(rawList);
            setTotalCount(resolvedTotal);
            setTotalPages(resolvedPages);
            setErrorMessage("");

            const backendStats = data.stats || data.statistics || data.counts;
            if (
              backendStats &&
              typeof backendStats.active === "number" &&
              typeof backendStats.inactive === "number"
            ) {
              setGlobalStats({
                total: backendStats.total ?? resolvedTotal,
                active: backendStats.active,
                inactive: backendStats.inactive,
                loaded: true,
              });
            }
          } else {
            const err = data.message || data.error || "Failed to load store staff members.";
            setErrorMessage(err);
            setStaffList([]);
          }
        }
      } catch (err) {
        console.error("fetchStaffList network error:", err);
        if (isMounted) {
          setErrorMessage("Network error while communicating with store server.");
          setStaffList([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadStaff();

    return () => {
      isMounted = false;
    };
  }, [baseUrl, page, limit, debouncedSearch, statusFilter, sortBy, sortOrder, refreshTrigger]);

  // Global Statistics API Effect
  useEffect(() => {
    let isMounted = true;

    const loadGlobalStats = async () => {
      const token = localStorage.getItem("accesToken");
      if (!token) return;

      try {
        const totalRes = await fetch(`${baseUrl}/api/v1/staff?page=1&limit=1`, {
          headers: { authorization: `Bearer ${token}` },
        });
        const totalData = await totalRes.json();
        const totalNum =
          totalData.total ||
          totalData.pagination?.total ||
          totalData.count ||
          (Array.isArray(totalData.staff) ? totalData.staff.length : 0);

        const embeddedStats = totalData.stats || totalData.statistics || totalData.counts;
        if (
          embeddedStats &&
          typeof embeddedStats.active === "number" &&
          typeof embeddedStats.inactive === "number"
        ) {
          if (isMounted) {
            setGlobalStats({
              total: embeddedStats.total ?? totalNum,
              active: embeddedStats.active,
              inactive: embeddedStats.inactive,
              loaded: true,
            });
          }
          return;
        }

        const [activeRes, inactiveRes] = await Promise.all([
          fetch(`${baseUrl}/api/v1/staff?page=1&limit=1&status=active`, {
            headers: { authorization: `Bearer ${token}` },
          }),
          fetch(`${baseUrl}/api/v1/staff?page=1&limit=1&status=inactive`, {
            headers: { authorization: `Bearer ${token}` },
          }),
        ]);

        const activeData = await activeRes.json();
        const inactiveData = await inactiveRes.json();

        const activeNum =
          activeData.total ||
          activeData.pagination?.total ||
          activeData.count ||
          (Array.isArray(activeData.staff) ? activeData.staff.length : 0);

        const inactiveNum =
          inactiveData.total ||
          inactiveData.pagination?.total ||
          inactiveData.count ||
          (Array.isArray(inactiveData.staff) ? inactiveData.staff.length : 0);

        if (isMounted) {
          setGlobalStats({
            total: totalNum,
            active: activeNum,
            inactive: inactiveNum,
            loaded: true,
          });
        }
      } catch (err) {
        console.error("Failed to fetch staff statistics:", err);
      }
    };

    loadGlobalStats();

    return () => {
      isMounted = false;
    };
  }, [baseUrl, refreshTrigger]);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setRefreshTrigger((prev) => prev + 1);
    toast.success("Staff directory refreshed");
  }, []);

  const handleOpenDetails = (staffMember) => {
    setSelectedStaff(staffMember);
    setDetailsModalOpen(true);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const getInitials = (firstName, lastName, email) => {
    if (firstName || lastName) {
      return `${(firstName || "").charAt(0)}${(lastName || "").charAt(0)}`.toUpperCase();
    }
    return (email || "ST").slice(0, 2).toUpperCase();
  };

  const startItem = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalCount);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] selection:bg-[#E3EEE9] selection:text-[#1F5C4A] pb-16">
      <ModernAdminHeader />

      <main className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
        {/* Top Header & Action Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-[#E8E2D8] pb-6">
          <div>
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 mb-2.5 rounded-full bg-[#E3EEE9] border border-[#1F5C4A]/20 text-[#1F5C4A] text-xs font-medium tracking-wide">
              <Sparkles size={13} className="text-[#1F5C4A]" />
              Store Personnel Governance
            </div> */}
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1917] tracking-tight">
              Staff Team Management
            </h1>
            <p className="text-xs sm:text-sm text-[#57534E] font-normal mt-1">
              Audit cashiers, monitor POS terminal credentials, and invite new store personnel.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-[#1F5C4A] text-[#1F5C4A] rounded-xl text-xs font-medium hover:bg-[#E3EEE9] transition-colors cursor-pointer disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F5C4A]"
            >
              <RefreshCw
                size={14}
                className={`text-[#1F5C4A] ${loading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>

            {/* Primary Action Button (Rule 2: One primary button per screen in #1F5C4A) */}
            <button
              onClick={() => setInviteModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1F5C4A] hover:bg-[#174738] active:bg-[#103328] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs active:scale-[0.98] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F5C4A]"
            >
              <UserPlus size={15} />
              <span>Invite Staff Member</span>
            </button>
          </div>
        </div>

        {/* Global Statistics Cards (Cards: bg-white, 1px #E8E2D8 border, rounded-xl) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {/* Total Staff */}
          <div className="bg-white border border-[#E8E2D8] p-5 sm:p-6 rounded-xl shadow-xs transition-all hover:border-[#CFC6B8]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-[#78716C]">
                  Total Staff Members
                </p>
                <h3 className="mt-2 text-3xl font-bold tracking-tight text-[#1C1917]">
                  {globalStats.loaded ? globalStats.total : totalCount}
                </h3>
                <p className="mt-1.5 text-xs text-[#78716C] font-normal">
                  Registered across your store
                </p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-[#E3EEE9] border border-[#1F5C4A]/20 text-[#1F5C4A] flex items-center justify-center flex-shrink-0">
                <Users size={20} strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* Active Staff */}
          <div className="bg-white border border-[#E8E2D8] p-5 sm:p-6 rounded-xl shadow-xs transition-all hover:border-[#CFC6B8]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-[#78716C]">
                  Active POS Operators
                </p>
                <h3 className="mt-2 text-3xl font-bold tracking-tight text-[#15803D]">
                  {globalStats.loaded ? globalStats.active : 0}
                </h3>
                <p className="mt-1.5 text-xs text-[#78716C] font-normal">
                  Authorized for checkout counter
                </p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-[#E6F4EA] border border-[#15803D]/20 text-[#15803D] flex items-center justify-center flex-shrink-0">
                <UserCheck size={20} strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* Inactive Staff */}
          <div className="bg-white border border-[#E8E2D8] p-5 sm:p-6 rounded-xl shadow-xs transition-all hover:border-[#CFC6B8]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-[#78716C]">
                  Inactive Accounts
                </p>
                <h3 className="mt-2 text-3xl font-bold tracking-tight text-[#57534E]">
                  {globalStats.loaded ? globalStats.inactive : 0}
                </h3>
                <p className="mt-1.5 text-xs text-[#78716C] font-normal">
                  Deactivated or pending shift
                </p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] text-[#57534E] flex items-center justify-center flex-shrink-0">
                <UserX size={20} strokeWidth={2} />
              </div>
            </div>
          </div>
        </div>

        {/* Filter, Search & Controls Container */}
        <div className="bg-white border border-[#E8E2D8] rounded-xl shadow-xs p-5 sm:p-6 space-y-5">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C] pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search staff by first name, last name, or email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 bg-white border border-[#E8E2D8] rounded-xl text-xs text-[#1C1917] placeholder-[#78716C] outline-none transition-all focus:border-[#1F5C4A] focus:ring-2 focus:ring-[#1F5C4A]/20"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917] p-0.5 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-[#F2EDE4] border border-[#E8E2D8] rounded-xl self-start lg:self-auto">
              <button
                type="button"
                onClick={() => handleStatusChange("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-white text-[#1C1917] shadow-xs border border-[#E8E2D8]"
                    : "text-[#57534E] hover:text-[#1C1917]"
                }`}
              >
                All Status
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange("active")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  statusFilter === "active"
                    ? "bg-white text-[#15803D] shadow-xs border border-[#15803D]/20 font-semibold"
                    : "text-[#57534E] hover:text-[#1C1917]"
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange("inactive")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  statusFilter === "inactive"
                    ? "bg-white text-[#1C1917] shadow-xs border border-[#E8E2D8] font-semibold"
                    : "text-[#57534E] hover:text-[#1C1917]"
                }`}
              >
                Inactive
              </button>
            </div>

            {/* Sorting & Limit Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Sort By Selector */}
              <div className="flex items-center gap-1.5 text-xs text-[#57534E]">
                <span className="text-[11px] uppercase tracking-wider text-[#78716C] font-semibold hidden sm:inline">
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-white border border-[#E8E2D8] rounded-xl text-xs text-[#1C1917] outline-none transition-all focus:border-[#1F5C4A] cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Order Toggle */}
              <button
                type="button"
                onClick={toggleSortOrder}
                className="flex items-center gap-1 px-3 py-2 bg-white border border-[#E8E2D8] hover:border-[#CFC6B8] text-[#57534E] rounded-xl text-xs font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1F5C4A]"
                title={`Sort ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
              >
                {sortOrder === "asc" ? (
                  <>
                    <ArrowUp size={13} className="text-[#1F5C4A]" />
                    <span className="hidden sm:inline">Asc</span>
                  </>
                ) : (
                  <>
                    <ArrowDown size={13} className="text-[#1F5C4A]" />
                    <span className="hidden sm:inline">Desc</span>
                  </>
                )}
              </button>

              {/* Records per page */}
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2.5 py-2 bg-white border border-[#E8E2D8] rounded-xl text-xs text-[#1C1917] outline-none transition-all focus:border-[#1F5C4A] cursor-pointer"
                title="Records per page"
              >
                {LIMIT_OPTIONS.map((lim) => (
                  <option key={lim} value={lim}>
                    {lim} / page
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="flex items-start justify-between gap-3 p-4 rounded-xl bg-[#FEE2E2] border border-[#B91C1C]/20 text-xs text-[#B91C1C]">
              <div className="flex items-start gap-2.5">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                className="font-semibold underline hover:text-[#B91C1C] cursor-pointer flex-shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {/* Table Container (Rule 8: Table headers use #F2EDE4 with #57534E text. Row hover uses #FAF8F5) */}
          <div className="border border-[#E8E2D8] rounded-xl overflow-hidden bg-white">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div className="w-7 h-7 border-2 border-[#1F5C4A] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-medium text-[#57534E]">
                  Loading authorized staff records...
                </span>
              </div>
            ) : staffList.length === 0 ? (
              /* Empty State */
              <div className="text-center py-20 px-6 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#F2EDE4] border border-[#E8E2D8] text-[#78716C] flex items-center justify-center mx-auto">
                  <Users size={22} />
                </div>
                {debouncedSearch || statusFilter !== "all" ? (
                  <>
                    <h3 className="text-base font-serif font-bold text-[#1C1917]">
                      No staff members match current filters
                    </h3>
                    <p className="text-xs text-[#57534E] max-w-sm mx-auto">
                      Try clearing your search query or switching to &ldquo;All Status&rdquo;.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInput("");
                        setDebouncedSearch("");
                        setStatusFilter("all");
                        setPage(1);
                      }}
                      className="mt-2 px-4 py-2 bg-white border border-[#1F5C4A] text-[#1F5C4A] text-xs font-medium rounded-xl hover:bg-[#E3EEE9] transition-colors cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-base font-serif font-bold text-[#1C1917]">
                      No staff members registered yet
                    </h3>
                    <p className="text-xs text-[#57534E] max-w-sm mx-auto">
                      Onboard your first store staff member by generating an invitation link.
                    </p>
                    <button
                      type="button"
                      onClick={() => setInviteModalOpen(true)}
                      className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#1F5C4A] hover:bg-[#174738] active:bg-[#103328] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <UserPlus size={14} />
                      <span>Invite Staff Member</span>
                    </button>
                  </>
                )}
              </div>
            ) : (
              /* Staff Table */
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#F2EDE4] border-b border-[#E8E2D8]">
                    <tr>
                      <th className="px-6 py-3.5 text-[11px] font-semibold text-[#57534E] uppercase tracking-wider">
                        Staff Member
                      </th>
                      <th className="px-6 py-3.5 text-[11px] font-semibold text-[#57534E] uppercase tracking-wider">
                        Email Address
                      </th>
                      <th className="px-6 py-3.5 text-[11px] font-semibold text-[#57534E] uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3.5 text-[11px] font-semibold text-[#57534E] uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3.5 text-[11px] font-semibold text-[#57534E] uppercase tracking-wider">
                        Date Added
                      </th>
                      <th className="px-6 py-3.5 text-[11px] font-semibold text-[#57534E] uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E2D8]">
                    {staffList.map((member) => {
                      const firstName = member.firstName || "";
                      const lastName = member.lastName || "";
                      const memberName =
                        `${firstName} ${lastName}`.trim() ||
                        member.fullName ||
                        "Staff Operator";
                      const email = member.email || "No email";
                      const role = member.role || "staff";
                      const isActive = member.isActive !== false;
                      const initials = getInitials(firstName, lastName, email);

                      const formattedDate = member.createdAt
                        ? new Date(member.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—";

                      return (
                        <tr
                          key={member._id || member.id || email}
                          className="hover:bg-[#FAF8F5] transition-colors"
                        >
                          {/* Name & Avatar */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-[#1F5C4A] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                                {initials}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-semibold text-[#1C1917]">
                                  {memberName}
                                </span>
                                <span className="text-[10px] text-[#78716C] font-mono sm:hidden truncate max-w-[150px]">
                                  {email}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="px-6 py-4 font-mono text-[#57534E]">
                            {email}
                          </td>

                          {/* Role */}
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-medium bg-[#E3EEE9] text-[#1F5C4A] border border-[#1F5C4A]/20 capitalize">
                              {role}
                            </span>
                          </td>

                          {/* Account Status Badge (Rule 4: In stock / active is green, inactive is orange/stone) */}
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                                isActive
                                  ? "bg-[#E6F4EA] text-[#15803D] border-[#15803D]/20"
                                  : "bg-[#FFEDD5] text-[#C2410C] border-[#C2410C]/20"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isActive ? "bg-[#15803D]" : "bg-[#C2410C]"
                                }`}
                              />
                              {isActive ? "Active" : "Inactive"}
                            </span>
                          </td>

                          {/* Date Added */}
                          <td className="px-6 py-4 text-[#57534E] whitespace-nowrap">
                            {formattedDate}
                          </td>

                          {/* Secondary Action: white with #1F5C4A border and #1F5C4A text */}
                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenDetails(member)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#1F5C4A] hover:bg-[#E3EEE9] text-[#1F5C4A] rounded-lg text-xs font-medium transition-colors cursor-pointer shadow-xs active:scale-95 focus-visible:outline-2 focus-visible:outline-[#1F5C4A]"
                            >
                              <Eye size={12} className="text-[#1F5C4A]" />
                              <span>View Profile</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls Footer */}
            {staffList.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-[#E8E2D8] bg-[#F2EDE4]">
                <div className="text-xs text-[#57534E]">
                  Showing <span className="font-semibold text-[#1C1917]">{startItem}</span> to{" "}
                  <span className="font-semibold text-[#1C1917]">{endItem}</span> of{" "}
                  <span className="font-semibold text-[#1C1917]">{totalCount}</span> staff members
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E8E2D8] bg-white text-xs font-medium text-[#57534E] hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[#1F5C4A]"
                  >
                    <ChevronLeft size={14} />
                    <span>Previous</span>
                  </button>

                  <span className="px-2 text-xs font-semibold text-[#1C1917]">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E8E2D8] bg-white text-xs font-medium text-[#57534E] hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[#1F5C4A]"
                  >
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Staff Invitation Modal */}
      <InviteStaffModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onInviteSuccess={handleRefresh}
      />

      {/* Staff Details Modal */}
      <StaffDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedStaff(null);
        }}
        staff={selectedStaff}
      />
    </div>
  );
};

export default AdminStaffManagement;
