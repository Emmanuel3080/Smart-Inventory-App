import { useState } from "react";
import Modal from "react-modal";
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  Clock,
  Copy,
  Check,
  X,
  ExternalLink,
  Tag,
  IdCard,
} from "lucide-react";
import { toast } from "sonner";

Modal.setAppElement("#root");

const StaffDetailsModal = ({ isOpen, onClose, staff }) => {
  const [copied, setCopied] = useState(false);

  if (!staff) return null;

  const firstName = staff.firstName || "";
  const lastName = staff.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || staff.fullName || "Staff Member";
  const email = staff.email || "No email provided";
  const role = staff.role || "staff";
  const isActive = staff.isActive !== false;
  const staffId = staff._id || staff.id || "N/A";

  const getInitials = (name) => {
    if (!name) return "ST";
    const parts = name.trim().split(" ");
    return parts
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const initials = getInitials(fullName);

  const formattedCreatedAt = staff.createdAt
    ? new Date(staff.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Not recorded";

  const formattedUpdatedAt = staff.updatedAt
    ? new Date(staff.updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      toast.success("Staff email copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy email");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: "rgba(28, 25, 23, 0.45)",
          zIndex: 1000,
          backdropFilter: "blur(4px)",
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "16px",
          padding: "0",
          width: "92%",
          maxWidth: "520px",
          border: "1px solid #E8E2D8",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 20px 40px rgba(28, 25, 23, 0.12)",
          overflow: "hidden",
        },
      }}
      contentLabel="Staff Profile Details"
    >
      <div className="flex flex-col text-[#1C1917] bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E2D8] bg-[#F2EDE4]">
          <div className="flex items-center gap-2">
            <User size={18} className="text-[#1F5C4A]" />
            <h3 className="font-serif font-bold text-lg text-[#1C1917] leading-tight">
              Staff Member Profile
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#78716C] hover:bg-[#FAF8F5] hover:text-[#1C1917] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Profile Identity Hero */}
        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8]">
            <div className="w-14 h-14 rounded-xl bg-[#1F5C4A] text-white flex items-center justify-center text-lg font-bold flex-shrink-0 shadow-xs">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-serif font-bold text-lg text-[#1C1917] truncate">
                  {fullName}
                </h4>
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
                  {isActive ? "Active Account" : "Inactive"}
                </span>
              </div>
              <p className="text-xs text-[#57534E] font-mono mt-0.5 truncate">
                {email}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-[#E8E2D8] text-[10px] font-medium text-[#1F5C4A]">
                  <Tag size={11} className="text-[#1F5C4A]" />
                  Role: <strong className="capitalize">{role}</strong>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-[#E8E2D8] text-[10px] font-medium text-[#15803D]">
                  <ShieldCheck size={11} className="text-[#15803D]" />
                  Store Verified
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="divide-y divide-[#E8E2D8] border border-[#E8E2D8] rounded-xl bg-white text-xs">
            <div className="flex items-center justify-between p-3.5">
              <span className="text-[#57534E] font-medium flex items-center gap-2">
                <Mail size={14} className="text-[#78716C]" />
                Email Address
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[#1C1917] font-medium">{email}</span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-1 text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
                  title="Copy email"
                >
                  {copied ? (
                    <Check size={13} className="text-[#15803D]" />
                  ) : (
                    <Copy size={13} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5">
              <span className="text-[#57534E] font-medium flex items-center gap-2">
                <Calendar size={14} className="text-[#78716C]" />
                Date Enrolled
              </span>
              <span className="text-[#1C1917] font-medium">{formattedCreatedAt}</span>
            </div>

            {formattedUpdatedAt && (
              <div className="flex items-center justify-between p-3.5">
                <span className="text-[#57534E] font-medium flex items-center gap-2">
                  <Clock size={14} className="text-[#78716C]" />
                  Last Activity / Update
                </span>
                <span className="text-[#1C1917] font-medium">{formattedUpdatedAt}</span>
              </div>
            )}

            <div className="flex items-center justify-between p-3.5">
              <span className="text-[#57534E] font-medium flex items-center gap-2">
                <IdCard size={14} className="text-[#78716C]" />
                Record Reference
              </span>
              <span className="font-mono text-[11px] text-[#57534E] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E8E2D8]">
                {staffId}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2">
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#1F5C4A] hover:bg-[#E3EEE9] text-[#1F5C4A] rounded-xl text-xs font-medium transition-colors shadow-xs focus-visible:outline-2 focus-visible:outline-[#1F5C4A]"
            >
              <Mail size={13} className="text-[#1F5C4A]" />
              <span>Send Email</span>
              <ExternalLink size={11} className="text-[#1F5C4A]" />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-[#1F5C4A] hover:bg-[#174738] active:bg-[#103328] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-[#1F5C4A]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default StaffDetailsModal;
