import React, { useContext, useEffect, useState, useMemo } from 'react';
import ModernAdminHeader from '../Common/AdminHeader';
import { supplierContext } from '../Contexts/SupplierContext';
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Users,
  Calendar,
  PackageSearch,
  Loader2,
  MessageCircle,
  Plus,
  Search,
  X,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SupplierCard = ({ data }) => {
  const initials = data.supplierName
    ?.split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'SP';

  // Sanitize phone number for international WhatsApp link
  const cleanPhone = (data.phoneNumber || '').replace(/\D/g, '');
  const waNumber = cleanPhone.startsWith('0')
    ? `234${cleanPhone.slice(1)}`
    : cleanPhone;

  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D8] p-6 flex flex-col gap-4 shadow-xs hover:border-[#D8CFBF] transition-all text-stone-900">
      
      {/* Card Header: Avatar & Company Identity */}
      <div className="flex items-start gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-[#F5EFE6] border border-[#E5DCCE] text-stone-800 flex items-center justify-center text-sm font-bold flex-shrink-0">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-serif font-bold text-stone-900 text-base truncate leading-snug">
            {data.supplierName}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Building2 size={13} className="text-stone-400 flex-shrink-0" />
            <span className="text-xs text-stone-500 font-medium truncate">
              {data.companyName}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-[#E8E2D8]" />

      {/* Contact Details List */}
      <div className="space-y-2.5 text-xs text-stone-600">
        <a
          href={`mailto:${data.email}`}
          className="flex items-center gap-2.5 hover:text-stone-900 transition-colors group/link"
        >
          <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] flex items-center justify-center flex-shrink-0 border border-[#E8E2D8]">
            <Mail size={13} className="text-stone-600" />
          </div>
          <span className="truncate underline decoration-stone-300 underline-offset-4">
            {data.email}
          </span>
        </a>

        <a
          href={`tel:${data.phoneNumber}`}
          className="flex items-center gap-2.5 hover:text-stone-900 transition-colors group/link"
        >
          <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] flex items-center justify-center flex-shrink-0 border border-[#E8E2D8]">
            <Phone size={13} className="text-stone-600" />
          </div>
          <span className="font-medium text-stone-700">{data.phoneNumber}</span>
        </a>

        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] flex items-center justify-center flex-shrink-0 border border-[#E8E2D8] mt-0.5">
            <MapPin size={13} className="text-stone-600" />
          </div>
          <span className="leading-snug text-stone-500 line-clamp-2">{data.address}</span>
        </div>
      </div>

      {/* Timestamp */}
      <div className="mt-auto pt-3 border-t border-[#E8E2D8] flex items-center justify-between text-[11px] text-stone-400">
        <span className="flex items-center gap-1.5 font-normal">
          <Calendar size={12} className="text-stone-400" />
          Enrolled {new Date(data.createdAt || Date.now()).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      </div>

      {/* WhatsApp Quick CTA */}
      <div className="pt-1">
        <a
          href={`https://wa.me/${waNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-xs text-[#1F5C4A] border border-[#1F5C4A] bg-white hover:bg-[#E3EEE9] transition-colors shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F5C4A]"
        >
          <MessageCircle size={15} />
          <span>Chat on WhatsApp</span>
          <ExternalLink size={12} className="opacity-70" />
        </a>
      </div>
    </div>
  );
};

const Suppliers = () => {
  const { fetchSuppliers, loadSupplier, supplier = [] } = useContext(supplierContext);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filteredSuppliers = useMemo(() => {
    if (!supplier) return [];
    if (!searchQuery.trim()) return supplier;

    const q = searchQuery.toLowerCase().trim();
    return supplier.filter((item) => {
      const name = (item.supplierName || '').toLowerCase();
      const company = (item.companyName || '').toLowerCase();
      const phone = (item.phoneNumber || '').toLowerCase();
      const email = (item.email || '').toLowerCase();
      return name.includes(q) || company.includes(q) || phone.includes(q) || email.includes(q);
    });
  }, [supplier, searchQuery]);

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] text-stone-900 pb-20 selection:bg-stone-200 selection:text-stone-900">
      <ModernAdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 space-y-6">
        
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D8] pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
              Supplier Directory
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 font-normal">
              Manage authorized merchandise vendors, procurement routes, and direct WhatsApp contacts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Supplier Count Badge */}
            {!loadSupplier && supplier?.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 bg-white border border-[#E8E2D8] rounded-xl px-4 py-2 shadow-xs">
                <Users size={15} className="text-stone-500" />
                <span className="text-xs font-bold text-stone-900">{supplier.length}</span>
                <span className="text-xs font-normal text-stone-500">
                  vendor{supplier.length === 1 ? '' : 's'}
                </span>
              </div>
            )}

            {/* Add Supplier Button */}
            <Link
              to="/add/supplier"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1F5C4A] hover:bg-[#174738] active:bg-[#103328] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F5C4A]"
            >
              <Plus size={15} />
              <span>Onboard Supplier</span>
            </Link>
          </div>
        </div>

        {/* Live Filter Bar */}
        <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-[#E8E2D8] shadow-xs">
          <div className="relative flex items-center flex-1">
            <Search className="absolute left-3.5 text-stone-400 pointer-events-none" size={15} />
            <input
              type="text"
              placeholder="Search suppliers by contact name, company, email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2 bg-[#FAF7F2] border border-[#E8E2D8] rounded-lg text-stone-900 text-xs placeholder-stone-400 focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Suppliers Content Area */}
        {loadSupplier ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white rounded-2xl border border-[#E8E2D8] shadow-xs">
            <Loader2 size={28} className="text-stone-500 animate-spin" />
            <p className="text-xs font-medium text-stone-600">Loading supplier network...</p>
          </div>
        ) : filteredSuppliers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredSuppliers.map((item) => (
              <SupplierCard key={item._id} data={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-2xl border border-[#E8E2D8] p-6 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-stone-600">
              <PackageSearch size={28} />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-stone-900">
                {searchQuery ? "No suppliers match your search" : "No suppliers registered yet"}
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                {searchQuery
                  ? "Try clearing your query or searching with a different term."
                  : "Onboard your first product supplier to establish merchandise procurement channels."}
              </p>
            </div>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-stone-700 text-xs font-medium rounded-xl hover:bg-[#F2ECE1] transition-colors cursor-pointer"
              >
                Clear Search Filter
              </button>
            ) : (
              <Link
                to="/add/supplier"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <Plus size={14} />
                Register First Supplier
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Suppliers;