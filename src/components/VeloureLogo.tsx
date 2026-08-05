import React from 'react';

interface VeloureLogoProps {
  className?: string;
  size?: number;
}

export const VeloureLogo: React.FC<VeloureLogoProps> = ({ className = 'h-10 w-auto', size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Top Arc in Burnt Orange */}
      <path
        d="M20 48C20 31.4315 33.4315 18 50 18C66.5685 18 80 31.4315 80 48"
        stroke="#BE5103"
        strokeWidth="11"
        strokeLinecap="round"
      />
      {/* Bottom Arc in Burnt Orange */}
      <path
        d="M80 52C80 68.5685 66.5685 82 50 82C33.4315 82 20 68.5685 20 52"
        stroke="#BE5103"
        strokeWidth="11"
        strokeLinecap="round"
      />
      {/* Left Dot in Espresso */}
      <circle cx="15" cy="50" r="5.5" fill="#332216" />
      {/* Right Dot in Espresso */}
      <circle cx="85" cy="50" r="5.5" fill="#332216" />
    </svg>
  );
};
