import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function RoleCard({
  title,
  subtitle,
  badge,
  description,
  icon: Icon,
  buttonText,
  variant = 'admin',
  signupUrl,
  signinUrl,
  features = [],
}) {
  return (
    <div className="flex flex-col p-7 sm:p-8 rounded-2xl bg-white border border-[#E8E2D8] shadow-xs hover:border-[#D8CFBF] hover:shadow-sm transition-all duration-200">
      {/* Top Header Row with Icon and Badge */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#F5EFE6] text-stone-900 border border-[#E5DCce]">
          <Icon className="w-6 h-6 text-stone-800" strokeWidth={2} />
        </div>

        {badge && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#F5EFE6] text-stone-700 border border-[#E5DCCE]">
            {badge}
          </span>
        )}
      </div>

      {/* Title & Subtitle */}
      <div>
        <h3 className="text-2xl font-serif font-bold tracking-tight text-stone-900 mb-1">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3.5">
            {subtitle}
          </p>
        )}
      </div>

      <p className="text-sm leading-relaxed mb-6 text-stone-600 font-normal">
        {description}
      </p>

      {/* Feature Bullet Highlights */}
      {features.length > 0 && (
        <ul className="space-y-2.5 mb-8">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm font-normal text-stone-700">
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-stone-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Action Footer */}
      <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-[#E8E2D8]">
        <Link
          to={signupUrl}
          className="group/btn flex items-center justify-center w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-stone-900 hover:bg-stone-800 text-stone-50 transition-colors shadow-xs active:scale-[0.99]"
        >
          <span>{buttonText}</span>
          <ArrowRight className="w-4 h-4 ml-2 text-stone-300 transition-transform duration-200 group-hover/btn:translate-x-1" />
        </Link>

        <div className="text-center pt-1">
          <span className="text-xs text-stone-500">
            Already have an account?{' '}
          </span>
          <Link
            to={signinUrl}
            className="text-xs font-semibold text-stone-900 hover:underline decoration-stone-400 underline-offset-2 transition-colors ml-1"
          >
            Sign in &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}