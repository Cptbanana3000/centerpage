'use client';

import React from 'react';

// A new, more sophisticated utility to get all necessary styles based on the score
const getScoreStyling = (score) => {
  if (score >= 75) {
    return {
      gradientId: 'score-gradient-good',
      fromColor: '#10B981', // Emerald 500
      toColor: '#06B6D4',   // Cyan 500
      textColor: 'text-green-600',
    };
  }
  if (score >= 40) {
    return {
      gradientId: 'score-gradient-medium',
      fromColor: '#F59E0B', // Amber 500
      toColor: '#F97316',   // Orange 500
      textColor: 'text-yellow-600',
    };
  }
  return {
    gradientId: 'score-gradient-bad',
    fromColor: '#EF4444', // Red 500
    toColor: '#EC4899',   // Pink 500
    textColor: 'text-red-600',
  };
};

export default function ScoreCircle({ score = 0, size = 128, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const { gradientId, fromColor, toColor, textColor } = getScoreStyling(score);

  return (
    <div style={{ width: size, height: size }} className="relative">
      <svg
        className="w-full h-full transform -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          {/* Define gradients for each score level */}
          <linearGradient id="score-gradient-good" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={toColor} />
            <stop offset="100%" stopColor={fromColor} />
          </linearGradient>
          <linearGradient id="score-gradient-medium" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={toColor} />
            <stop offset="100%" stopColor={fromColor} />
          </linearGradient>
          <linearGradient id="score-gradient-bad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={toColor} />
            <stop offset="100%" stopColor={fromColor} />
          </linearGradient>
        </defs>

        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-current text-gray-200"
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
        />
      </svg>
      {/* Centered score text */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
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
