"use client";

interface AwloLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "color" | "white";
  className?: string;
}

const sizes = {
  sm:  { width: 72,  height: 64  },
  md:  { width: 96,  height: 85  },
  lg:  { width: 130, height: 115 },
  xl:  { width: 170, height: 150 },
};

export default function AwloLogo({
  size = "md",
  variant = "color",
  className = "",
}: AwloLogoProps) {
  const { width, height } = sizes[size];
  const w = variant === "white";

  /*
   * ViewBox: 200 × 178
   * Outer Triangle: top = (100, 6), bottom-left = (8, 168), bottom-right = (192, 168)
   * Text row baseline y = 132
   */
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 178"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="AWLO Advert logo"
    >
      {/* ── Outer blue triangle ── */}
      <polygon
        points="100,8 190,166 10,166"
        fill="none"
        stroke={w ? "white" : "#1A56DB"}
        strokeWidth="10"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* ── A (gray) ── */}
      <text
        x="30" y="132"
        fontFamily="Arial Black, Arial, sans-serif"
        fontWeight="900"
        fontSize="38"
        fill={w ? "white" : "#6B7280"}
        textAnchor="middle"
      >A</text>

      {/* ── W (Exact AWLO Logo Shapes) ── */}
      <g>
        {/* Green inverted triangle */}
        <polygon
          points="36,96 62,96 48,125"
          fill={w ? "white" : "#10B981"}
        />

        {/* Yellow pointed chevron */}
        <polygon
          points="66,96 82,96 61,142 50,128"
          fill={w ? "white" : "#FACC15"}
        />

        {/* Red pointed chevron */}
        <polygon
          points="85,96 101,96 83,143 70,130"
          fill={w ? "white" : "#EF4444"}
        />
      </g>

      {/* ── L (gray) ── */}
      <text
        x="115" y="132"
        fontFamily="Arial Black, Arial, sans-serif"
        fontWeight="900"
        fontSize="38"
        fill={w ? "white" : "#6B7280"}
        textAnchor="middle"
      >L</text>

      {/* ── O with play button ── */}
      <circle cx="148" cy="114" r="17"
        fill="none"
        stroke={w ? "white" : "#6B7280"}
        strokeWidth="5"
      />
      <circle cx="148" cy="114" r="11"
        fill={w ? "rgba(255,255,255,0.3)" : "#1A56DB"}
      />
      <polygon
        points="145,109 145,119 155,114"
        fill="white"
      />

      {/* ── ADVERT text ── */}
      <text
        x="100" y="158"
        fontFamily="Arial Black, Arial, sans-serif"
        fontWeight="900"
        fontSize="18"
        fill={w ? "white" : "#111827"}
        textAnchor="middle"
        letterSpacing="3"
      >ADVERT</text>
    </svg>
  );
}
