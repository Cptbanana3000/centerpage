'use client';

import React from 'react';

// A new, more sophisticated utility to get all necessary styles based on the score
const getScoreStyling = (score) => {
  if (score >= 75) {
    return {
      gradientId: 'score-gradient-good',
      fromColor: '#64ffda', // Teal
      toColor: '#7dd3fc',   // Light Blue
      textColor: 'text-green-300',
      glowFilter: 'url(#glow-good)',
    };
  }
  if (score >= 40) {
    return {
      gradientId: 'score-gradient-medium',
      fromColor: '#facc15', // Yellow
      toColor: '#fb923c',   // Orange
      textColor: 'text-yellow-300',
      glowFilter: 'url(#glow-medium)',
    };
  }
  return {
    gradientId: 'score-gradient-bad',
    fromColor: '#f87171', // Red
    toColor: '#f472b6',   // Pink
    textColor: 'text-red-300',
    glowFilter: 'url(#glow-bad)',
  };
};

export default function ScoreCircle({ score = 0, size = 128, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const { gradientId, fromColor, toColor, textColor, glowFilter } = getScoreStyling(score);

  return (
    <div style={{ width: size, height: size }} className="relative">
      <svg
        className="w-full h-full transform -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          {/* Define gradients for each score level */}
          <linearGradient id="score-gradient-good" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#64ffda" />
          </linearGradient>
          <linearGradient id="score-gradient-medium" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#facc15" />
          </linearGradient>
          <linearGradient id="score-gradient-bad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#f87171" />
          </linearGradient>
          {/* Define glow filters */}
          <filter id="glow-good" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
           <filter id="glow-medium" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
           <filter id="glow-bad" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-current text-white/5"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Animated Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{ filter: glowFilter }}
        />
      </svg>
      {/* Centered score text with drop shadow */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ textShadow: `0 0 15px ${fromColor}60`}}
      >
        <span
          className={`font-bold ${textColor}`}
          style={{ fontSize: size * 0.35 }}
        >
          {score}
        </span>
      </div>
    </div>
  );
}
