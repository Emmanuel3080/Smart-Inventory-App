import React from 'react';
import {
  Package,
  BellRing,
  Truck,
  ReceiptText,
  Users,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SmallBizLogo } from './SmallBizLogo';

const OWNER_SIGNIN_URL = '/admin/signin';
const OWNER_SIGNUP_URL = '/admin/signup';
const STAFF_SIGNIN_URL = '/staff/signin';

/*
  SmallBiz Design System
  Background  #FAF8F5   Surface  #FFFFFF   Border  #E8E2D8
  Heading     #1C1917   Body     #57534E   Muted   #78716C
  Primary     #1F5C4A   Hover    #174738   Tint    #E3EEE9
  Accent      #D99A2B
  Dark panel  #123D31   Text on dark #FFFFFF / #B9CEC5
*/

const features = [
  {
    icon: Package,
    title: 'Products & Live Stock',
    text: 'Add items, track quantities in real time, and keep your catalog organized.',
  },
  {
    icon: BellRing,
    title: 'Low-Stock Alerts',
    text: 'Spot depletion points and reorder before customer demand stalls.',
  },
  {
    icon: Users,
    title: 'Staff & Team Delegation',
    text: 'Invite team members, assign POS shifts, and audit checkout operations.',
  },
  {
    icon: ReceiptText,
    title: 'Sales & Daily Revenue',
    text: 'Review checkout records, cashier metrics, and gross store revenue.',
  },
];

export function EntryScreen() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1917] selection:bg-[#D99A2B]/30">
      {/* Header */}
      <header className="w-full border-b border-[#E8E2D8] bg-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link
            to="/entry"
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F5C4A] rounded-xl"
            aria-label="SmallBiz Home"
          >
            <SmallBizLogo
              variant="full"
              size="md"
              subtitle="Inventory & Business Management"
            />
          </Link>

          {/* <div className="flex items-center gap-3">
            <Link
              to={STAFF_SIGNIN_URL}
              className="text-xs font-semibold text-[#57534E] hover:text-[#1C1917] px-3 py-2 rounded-lg hover:bg-[#FAF8F5] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F5C4A]"
            >
              Staff Portal
            </Link>
            <Link
              to={OWNER_SIGNIN_URL}
              className="text-xs font-semibold text-[#1F5C4A] hover:text-[#174738] px-3.5 py-2 rounded-lg border border-[#1F5C4A] bg-white hover:bg-[#E3EEE9] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F5C4A]"
            >
              Owner Sign In
            </Link>
          </div> */}
        </div>
      </header>

      {/* Main Hero & Value Proposition */}
      <main className="flex-grow flex items-center px-6 py-10 md:py-16">
        <div className="max-w-6xl w-full mx-auto grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Message + Actions */}
          <section className="lg:col-span-6">
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-[#E3EEE9] border border-[#1F5C4A]/20 text-[#1F5C4A] text-xs font-semibold tracking-wide">
              <ShieldCheck size={14} />
              Inventory &amp; Business Management
            </div> */}

            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.12] text-[#1C1917]">
              Run your business. <br className="hidden sm:inline" />
              Know your stock.
            </h1>

            <p className="mt-5 text-lg text-[#57534E] leading-relaxed max-w-md">
              A simpler way for growing businesses to manage inventory, staff,
              sales and daily operations.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to={OWNER_SIGNUP_URL}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F5C4A] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#174738] active:bg-[#103328] transition-colors shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F5C4A]"
              >
                Create your account
                <ArrowRight size={16} />
              </Link>
              <Link
                to={OWNER_SIGNIN_URL}
                className="inline-flex items-center justify-center rounded-xl border border-[#1F5C4A] bg-white px-6 py-3.5 text-sm font-semibold text-[#1F5C4A] hover:bg-[#E3EEE9] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F5C4A]"
              >
                Sign in to store
              </Link>
            </div>

            {/* <p className="mt-4 text-xs text-[#78716C] flex items-center gap-1.5">
              <span>Invited as a staff member?</span>
              <Link
                to={STAFF_SIGNIN_URL}
                className="text-[#1F5C4A] font-semibold hover:underline"
              >
                Sign in to Staff Register &rarr;
              </Link>
            </p> */}
          </section>

          {/* Right: What You Can Do */}
          <section
            className="lg:col-span-6 rounded-2xl bg-[#123D31] p-4 sm:p-6 shadow-sm border border-[#1F5C4A]"
            aria-label="SmallBiz Core Capabilities"
          >
            <div className="mb-4 px-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#D99A2B]">
                Core Platform Features
              </span>
              <h2 className="text-xl font-semibold text-white mt-1">
                Everything you need to govern your store
              </h2>
            </div>

            <ul className="divide-y divide-white/10">
              {features.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-start gap-4 px-2 py-4">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D99A2B] text-[#1C1917] shadow-xs">
                    <Icon size={20} />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-white">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#B9CEC5]">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      {/* Simple Clean Footer */}
      {/* <footer className="w-full border-t border-[#E8E2D8] bg-white py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#78716C]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1C1917]">SmallBiz</span>
            <span>&bull;</span>
            <span>Run your business. Know your stock.</span>
          </div>
          <p>&copy; {new Date().getFullYear()} SmallBiz. All rights reserved.</p>
        </div>
      </footer> */}
    </div>
  );
}

export default EntryScreen;
