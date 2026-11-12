import { useState } from "react";
import Modal from "react-modal";
import {
  UserPlus,
  Mail,
  Copy,
  Check,
  X,
  Loader2,
  AlertCircle,
  Sparkles,
  Link as LinkIcon,
  Send,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

Modal.setAppElement("#root");

const InviteStaffModal = ({ isOpen, onClose, onInviteSuccess }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [expiresAt, setExpiresAt] = useState(null);
  const [copied, setCopied] = useState(false);
  const [invitedEmail, setInvitedEmail] = useState("");
  const [hasSuccess, setHasSuccess] = useState(false);

  const baseUrl = import.meta.env.VITE_API_URL;

  const resetForm = () => {
    setEmail("");
    setErrorMessage("");
    setGeneratedLink("");
    setExpiresAt(null);
    setCopied(false);
    setInvitedEmail("");
  };

  const handleClose = () => {
    if (hasSuccess && onInviteSuccess) {
      onInviteSuccess();
    }
    setHasSuccess(false);
    resetForm();
    onClose();
  };

  const handleCopy = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      toast.success("Invitation link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Clipboard copy error:", err);
      toast.error("Failed to copy link. Please manually select and copy.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("accesToken");
      const response = await fetch(`${baseUrl}/api/v1/staff/invitations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = await response.json();

      if (
        response.ok &&
        (data.status === "success" ||
          data.invitation ||
          data.token ||
          data.invitationLink)
      ) {
        // Extract token or link from response
        const rawToken =
          data.token ||
          data.invitation?.token ||
          data.invitationToken ||
          (typeof data.invitation === "string" ? data.invitation : null);

        let finalLink = "";
        if (rawToken) {
          finalLink = `${window.location.origin}/staff/accept-invitation?token=${rawToken}`;
        } else if (data.invitationLink) {
          try {
            const parsedUrl = new URL(data.invitationLink, window.location.origin);
            const tokenParam = parsedUrl.searchParams.get("token");
            if (tokenParam) {
              finalLink = `${window.location.origin}/staff/accept-invitation?token=${tokenParam}`;
            } else {
              finalLink = data.invitationLink;
            }
          } catch {
            finalLink = `${window.location.origin}/staff/accept-invitation?token=${data.invitationLink}`;
          }
        } else if (data.invitation?._id) {
          finalLink = `${window.location.origin}/staff/accept-invitation?token=${data.invitation._id}`;
        } else {
          finalLink = `${window.location.origin}/staff/accept-invitation?token=${data.id || "invitation"}`;
        }

        const expiry = data.expiresAt || data.invitation?.expiresAt || null;
        setExpiresAt(expiry);

        setGeneratedLink(finalLink);
        setInvitedEmail(normalizedEmail);
        setHasSuccess(true);
        toast.success(
          data.message || "Staff invitation link generated successfully!"
        );

        if (onInviteSuccess) {
          onInviteSuccess();
        }
      } else {
        const err =
          data.message || data.error || "Failed to create staff invitation.";
        setErrorMessage(err);
        toast.error(err);
      }
    } catch (err) {
      console.error("Staff invite network error:", err);
      const networkErr = "Network error. Unable to reach invitation service.";
      setErrorMessage(networkErr);
      toast.error(networkErr);
    } finally {
      setLoading(false);
    }
  };

  const formattedExpiry = expiresAt
    ? new Date(expiresAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
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
          maxWidth: "540px",
          border: "1px solid #E8E2D8",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 20px 40px rgba(28, 25, 23, 0.12)",
          overflow: "hidden",
        },
      }}
      contentLabel="Invite Staff Member Modal"
    >
      <div className="flex flex-col text-[#1C1917] bg-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E2D8] bg-[#F2EDE4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1F5C4A] flex items-center justify-center text-white shadow-xs">
              <UserPlus size={19} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1C1917] leading-tight">
                Invite Staff Member
              </h3>
              <p className="text-xs text-[#57534E] mt-0.5">
                Generate an invitation link to onboard staff to your store
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#78716C] hover:bg-[#FAF8F5] hover:text-[#1C1917] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Information Notice */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#E3EEE9] border border-[#1F5C4A]/20 text-xs text-[#1F5C4A]">
            <Sparkles size={16} className="text-[#1F5C4A] flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Staff members invited through this portal will be linked exclusively to your store's inventory and sales registers upon registration.
            </p>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FEE2E2] border border-[#B91C1C]/20 text-xs text-[#B91C1C]">
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Generated Link Display (Success State) */}
          {generatedLink ? (
            <div className="space-y-4 pt-1">
              <div className="p-4 rounded-xl bg-[#E6F4EA] border border-[#15803D]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#15803D] flex items-center gap-1.5">
                    <Check size={14} className="text-[#15803D]" />
                    Invitation Link Ready
                  </span>
                  <span className="text-[11px] text-[#57534E] truncate max-w-[200px]">
                    Invited: <strong className="text-[#1C1917]">{invitedEmail}</strong>
                  </span>
                </div>

                {/* Link Box */}
                <div className="flex items-center gap-2 p-2.5 bg-white border border-[#E8E2D8] rounded-xl">
                  <LinkIcon size={14} className="text-[#78716C] flex-shrink-0 ml-1" />
                  <input
                    type="text"
                    readOnly
                    value={generatedLink}
                    className="w-full text-xs font-mono text-[#1C1917] bg-transparent outline-none select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1F5C4A] hover:bg-[#174738] active:bg-[#103328] text-white rounded-lg text-xs font-medium transition-colors flex-shrink-0 cursor-pointer shadow-xs active:scale-95 focus-visible:outline-2 focus-visible:outline-[#1F5C4A]"
                  >
                    {copied ? (
                      <>
                        <Check size={13} className="text-white" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Expiry Date Display */}
                {formattedExpiry && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#15803D] pt-0.5">
                    <Calendar size={13} className="text-[#15803D]" />
                    <span>
                      Invitation expires on:{" "}
                      <strong className="font-semibold">{formattedExpiry}</strong>
                    </span>
                  </div>
                )}

                <p className="text-[11px] text-[#57534E] leading-normal">
                  Share this secure single-use link with the staff member so they can complete their registration and access the checkout register.
                </p>
              </div>

              {/* Reset to invite another */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1F5C4A] hover:bg-[#E3EEE9] text-[#1F5C4A] rounded-xl text-xs font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1F5C4A]"
                >
                  <RefreshCw size={13} className="text-[#1F5C4A]" />
                  Invite Another Staff Member
                </button>
              </div>
            </div>
          ) : (
            /* Invite Email Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1C1917] uppercase tracking-wider">
                  Staff Email Address <span className="text-[#B91C1C]">*</span>
                </label>
                <div className="relative flex items-center text-[#78716C] focus-within:text-[#1F5C4A] transition-colors">
                  <div className="absolute left-3.5 pointer-events-none">
                    <Mail size={16} strokeWidth={2} />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="e.g. staffmember@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8E2D8] rounded-xl text-[#1C1917] text-xs placeholder-[#78716C] outline-none transition-all focus:border-[#1F5C4A] focus:ring-2 focus:ring-[#1F5C4A]/20 disabled:opacity-60"
                  />
                </div>
                <p className="text-[11px] text-[#78716C] font-normal mt-1">
                  We'll generate a verification link specifically tied to this email address.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E8E2D8]">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl border border-[#E8E2D8] bg-white text-[#57534E] text-xs font-medium hover:bg-[#FAF8F5] transition-colors cursor-pointer disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-[#1F5C4A]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#1F5C4A] hover:bg-[#174738] active:bg-[#103328] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1F5C4A]"
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-white" />
                      <span>Generating Invitation...</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>Generate Invitation Link</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default InviteStaffModal;
