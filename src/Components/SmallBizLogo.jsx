import React from 'react';

/**
 * SmallBiz Logo Component
 * Modern, clean, scalable brand asset supporting light & dark contexts,
 * icon-only, compact wordmark, and full branding with category / tagline.
 *
 * @param {'full' | 'compact' | 'icon'} variant - Layout format
 * @param {'sm' | 'md' | 'lg' | 'xl'} size - Dimension scaling
 * @param {'light' | 'dark'} theme - Colorway for light vs dark backgrounds
 * @param {string} [badge] - Optional pill label (e.g., 'Admin', 'Staff POS', 'PRO')
 * @param {string} [subtitle] - Optional subline (e.g., 'Inventory & Business Management')
 * @param {string} [className] - Additional wrapper class
 */
export const SmallBizIcon = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-11 h-11 rounded-xl',
    xl: 'w-14 h-14 rounded-2xl',
  };

  const svgSizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 30,
  };

  const px = svgSizeMap[size] || 20;

  return (
    <div
      className={`relative flex items-center justify-center bg-[#1F5C4A] shadow-xs shrink-0 ${sizeMap[size] || sizeMap.md} ${className}`}
      aria-hidden="true"
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Foundation Inventory Shelf / Base Layer */}
        <path
          d="M3 17.5C3 16.6716 3.67157 16 4.5 16H19.5C20.3284 16 21 16.6716 21 17.5C21 18.3284 20.3284 19 19.5 19H4.5C3.67157 19 3 18.3284 3 17.5Z"
          fill="#FFFFFF"
          fillOpacity="0.9"
        />
        {/* Mid Operational Inventory Box (Left) */}
        <rect
          x="3.5"
          y="10"
          width="7"
          height="4.5"
          rx="1"
          fill="#FFFFFF"
          fillOpacity="0.85"
        />
        {/* Mid Operational Inventory Box (Right) */}
        <rect
          x="12"
          y="10"
          width="8.5"
          height="4.5"
          rx="1"
          fill="#FFFFFF"
          fillOpacity="0.95"
        />
        {/* Growth Block (Ascending Top Stack in Brand Amber Accent) */}
        <path
          d="M12 4.2C12 3.53726 12.5373 3 13.2 3H19.3C19.9627 3 20.5 3.53726 20.5 4.2V7.8C20.5 8.46274 19.9627 9 19.3 9H13.2C12.5373 9 12 8.46274 12 7.8V4.2Z"
          fill="#D99A2B"
        />
        {/* Upward Growth Dynamic Trend Accent Arrow */}
        <path
          d="M4.5 7L7.5 4M7.5 4H5M7.5 4V6.5"
          stroke="#D99A2B"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export const SmallBizLogo = ({
  variant = 'compact',
  size = 'md',
  theme = 'light',
  badge,
  subtitle,
  className = '',
}) => {
  const isDark = theme === 'dark';

  if (variant === 'icon') {
    return <SmallBizIcon size={size} className={className} />;
  }

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
  };

  const subtitleSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-xs sm:text-sm',
    xl: 'text-sm',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 leading-tight ${className}`}>
      <SmallBizIcon size={size} />

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-bold tracking-tight ${titleSizes[size] || titleSizes.md} ${
              isDark ? 'text-white' : 'text-[#1C1917]'
            }`}
          >
            Small<span className={isDark ? 'text-[#D99A2B]' : 'text-[#1F5C4A]'}>Biz</span>
          </span>

          {badge && (
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
                isDark
                  ? 'bg-white/10 text-white border-white/20'
                  : 'bg-[#E3EEE9] text-[#1F5C4A] border-[#1F5C4A]/20'
              }`}
            >
              {badge}
            </span>
          )}
        </div>

        {(subtitle || variant === 'full') && (
          <span
            className={`font-normal tracking-normal ${subtitleSizes[size] || subtitleSizes.md} ${
              isDark ? 'text-[#B9CEC5]' : 'text-[#78716C]'
            }`}
          >
            {subtitle || 'Inventory & Business Management'}
          </span>
        )}
      </div>
    </div>
  );
};

export default SmallBizLogo;
