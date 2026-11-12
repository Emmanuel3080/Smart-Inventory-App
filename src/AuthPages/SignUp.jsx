import React, { useState, useContext, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Upload, Shield, ArrowLeft, Loader2, AlertCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { adminAuthContext } from '../Contexts/AdminAuthContext';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { SmallBizLogo } from '../Components/SmallBizLogo';

const adminAuthSchema = yup.object({
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email("Please enter a valid email address").required("Email address is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .required("Password is required"),
});

const AdminRegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(null);

  const { loadingRegistration, AdminSignUp } = useContext(adminAuthContext);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(adminAuthSchema),
    mode: "onTouched",
  });

  const profileImageFile = watch("profileImage");

  useEffect(() => {
    if (profileImageFile && profileImageFile.length > 0) {
      const file = profileImageFile[0];
      const url = URL.createObjectURL(file);
      setPreview(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [profileImageFile]);

  const removeAvatar = () => {
    setPreview(null);
    setValue("profileImage", null);
  };

  const handleErr = (err) => {
    const firstErr = Object.values(err)[0]?.message;
    if (firstErr) {
      toast.error(firstErr);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 sm:p-8 bg-[#FAF8F5] text-stone-900 selection:bg-stone-200 selection:text-stone-900">
      {/* Main Card */}
      <div className="relative z-10 w-full max-w-lg bg-white border border-[#E8E2D8] rounded-2xl p-6 sm:p-10 shadow-xs my-8">
        
        {/* Top Back Link */}
        <div className="mb-5">
          <Link
            to="/entry"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors group"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            Back to portal selection
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-7">
          {/* <div className="mb-4">
            <SmallBizLogo variant="compact" size="lg" badge="Admin" />
          </div> */}

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Register Administrator
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-sm">
            Create an administrator profile to govern SmallBiz inventory & staff
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit(AdminSignUp, handleErr)} noValidate>
          
          {/* Profile Photo Uploader */}
          <div className="flex flex-col items-center justify-center space-y-2 py-2">
            <div className="relative group">
              <div className="h-20 w-20 rounded-full border-2 border-[#E8E2D8] overflow-hidden bg-[#FAF7F2] flex items-center justify-center transition-all">
                {preview ? (
                  <img src={preview} alt="Avatar Preview" className="h-full w-full object-cover" />
                ) : (
                  <User className="text-stone-400" size={32} strokeWidth={1.5} />
                )}
              </div>

              {preview ? (
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="absolute -top-1 -right-1 h-6 w-6 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-xs hover:bg-rose-700 transition-colors cursor-pointer"
                  title="Remove picture"
                >
                  <X size={12} />
                </button>
              ) : (
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 h-7 w-7 bg-stone-900 hover:bg-stone-800 text-white rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                  title="Upload profile picture"
                >
                  <Upload size={12} />
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    {...register("profileImage")}
                  />
                </label>
              )}
            </div>

            <div className="text-center">
              <p className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Profile Photo <span className="text-stone-400 font-normal lowercase">(optional)</span>
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                PNG, JPG or WEBP • Up to 5MB
              </p>
            </div>
          </div>

          {/* Full Name Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Full Name <span className="text-rose-600">*</span>
            </label>
            <div className="relative flex items-center text-stone-400 focus-within:text-stone-700 transition-colors">
              <div className="absolute left-3.5 pointer-events-none">
                <User size={16} strokeWidth={2} />
              </div>
              <input
                type="text"
                placeholder="e.g. Alexander Vance"
                autoComplete="name"
                className={`w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border rounded-xl text-stone-900 text-xs placeholder-stone-400 outline-none transition-all ${
                  errors.fullName
                    ? 'border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                    : 'border-[#E8E2D8] focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200'
                }`}
                {...register("fullName")}
              />
            </div>
            {errors.fullName && (
              <p className="flex items-center gap-1 text-xs font-medium text-rose-600 mt-1">
                <AlertCircle size={12} /> {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email Address Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Email Address <span className="text-rose-600">*</span>
            </label>
            <div className="relative flex items-center text-stone-400 focus-within:text-stone-700 transition-colors">
              <div className="absolute left-3.5 pointer-events-none">
                <Mail size={16} strokeWidth={2} />
              </div>
              <input
                type="email"
                placeholder="admin@company.com"
                autoComplete="email"
                className={`w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border rounded-xl text-stone-900 text-xs placeholder-stone-400 outline-none transition-all ${
                  errors.email
                    ? 'border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                    : 'border-[#E8E2D8] focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200'
                }`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="flex items-center gap-1 text-xs font-medium text-rose-600 mt-1">
                <AlertCircle size={12} /> {errors.email.message}
              </p>
            )}
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
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters with lowercase letter"
                autoComplete="new-password"
                className={`w-full pl-10 pr-10 py-2.5 bg-[#FAF7F2] border rounded-xl text-stone-900 text-xs placeholder-stone-400 outline-none transition-all ${
                  errors.password
                    ? 'border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                    : 'border-[#E8E2D8] focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200'
                }`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 text-stone-400 hover:text-stone-700 transition-colors focus:outline-none cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl mt-6 flex items-center justify-center gap-2 text-white text-xs font-semibold tracking-wide transition-colors bg-[#1F5C4A] hover:bg-[#174738] active:bg-[#103328] shadow-xs active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F5C4A]"
            disabled={loadingRegistration}
          >
            {loadingRegistration ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Creating Administrator Profile...</span>
              </>
            ) : (
              "Complete Admin Registration"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-stone-500 mt-6 font-normal">
          Already have an account?{' '}
          <Link
            to="/admin/signin"
            className="text-stone-900 font-semibold hover:underline ml-1"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminRegistrationForm;