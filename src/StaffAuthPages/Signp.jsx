import React, { useState, useContext } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ShoppingBag, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { StaffAuthContext } from '../Contexts/StaffAuthContext';

const staffAuthSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Please enter a valid email address").required("Email address is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .required("Password is required"),
});

const StaffRegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { RegisterStaff, loadingRegistration } = useContext(StaffAuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(staffAuthSchema),
    mode: "onTouched",
  });

  const handleErr = (err) => {
    const firstErr = Object.values(err)[0]?.message;
    if (firstErr) {
      toast.error(firstErr);
    }
  };

  const submitData = async (data) => {
    try {
      await RegisterStaff(data);
    } catch (error) {
      console.error(error);
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
          <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-stone-900 flex items-center justify-center shadow-xs mb-3">
            <ShoppingBag size={24} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full bg-[#F5EFE6] border border-[#E5DCCE] text-stone-700 text-xs font-medium tracking-wide">
            Staff Portal Registration
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Create Staff Account
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Register your staff credentials to begin operating POS transactions
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit(submitData, handleErr)} noValidate>
          
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
                  placeholder="e.g. Sarah"
                  autoComplete="given-name"
                  className={`w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border rounded-xl text-stone-900 text-xs placeholder-stone-400 outline-none transition-all ${
                    errors.firstName
                      ? 'border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                      : 'border-[#E8E2D8] focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200'
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
                  placeholder="e.g. Jenkins"
                  autoComplete="family-name"
                  className={`w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border rounded-xl text-stone-900 text-xs placeholder-stone-400 outline-none transition-all ${
                    errors.lastName
                      ? 'border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                      : 'border-[#E8E2D8] focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200'
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

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Work Email Address <span className="text-rose-600">*</span>
            </label>
            <div className="relative flex items-center text-stone-400 focus-within:text-stone-700 transition-colors">
              <div className="absolute left-3.5 pointer-events-none">
                <Mail size={16} strokeWidth={2} />
              </div>
              <input
                type="email"
                placeholder="staff@company.com"
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
            className="w-full py-3 rounded-xl mt-6 flex items-center justify-center gap-2 text-stone-50 text-xs font-semibold tracking-wide transition-colors bg-stone-900 hover:bg-stone-800 shadow-xs active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            disabled={loadingRegistration}
          >
            {loadingRegistration ? (
              <>
                <Loader2 size={15} className="animate-spin text-stone-50" />
                <span>Enrolling Staff Member...</span>
              </>
            ) : (
              "Complete Staff Registration"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-stone-500 mt-6 font-normal">
          Already have an account?{' '}
          <Link
            to="/staff/signin"
            className="text-stone-900 font-semibold hover:underline ml-1"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default StaffRegistrationForm;