"use client";

interface LogoProps {
  size?: "sm" | "md";
  text?: string;
  className?: string;
}

function GamepadIcon({ size }: { size: number }) {
  const id = `lg-${size}`;
  return (
    <svg
      viewBox="0 0 28 20"
      width={size}
      height={size * (20 / 28)}
      aria-hidden="true"
      className="shrink-0"
      style={{ filter: "drop-shadow(0 0 4px rgba(99,102,241,0.45))" }}
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="55%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      {/* Controller body */}
      <rect x="1" y="3" width="26" height="14" rx="7" fill={`url(#${id})`} />
      {/* D-pad */}
      <rect x="6" y="5.5" width="2" height="8" rx="0.6" fill="white" opacity="0.92" />
      <rect x="4" y="7.5" width="6" height="2" rx="0.6" fill="white" opacity="0.92" />
      {/* Buttons */}
      <circle cx="20" cy="8" r="1.4" fill="white" opacity="0.92" />
      <circle cx="23" cy="11" r="1.4" fill="white" opacity="0.92" />
    </svg>
  );
}

export function Logo({ size = "md", text = "Bedava Oyun", className }: LogoProps) {
  const config = {
    sm: { textClass: "text-sm", icon: 20 },
    md: { textClass: "text-lg", icon: 26 },
  };

  const s = config[size];

  return (
    <span
      className={`inline-flex items-center gap-2 ${className || ""}`}
      aria-label={text}
    >
      <GamepadIcon size={s.icon} />
      <span
        className={`font-extrabold tracking-tight ${s.textClass}`}
        style={{
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 40%, #06b6d4 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {text}
      </span>
    </span>
  );
}

export function LogoIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      aria-label="Bedava Oyun"
    >
      <defs>
        <linearGradient id="fi-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="55%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="7" fill="url(#fi-g)" />
      {/* D-pad */}
      <rect x="7.5" y="10" width="3" height="10" rx="1" fill="white" opacity="0.92" />
      <rect x="5" y="13" width="8" height="3" rx="1" fill="white" opacity="0.92" />
      {/* Buttons */}
      <circle cx="22" cy="13" r="2.2" fill="white" opacity="0.92" />
      <circle cx="26" cy="17" r="2.2" fill="white" opacity="0.92" />
    </svg>
  );
}
