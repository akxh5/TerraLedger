import React from 'react';

const Logo = ({ className = "w-10 h-10" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 100 100" 
    className={className}
    fill="none"
  >
    {/* Subtle Glass/Glow Background */}
    <circle cx="50" cy="50" r="48" fill="url(#glassGrad)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
    
    {/* Topographic Map Contours */}
    <path d="M 10 50 Q 25 30 50 50 T 90 50" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
    <path d="M 15 65 Q 35 40 60 65 T 85 45" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
    <path d="M 25 25 Q 45 45 70 25 T 90 35" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
    
    {/* Geometric Blockchain Cube / Nodes */}
    <g stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" fill="none">
      <path d="M 50 30 L 65 40 L 65 60 L 50 70 L 35 60 L 35 40 Z" fill="rgba(255,255,255,0.05)" />
      <path d="M 50 30 L 50 50 L 65 60" />
      <path d="M 35 40 L 50 50" />
      <path d="M 50 50 L 50 70" />
    </g>

    {/* Light Nodes */}
    <circle cx="50" cy="30" r="2.5" fill="rgba(255,255,255,0.9)" />
    <circle cx="65" cy="40" r="2.5" fill="rgba(255,255,255,0.9)" />
    <circle cx="65" cy="60" r="2.5" fill="rgba(255,255,255,0.9)" />
    <circle cx="50" cy="70" r="2.5" fill="rgba(255,255,255,0.9)" />
    <circle cx="35" cy="60" r="2.5" fill="rgba(255,255,255,0.9)" />
    <circle cx="35" cy="40" r="2.5" fill="rgba(255,255,255,0.9)" />
    <circle cx="50" cy="50" r="3" fill="#fff" />
    
    <defs>
      <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
      </linearGradient>
    </defs>
  </svg>
);

export default Logo;
