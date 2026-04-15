import React from 'react';

export interface FlameIconProps extends React.SVGProps<SVGSVGElement> {
  /** Icon size in px (width & height) */
  size?: number;
}

/**
 * Flame / fire SVG icon.
 * Uses a warm orange-to-red gradient for a gamified feel.
 */
export const FlameIcon: React.FC<FlameIconProps> = ({
  size = 32,
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...rest}
  >
    <defs>
      <linearGradient id="flame-grad" x1="12" y1="22" x2="12" y2="2" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="50%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#fbbf24" />
      </linearGradient>
    </defs>
    {/* Outer flame */}
    <path
      d="M12 2C12 2 4.5 9.5 4.5 14.5C4.5 18.64 7.86 22 12 22C16.14 22 19.5 18.64 19.5 14.5C19.5 9.5 12 2 12 2Z"
      fill="url(#flame-grad)"
    />
    {/* Inner flame highlight */}
    <path
      d="M12 22C14.21 22 16 20.21 16 18C16 15 12 10 12 10C12 10 8 15 8 18C8 20.21 9.79 22 12 22Z"
      fill="#fde68a"
      opacity="0.85"
    />
  </svg>
);
