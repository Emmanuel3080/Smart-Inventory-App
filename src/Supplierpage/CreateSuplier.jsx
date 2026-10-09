import React, { useContext } from 'react';
import ModernAdminHeader from '../Common/AdminHeader';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Building2, User, Mail, Phone, MapPin, Save, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supplierContext } from '../Contexts/SupplierContext';

const supplierValidationSchema = Yup.object({
  supplierName: Yup.string().required('Contact person / supplier name is required'),
  email: Yup.string().email('Please enter a valid email address').required("Work email is required"),
  phoneNumber: Yup.string().min(10, 'Phone number must have at least 10 digits').required('Phone number is required'),
  address: Yup.string().required("Physical business address is required"),
  companyName: Yup.string().required("Company or vendor name is required"),
});

const CreateSupplier = () => {
  const { createSupplierProfile, loadingCreateSupplier } = useContext(supplierContext);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(supplierValidationSchema),
    mode: "onTouched",
  });

  const submitData = async (data) => {
    await createSupplierProfile(data);
  };

  const handleErr = (err) => {
    const firstErr = Object.values(err)[0]?.message;
    if (firstErr) {
      toast.error(firstErr);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] text-stone-900 pb-20 selection:bg-stone-200 selection:text-stone-900">
      <ModernAdminHeader />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            to="/my_suppliers"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 transition-colors group px-3.5 py-1.5 rounded-xl bg-white border border-[#E8E2D8] hover:border-stone-400 shadow-xs"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1 text-stone-500" />
            Back to Supplier Directory
          </Link>
        </div>

        {/* Page Header */}
        <div className="border-b border-[#E8E2D8] pb-4">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Onboard New Supplier
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-normal">
            Register vendor company information, contact representative, and direct communication channels.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6 sm:p-9 shadow-xs">
          <form onSubmit={handleSubmit(submitData, handleErr)} className="space-y-5" noValidate>
            
            {/* Company Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Company / Vendor Name <span className="text-rose-600">*</span>
              </label>
              <div className="relative flex items-center text-stone-400 focus-within:text-stone-700 transition-colors">
                <div className="absolute left-3.5 pointer-events-none">
                  <Building2 size={16} />
                </div>
                <input
                  {...register("companyName")}
                  type="text"
                  placeholder="e.g. Apex Global Distributors Ltd."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs text-stone-900 placeholder-stone-400 outline-none transition-all ${
                    errors.companyName
                      ? 'border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                      : 'border-[#E8E2D8] bg-[#FAF7F2] focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200'
                  }`}
                />
              </div>
              {errors.companyName && (
                <p className="flex items-center gap-1 text-[11px] font-medium text-rose-600 mt-1">
                  <AlertCircle size={11} /> {errors.companyName.message}
                </p>
              )}
            </div>

            {/* Representative Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Contact Person / Representative <span className="text-rose-600">*</span>
              </label>
              <div className="relative flex items-center text-stone-400 focus-within:text-stone-700 transition-colors">
                <div className="absolute left-3.5 pointer-events-none">
                  <User size={16} />
                </div>
                <input
                  {...register("supplierName")}
                  type="text"
                  placeholder="e.g. Marcus Sterling"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs text-stone-900 placeholder-stone-400 outline-none transition-all ${
                    errors.supplierName
                      ? 'border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                      : 'border-[#E8E2D8] bg-[#FAF7F2] focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200'
                  }`}
                />
              </div>
              {errors.supplierName && (
                <p className="flex items-center gap-1 text-[11px] font-medium text-rose-600 mt-1">
                  <AlertCircle size={11} /> {errors.supplierName.message}
                </p>
              )}
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Work Email <span className="text-rose-600">*</span>
                </label>
                <div className="relative flex items-center text-stone-400 focus-within:text-stone-700 transition-colors">
                  <div className="absolute left-3.5 pointer-events-none">
                    <Mail size={16} />
                  </div>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="orders@apexdistributors.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs text-stone-900 placeholder-stone-400 outline-none transition-all ${
                      errors.email
                        ? 'border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                        : 'border-[#E8E2D8] bg-[#FAF7F2] focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="flex items-center gap-1 text-[11px] font-medium text-rose-600 mt-1">
                    <AlertCircle size={11} /> {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Phone / WhatsApp Number <span className="text-rose-600">*</span>
                </label>
                <div className="relative flex items-center text-stone-400 focus-within:text-stone-700 transition-colors">
                  <div className="absolute left-3.5 pointer-events-none">
                    <Phone size={16} />
                  </div>
                  <input
                    {...register("phoneNumber")}
                    type="tel"
                    placeholder="e.g. +234 801 234 5678"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs text-stone-900 placeholder-stone-400 outline-none transition-all ${
                      errors.phoneNumber
                        ? 'border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                        : 'border-[#E8E2D8] bg-[#FAF7F2] focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200'
                    }`}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="flex items-center gap-1 text-[11px] font-medium text-rose-600 mt-1">
                    <AlertCircle size={11} /> {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>

            {/* Physical Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Warehouse / Office Address <span className="text-rose-600">*</span>
              </label>
              <div className="relative flex items-center text-stone-400 focus-within:text-stone-700 transition-colors">
                <div className="absolute left-3.5 pointer-events-none">
                  <MapPin size={16} />
                </div>
                <input
                  {...register("address")}
                  type="text"
                  placeholder="e.g. Plot 14 Commercial Avenue, Ikeja, Lagos"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs text-stone-900 placeholder-stone-400 outline-none transition-all ${
                    errors.address
                      ? 'border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                      : 'border-[#E8E2D8] bg-[#FAF7F2] focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200'
                  }`}
                />
              </div>
              {errors.address && (
                <p className="flex items-center gap-1 text-[11px] font-medium text-rose-600 mt-1">
                  <AlertCircle size={11} /> {errors.address.message}
                </p>
              )}
            </div>

            {/* Actions Footer */}
            <div className="pt-4 border-t border-[#E8E2D8] flex items-center justify-end gap-3">
              <Link
                to="/my_suppliers"
                className="px-5 py-2.5 rounded-xl border border-[#E8E2D8] text-stone-700 text-xs font-medium hover:bg-[#FAF7F2] transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loadingCreateSupplier}
                className="flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-xl text-xs font-semibold transition-colors shadow-xs active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {loadingCreateSupplier ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Onboarding Supplier...</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save Supplier Profile</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSupplier;