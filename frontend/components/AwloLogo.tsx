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
   * Triangle vertices: top = (100, 6), bottom-left = (8, 168), bottom-right = (192, 168)
   * Text row sits at y ≈ 130, ADVERT at y ≈ 157
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
      {/* ── Outer blue triangle (hollow, thick stroke) ── */}
      <polygon
        points="100,8 190,166 10,166"
        fill="none"
        stroke={w ? "white" : "#1A56DB"}
        strokeWidth="10"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* ══════════════════════════════════════════
          LETTER ROW  –  baseline y = 132
          Approximate x positions (viewBox units):
            A  : 28
            W  : 50  (wide – takes ~30 units)
            /  : 82
            L  : 93
            O  : 111 (circle glyph)
          ══════════════════════════════════════════ */}

      {/* ── A (gray) ── */}
      <text
        x="28" y="132"
        fontFamily="Arial Black, Arial, sans-serif"
        fontWeight="900"
        fontSize="38"
        fill={w ? "white" : "#6B7280"}
        textAnchor="middle"
      >A</text>

      {/* ── W  –  rendered as two mirrored chevrons ──
          Left chevron: green   Right chevron: red
          We draw them as filled polygons so we get
          clean colour splits without font hacks.
          W bounding box: x 47–83, top y 96, bottom y 134  */}

      {/* Green left half of W */}
      <polygon
        points="47,96  57,96  65,128  57,134  47,134"
        fill={w ? "white" : "#16A34A"}
      />
      {/* shared inner-V tip (green side) */}
      <polygon
        points="57,96  65,128  65,96"
        fill={w ? "white" : "#16A34A"}
      />

      {/* Red right half of W */}
      <polygon
        points="83,96  73,96  65,128  73,134  83,134"
        fill={w ? "white" : "#DC2626"}
      />
      {/* shared inner-V tip (red side) */}
      <polygon
        points="73,96  65,128  65,96"
        fill={w ? "white" : "#DC2626"}
      />

      {/* ── / (yellow slash) ── */}
      <text
        x="91" y="132"
        fontFamily="Arial Black, Arial, sans-serif"
        fontWeight="900"
        fontSize="38"
        fill={w ? "white" : "#EAB308"}
        textAnchor="middle"
      >/</text>

      {/* ── L (gray) ── */}
      <text
        x="107" y="132"
        fontFamily="Arial Black, Arial, sans-serif"
        fontWeight="900"
        fontSize="38"
        fill={w ? "white" : "#6B7280"}
        textAnchor="middle"
      >L</text>

      {/* ── O with play-button ──
          Draw a gray "O" ring, then overlay a blue circle with
          a white play triangle inside (matching the logo exactly) */}

      {/* Gray O ring */}
      <circle cx="143" cy="114" r="17"
        fill="none"
        stroke={w ? "white" : "#6B7280"}
        strokeWidth="5"
      />

      {/* Blue filled circle (play button background) */}
      <circle cx="143" cy="114" r="11"
        fill={w ? "rgba(255,255,255,0.3)" : "#1A56DB"}
      />

      {/* White play triangle */}
      <polygon
        points="140,109  140,119  150,114"
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

