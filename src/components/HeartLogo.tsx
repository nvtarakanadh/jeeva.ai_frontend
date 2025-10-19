import React from 'react';

interface HeartLogoProps {
  className?: string;
}

export const HeartLogo: React.FC<HeartLogoProps> = ({ className = "h-6 w-6" }) => {
  return (
    <svg 
      width="64" 
      height="64" 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#3b82f6", stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#14b8a6", stopOpacity:1}} />
        </linearGradient>
      </defs>
      
      {/* Heart shape */}
      <path 
        d="M32 58C32 58 6 38 6 22C6 14.268 12.268 8 20 8C24.418 8 28.436 10.246 32 13.5C35.564 10.246 39.582 8 44 8C51.732 8 58 14.268 58 22C58 38 32 58 32 58Z" 
        fill="url(#heartGradient)"
      />
      
      {/* ECG line */}
      <path 
        d="M14 30L18 30L20 26L22 34L24 22L26 38L28 30L32 30" 
        stroke="white" 
        strokeWidth="2.5" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* ECG dots */}
      <circle cx="14" cy="30" r="1.5" fill="white"/>
      <circle cx="32" cy="30" r="1.5" fill="white"/>
    </svg>
  );
};
