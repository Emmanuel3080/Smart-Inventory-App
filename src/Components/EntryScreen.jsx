import React from 'react';
import { ShieldCheck, ShoppingBag, Sparkles, Activity, Layers } from 'lucide-react';
import { RoleCard } from './Rolecard';

export function EntryScreen() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-stone-200 selection:text-stone-900">
      {/* Top Header */}
      <header className="w-full border-b border-[#E8E2D8] bg-white/95 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-stone-900 flex items-center justify-center text-white shadow-xs">
              <Layers size={18} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-stone-900 text-base tracking-tight leading-none flex items-center gap-2">
                SME
                {/* <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F2EDE4] text-stone-700 border border-[#E0D9CD]">
                  PRO
                </span> */}
              </span>
              <span className="text-[11px] font-medium text-stone-500 tracking-wider uppercase mt-1">
                Retail & Inventory Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#EEF5EE] text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Systems Online
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 md:py-20">
        <div className="max-w-5xl w-full mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full bg-[#F2EDE4] border border-[#E0D9CD] text-stone-700 text-xs font-medium tracking-wide">
              <Sparkles size={13} className="text-stone-600" />
              Minimalist Inventory & POS Terminal
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight text-stone-900 mb-5 leading-[1.15]">
              Thoughtful retail management, <br className="hidden sm:block" />
              <span className="italic font-normal text-stone-700">
                crafted for modern businesses
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Track stock levels accurately, process checkout transactions swiftly, and manage supplier orders with ease. Select your workspace portal below to continue.
            </p>
          </div>

          {/* Role Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-14">
            <RoleCard
              title="Admin Portal"
              subtitle="Management & Strategy"
              badge="Full Executive Control"
              description="Access product catalog controls, supplier management, revenue audits, and system configuration."
              icon={ShieldCheck}
              buttonText="Enter Admin Console"
              variant="admin"
              signupUrl="/admin/signup"
              signinUrl="/admin/signin"
              features={[
                'Product catalog creation, pricing & low-stock alerts',
                'Supplier records & direct WhatsApp communications',
                'Comprehensive sales transactions audit log',
                'Business telemetry & role-based controls',
              ]}
            />

            <RoleCard
              title="Staff Terminal"
              subtitle="Daily Sales & Operations"
              badge="Fast POS Register"
              description="Fast point-of-sale checkout counter, live catalog lookup, quantity verification, and daily sales receipts."
              icon={ShoppingBag}
              buttonText="Open Staff POS Counter"
              variant="staff"
              signupUrl="/staff/signup"
              signinUrl="/staff/signin"
              features={[
                'Instant SKU and product catalog search',
                'Multi-item sales cart & automatic subtotal calculation',
                'Cash, Card, & Bank Transfer payment handling',
                'Instant stock decrement & printable sales receipt',
              ]}
            />
          </div>

          {/* Bottom Security / Trust Notice */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-6 border-t border-[#E8E2D8] text-xs font-medium text-stone-500">
            <span className="flex items-center gap-2">
              <Activity size={15} className="text-stone-700" /> High-Availability Architecture
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-stone-700" /> Secure Token Authentication
            </span>
            <span className="flex items-center gap-2">
              <Layers size={15} className="text-stone-700" /> Multi-Counter Operations Ready
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E2D8] py-6 text-center text-xs text-stone-500 bg-white">
        <p>&copy; {new Date().getFullYear()} SME.OS. Engineered for modern retail and wholesale businesses.</p>
      </footer>
    </div>
  );
}