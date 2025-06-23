'use client';

// Make sure you have Font Awesome loaded for icons
// import '@fortawesome/fontawesome-free/css/all.min.css';

// [REDESIGNED] A reusable component for a radial "Gauge Chart" visualization.
const MetricGaugeChart = ({ label, value, icon, lowerIsBetter = false }) => {

  // Determines the color, gradient ID, and text verdict based on the score's quality.
  // This logic is preserved from your original component.
  const getScoreInfo = (score, isLowerBetter) => {
    const qualityScore = isLowerBetter ? 100 - score : score; // "Goodness" score
    if (qualityScore >= 75) {
      return {
        gradientId: 'brand-metric-gradient-good',
        textColor: 'text-green-300',
        verdict: isLowerBetter ? 'Low' : 'High',
      };
    }
    if (qualityScore >= 40) {
      return {
        gradientId: 'brand-metric-gradient-medium',
        textColor: 'text-yellow-300',
        verdict: 'Medium',
      };
    }
    return {
      gradientId: 'brand-metric-gradient-bad',
      textColor: 'text-red-300',
      verdict: isLowerBetter ? 'High' : 'Low',
    };
  };

  const { gradientId, textColor, verdict } = getScoreInfo(value, lowerIsBetter);
  
  // SVG arc calculation
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const arcOffset = circumference * (1 - value / 100);

  return (
    <div className="flex flex-col items-center text-center gap-4">
      {/* The Radial Gauge Chart */}
      <div className="relative w-40 h-40">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="brand-metric-gradient-good" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#2dd4bf" />
            </linearGradient>
            <linearGradient id="brand-metric-gradient-medium" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <linearGradient id="brand-metric-gradient-bad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="rgba(10,25,47,0.8)"
            strokeWidth="12"
          />

          {/* Foreground Arc */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={arcOffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            transform="rotate(-90 60 60)"
          />
        </svg>

        {/* Content inside the gauge: Icon, Score, and Verdict */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <i className={`fas ${icon} text-lg text-[#8892b0] mb-1`}></i>
          <p className="text-4xl font-bold text-white">{value}</p>
          <p className={`font-semibold text-base ${textColor}`}>{verdict}</p>
        </div>
      </div>
      
      {/* Metric Label */}
      <p className="font-semibold text-lg text-[#ccd6f6]">{label}</p>
    </div>
  );
};


export default function BrandMetrics({ scores }) {
  const getCompColor = (v) => (v >= 80 ? 'bg-green-400' : v >= 60 ? 'bg-yellow-400' : 'bg-red-400');

  const metrics = [
    {
      label: 'Competition (higher = easier)',
      color: getCompColor(scores.competitionIntensity),
      value: scores.competitionIntensity,
    },
    {
      label: 'SEO',
      color: 'bg-green-400',
      value: scores.seoDifficulty,
    },
    {
      label: 'Domain',
      color: 'bg-purple-400',
      value: scores.domainStrength,
    },
  ];

  return (
    <div className="hybrid-card p-6">
      <h2 className="text-xl font-bold mb-6 text-white">Brand Metrics</h2>
      <div className="space-y-6">
        {metrics.map((m) => (
          <div key={m.label}>
            <p className="text-sm font-medium text-gray-300 mb-1">{m.label}</p>
            <div className="w-full bg-white/10 rounded-full h-2.5">
              <div className={`${m.color} h-2.5 rounded-full`} style={{ width: `${m.value}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-xs text-[#8892b0] space-y-1">
        <p><strong className="text-white">Note:</strong></p>
        <p>• Competition &amp; SEO higher score = Higher is better.</p>
        <p>• Domain higher score = stronger domain presence.</p>
        
      </div>
    </div>
  );
}