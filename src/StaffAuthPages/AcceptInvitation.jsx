import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShoppingBag,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Building,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SmallBizLogo } from "../Components/SmallBizLogo";

const acceptInvitationSchema = yup.object({
  firstName: yup.string().trim().required("First name is required"),
  lastName: yup.string().trim().required("Last name is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

const AcceptInvitation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const baseUrl = import.meta.env.VITE_API_URL;

  const [verifying, setVerifying] = useState(() => Boolean(token));
  const [verifyError, setVerifyError] = useState(() =>
    token ? null : "No invitation token was provided in the URL."
  );
  const [invitationData, setInvitationData] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(acceptInvitationSchema),
    mode: "onTouched",
  });

  // Verify invitation token on mount if token is present
  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    const verifyToken = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/api/v1/staff/invitations/verify/${encodeURIComponent(token)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (isMounted) {
          if (response.ok && data.status === "success" && data.invitation) {
            setInvitationData(data.invitation);
            setValue("email", data.invitation.email);
          } else {
            setVerifyError(
              data.message ||
                "This invitation token is invalid, expired, or has already been used."
            );
          }
        }
      } catch (err) {
        console.error("Invitation token verification error:", err);
        if (isMounted) {
          setVerifyError(
            "Network error while verifying invitation token. Please check your internet connection."
          );
        }
      } finally {
        if (isMounted) {
          setVerifying(false);
        }
      }
    };

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, [token, baseUrl, setValue]);

  const onSubmit = async (values) => {
    if (!token || !invitationData?.email) {
      toast.error("Invalid invitation state. Please re-open the invitation link.");
      return;
    }

    setSubmitting(true);
    setServerError("");

    const payload = {
      token: token,
      email: invitationData.email,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      password: values.password,
    };

    try {
      const response = await fetch(`${baseUrl}/api/v1/staff/invitations/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (
        response.ok &&
        (data.status === "success" || response.status === 200 || response.status === 201)
      ) {
        toast.success(
          data.message || "Staff account created and linked to admin successfully!"
        );
        // On successful registration, redirect to the existing Staff login page
        navigate("/staff/signin");
      } else {
        const errMessage = data.message || "Failed to complete staff registration.";
        setServerError(errMessage);
        toast.error(errMessage);
      }
    } catch (err) {
      console.error("Invitation acceptance error:", err);
      const networkErr = "Network error. Please try again.";
      setServerError(networkErr);
      toast.error(networkErr);
    } finally {
      setSubmitting(false);
    }
  };

  const handleValidationErrors = (formErrors) => {
    const firstErr = Object.values(formErrors)[0]?.message;
    if (firstErr) {
      toast.error(firstErr);
    }
  };

  const adminName =
    invitationData?.admin?.fullName ||
    invitationData?.admin?.email ||
    "Store Administrator";

  const formattedExpiry = invitationData?.expiresAt
    ? new Date(invitationData.expiresAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 sm:p-8 bg-[#FAF8F5] text-stone-900 selection:bg-stone-200 selection:text-stone-900">
      <div className="relative z-10 w-full max-w-lg bg-white border border-[#E8E2D8] rounded-2xl p-6 sm:p-10 shadow-xs my-8">
        {/* Top Back Link */}
        <div className="mb-5">
          <Link
            to="/entry"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors group"
          >
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to portal selection
          </Link>
        </div>

        {/* State 1: Verifying Invitation Token */}
        {verifying && (
          <div className="flex flex-col items-center text-center py-12 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-stone-900 flex items-center justify-center shadow-xs">
              <Loader2 size={24} className="animate-spin text-stone-700" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Verifying Invitation Link
              </h2>
              <p className="text-xs text-stone-500 mt-1 max-w-sm">
                Authenticating your invitation token with the store server...
              </p>
            </div>
          </div>
        )}

        {/* State 2: Verification Error (Invalid, Expired, Already Used) */}
        {!verifying && verifyError && (
          <div className="flex flex-col items-center text-center py-6 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shadow-xs">
              <XCircle size={28} />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium tracking-wide">
                Invitation Inactive
              </div>
              <h1 className="text-2xl font-serif font-bold text-stone-900">
                Invalid or Expired Invitation
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto pt-1 leading-relaxed">
                {verifyError}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-left text-xs text-stone-600 space-y-1.5 w-full">
              <p className="font-semibold text-stone-800">What happened?</p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-stone-500">
                <li>This invitation link may have already been accepted.</li>
                <li>The invitation may have expired past its validity window.</li>
                <li>The token in the URL may be incomplete or invalid.</li>
              </ul>
              <p className="pt-1 text-[11px] text-stone-600">
                Please contact your store administrator to generate a fresh invitation link.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
              <Link
                to="/staff/signin"
                className="w-full py-2.5 text-center rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-semibold transition-colors shadow-xs"
              >
                Go to Staff Sign In
              </Link>
              <Link
                to="/entry"
                className="w-full py-2.5 text-center rounded-xl border border-[#E8E2D8] bg-white text-stone-700 hover:bg-[#FAF7F2] text-xs font-medium transition-colors"
              >
                Portal Selection
              </Link>
            </div>
          </div>
        )}

        {/* State 3: Valid Invitation & Registration Form */}
        {!verifying && !verifyError && invitationData && (
          <div>
            {/* Header Module */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="mb-4">
                <SmallBizLogo variant="compact" size="lg" badge="Invitation" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full bg-[#EEF5EE] border border-emerald-200 text-emerald-800 text-xs font-medium tracking-wide">
                <ShieldCheck size={13} className="text-emerald-700" />
                Verified Staff Invitation
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
                Accept Staff Invitation
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                You've been invited by{" "}
                <span className="font-semibold text-stone-900">{adminName}</span> to
                join the store team. Complete your credentials below to activate your account.
              </p>
            </div>

            {/* Invitation Details Summary Card */}
            <div className="mb-6 p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-[#E8E2D8]">
                <span className="text-stone-500 font-medium">Inviting Administrator:</span>
                <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                  <Building size={13} className="text-stone-500" />
                  {adminName}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#E8E2D8]">
                <span className="text-stone-500 font-medium">Invited Email:</span>
                <span className="font-mono font-medium text-stone-900">
                  {invitationData.email}
                </span>
              </div>
              {formattedExpiry && (
                <div className="flex items-center justify-between py-1">
                  <span className="text-stone-500 font-medium">Invitation Valid Until:</span>
                  <span className="text-stone-700 font-medium flex items-center gap-1">
                    <Calendar size={13} className="text-stone-500" />
                    {formattedExpiry}
                  </span>
                </div>
              )}
            </div>

            {/* Server Error Alert */}
            {serverError && (
              <div className="mb-5 flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Staff Registration Form */}
            <form
              onSubmit={handleSubmit(onSubmit, handleValidationErrors)}
              className="space-y-4"
              noValidate
            >
              {/* First & Last Name Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    First Name <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative flex items-center text-stone-400 focus-within:text-stone-700 transition-colors">
                    <div className="absolute left-3.5 pointer-events-none">
                      <User size={16} strokeWidth={2} />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Staff"
                      autoComplete="given-name"
                      disabled={submitting}
                      className={`w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border rounded-xl text-stone-900 text-xs placeholder-stone-400 outline-none transition-all ${
                        errors.firstName
                          ? "border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                          : "border-[#E8E2D8] focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
                      }`}
                      {...register("firstName")}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="flex items-center gap-1 text-xs font-medium text-rose-600 mt-1">
                      <AlertCircle size={12} /> {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    Last Name <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative flex items-center text-stone-400 focus-within:text-stone-700 transition-colors">
                    <div className="absolute left-3.5 pointer-events-none">
                      <User size={16} strokeWidth={2} />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Member"
                      autoComplete="family-name"
                      disabled={submitting}
                      className={`w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border rounded-xl text-stone-900 text-xs placeholder-stone-400 outline-none transition-all ${
                        errors.lastName
                          ? "border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                          : "border-[#E8E2D8] focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
                      }`}
                      {...register("lastName")}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="flex items-center gap-1 text-xs font-medium text-rose-600 mt-1">
                      <AlertCircle size={12} /> {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email Address Field (Pre-filled and read-only) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    Invited Email Address
                  </label>
                  <span className="text-[10px] font-medium text-stone-500 bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8E2D8]">
                    Read-only (Locked to Invitation)
                  </span>
                </div>
                <div className="relative flex items-center text-stone-400">
                  <div className="absolute left-3.5 pointer-events-none">
                    <Mail size={16} strokeWidth={2} />
                  </div>
                  <input
                    type="email"
                    readOnly
                    value={invitationData.email}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F2EDE4]/50 border border-[#E8E2D8] rounded-xl text-stone-700 font-medium text-xs outline-none cursor-not-allowed select-none"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Password <span className="text-rose-600">*</span>
                </label>
                <div className="relative flex items-center text-stone-400 focus-within:text-stone-700 transition-colors">
                  <div className="absolute left-3.5 pointer-events-none">
                    <Lock size={16} strokeWidth={2} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a secure password (min 6 characters)"
                    autoComplete="new-password"
                    disabled={submitting}
                    className={`w-full pl-10 pr-10 py-2.5 bg-[#FAF7F2] border rounded-xl text-stone-900 text-xs placeholder-stone-400 outline-none transition-all ${
                      errors.password
                        ? "border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                        : "border-[#E8E2D8] focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
                    }`}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 text-stone-400 hover:text-stone-700 transition-colors focus:outline-none cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="flex items-center gap-1 text-xs font-medium text-rose-600 mt-1">
                    <AlertCircle size={12} /> {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Confirm Password <span className="text-rose-600">*</span>
                </label>
                <div className="relative flex items-center text-stone-400 focus-within:text-stone-700 transition-colors">
                  <div className="absolute left-3.5 pointer-events-none">
                    <Lock size={16} strokeWidth={2} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repeat password to confirm"
                    autoComplete="new-password"
                    disabled={submitting}
                    className={`w-full pl-10 pr-10 py-2.5 bg-[#FAF7F2] border rounded-xl text-stone-900 text-xs placeholder-stone-400 outline-none transition-all ${
                      errors.confirmPassword
                        ? "border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                        : "border-[#E8E2D8] focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
                    }`}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3.5 text-stone-400 hover:text-stone-700 transition-colors focus:outline-none cursor-pointer"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="flex items-center gap-1 text-xs font-medium text-rose-600 mt-1">
                    <AlertCircle size={12} /> {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit CTA (Prevent multiple submissions) */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl mt-6 flex items-center justify-center gap-2 text-white text-xs font-semibold tracking-wide transition-colors bg-[#1F5C4A] hover:bg-[#174738] active:bg-[#103328] shadow-xs active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F5C4A]"
              >
                {submitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin text-stone-50" />
                    <span>Creating & Linking Account...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={15} />
                    <span>Accept Invitation & Create Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Bottom Login Link */}
            <p className="text-center text-xs text-stone-500 mt-6 font-normal">
              Already have an active staff account?{" "}
              <Link
                to="/staff/signin"
                className="text-stone-900 font-semibold hover:underline ml-1"
              >
                Sign in here
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcceptInvitation;
