import type { Motif } from "@/lib/products";

type Props = {
  motif: Motif;
  palette: [string, string, string];
  /** Shifts the backdrop composition so a gallery can show the same motif more than once. */
  variant?: number;
  className?: string;
  seed?: string;
};

/**
 * Flat-illustration product art rendered inline as SVG.
 *
 * Everything the catalogue shows is drawn here rather than loaded as a bitmap:
 * it keeps the palette locked to each product, costs no network request, and
 * scales cleanly on any display.
 */
export function ProductArt({ motif, palette, variant = 0, className, seed }: Props) {
  const [main, light, dark] = palette;
  const uid = `${seed ?? motif}-${variant}`;

  return (
    <svg
      viewBox="0 0 400 400"
      role="presentation"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={light} stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id={`face-${uid}`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor={main} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="0.5" cy="0.45" r="0.6">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="400" fill={`url(#bg-${uid})`} />
      {variant % 3 === 0 && <circle cx="200" cy="196" r="132" fill="#fff" opacity="0.5" />}
      {variant % 3 === 1 && <rect x="58" y="54" width="284" height="292" rx="46" fill="#fff" opacity="0.45" />}
      {variant % 3 === 2 && (
        <>
          <circle cx="132" cy="140" r="106" fill="#fff" opacity="0.4" />
          <circle cx="268" cy="258" r="112" fill="#fff" opacity="0.35" />
        </>
      )}
      <rect width="400" height="400" fill={`url(#glow-${uid})`} opacity="0.5" />

      <g transform={`rotate(${variant % 2 === 1 ? -4 : 3} 200 200)`}>
        <Scene motif={motif} main={main} light={light} dark={dark} uid={uid} />
      </g>
    </svg>
  );
}

type SceneProps = { motif: Motif; main: string; light: string; dark: string; uid: string };

function Scene({ motif, main, light, dark, uid }: SceneProps) {
  const face = `url(#face-${uid})`;

  switch (motif) {
    case "giftbox":
      return (
        <g>
          <ellipse cx="200" cy="322" rx="112" ry="16" fill={dark} opacity="0.16" />
          <rect x="104" y="166" width="192" height="152" rx="14" fill={face} />
          <rect x="88" y="132" width="224" height="48" rx="14" fill={main} />
          <rect x="186" y="132" width="28" height="186" fill={light} opacity="0.95" />
          <path d="M200 132c-30-6-52-20-52-40s34-22 42-2c4 10 8 24 10 42z" fill={light} />
          <path d="M200 132c30-6 52-20 52-40s-34-22-42-2c-4 10-8 24-10 42z" fill={light} opacity="0.82" />
          <circle cx="200" cy="130" r="13" fill={dark} />
          <circle cx="92" cy="96" r="7" fill={main} opacity="0.55" />
          <circle cx="322" cy="128" r="10" fill={dark} opacity="0.3" />
          <circle cx="306" cy="66" r="5" fill={main} opacity="0.4" />
          <rect x="70" y="238" width="14" height="14" rx="3" fill={main} opacity="0.4" transform="rotate(24 77 245)" />
        </g>
      );

    case "candle":
      return (
        <g>
          <ellipse cx="200" cy="330" rx="96" ry="15" fill={dark} opacity="0.16" />
          <path d="M132 168h136v140a16 16 0 0 1-16 16H148a16 16 0 0 1-16-16z" fill={face} />
          <rect x="132" y="168" width="136" height="16" rx="8" fill={light} opacity="0.5" />
          {[152, 176, 200, 224, 248].map((x) => (
            <rect key={x} x={x} y="196" width="5" height="96" rx="2.5" fill="#fff" opacity="0.16" />
          ))}
          <ellipse cx="200" cy="168" rx="68" ry="15" fill={light} />
          <ellipse cx="200" cy="166" rx="54" ry="10" fill={dark} opacity="0.18" />
          <rect x="197" y="128" width="6" height="38" rx="3" fill={dark} />
          <path d="M200 66c22 26 30 42 30 56a30 30 0 0 1-60 0c0-14 8-30 30-56z" fill="#FBBF24" />
          <path d="M200 96c11 16 15 25 15 33a15 15 0 0 1-30 0c0-8 4-17 15-33z" fill="#FEF3C7" />
          <circle cx="200" cy="112" r="76" fill="#FBBF24" opacity="0.1" />
        </g>
      );

    case "mug":
      return (
        <g>
          <ellipse cx="200" cy="328" rx="104" ry="15" fill={dark} opacity="0.16" />
          <path d="M280 192h22a34 34 0 0 1 0 68h-22z" fill="none" stroke={main} strokeWidth="18" strokeLinecap="round" />
          <path d="M116 168h168v128a32 32 0 0 1-32 32H148a32 32 0 0 1-32-32z" fill={face} />
          <ellipse cx="200" cy="168" rx="84" ry="19" fill={light} />
          <ellipse cx="200" cy="168" rx="68" ry="13" fill={dark} opacity="0.35" />
          <rect x="116" y="228" width="168" height="18" fill="#fff" opacity="0.18" />
          <path d="M176 128c-14-16 8-24-4-40" fill="none" stroke={dark} strokeWidth="7" strokeLinecap="round" opacity="0.4" />
          <path d="M222 122c-14-16 8-24-4-40" fill="none" stroke={dark} strokeWidth="7" strokeLinecap="round" opacity="0.28" />
          <circle cx="152" cy="204" r="4" fill="#fff" opacity="0.4" />
          <circle cx="246" cy="270" r="5" fill="#fff" opacity="0.3" />
        </g>
      );

    case "bloom":
      return (
        <g>
          <ellipse cx="200" cy="336" rx="86" ry="14" fill={dark} opacity="0.16" />
          <path d="M152 232h96l-12 100a14 14 0 0 1-14 12h-44a14 14 0 0 1-14-12z" fill={face} />
          <rect x="144" y="220" width="112" height="20" rx="10" fill={light} />
          {[
            { x: 200, y: 108, r: 42 },
            { x: 136, y: 152, r: 32 },
            { x: 264, y: 150, r: 34 },
          ].map((f, i) => (
            <g key={i}>
              <path d={`M${f.x} ${f.y + f.r + 8}V220`} stroke={dark} strokeWidth="6" strokeLinecap="round" opacity="0.6" />
              {Array.from({ length: 6 }).map((_, p) => (
                <ellipse
                  key={p}
                  cx={f.x}
                  cy={f.y - f.r * 0.52}
                  rx={f.r * 0.36}
                  ry={f.r * 0.6}
                  fill={p % 2 ? main : light}
                  transform={`rotate(${p * 60} ${f.x} ${f.y})`}
                />
              ))}
              <circle cx={f.x} cy={f.y} r={f.r * 0.3} fill="#FBBF24" />
            </g>
          ))}
          <path d="M168 220c-26-18-40-42-38-70 26 8 44 30 48 62z" fill={dark} opacity="0.35" />
          <path d="M238 220c26-18 40-42 38-70-26 8-44 30-48 62z" fill={dark} opacity="0.28" />
        </g>
      );

    case "chocolate":
      return (
        <g>
          <ellipse cx="200" cy="330" rx="112" ry="15" fill={dark} opacity="0.16" />
          <rect x="96" y="120" width="208" height="192" rx="16" fill={face} transform="rotate(-6 200 216)" />
          <g transform="rotate(-6 200 216)">
            {[0, 1, 2, 3].map((r) =>
              [0, 1, 2].map((c) => (
                <rect
                  key={`${r}-${c}`}
                  x={110 + c * 62}
                  y={134 + r * 44}
                  width="54"
                  height="36"
                  rx="6"
                  fill="#fff"
                  opacity={(r + c) % 2 ? 0.14 : 0.07}
                />
              )),
            )}
            <rect x="96" y="120" width="208" height="14" rx="7" fill="#fff" opacity="0.2" />
          </g>
          <path d="M84 148l40-14 8 24-42 12z" fill={light} opacity="0.9" />
          <circle cx="306" cy="108" r="12" fill={light} opacity="0.7" />
          <circle cx="86" cy="286" r="8" fill={light} opacity="0.55" />
        </g>
      );

    case "jewel":
      return (
        <g>
          <path d="M104 108c0 84 43 132 96 132s96-48 96-132" fill="none" stroke={dark} strokeWidth="6" opacity="0.5" />
          <path d="M104 108c0 84 43 132 96 132s96-48 96-132" fill="none" stroke="#FBBF24" strokeWidth="3" strokeDasharray="1 9" strokeLinecap="round" />
          <circle cx="200" cy="278" r="54" fill={face} />
          <circle cx="200" cy="278" r="54" fill="none" stroke="#FBBF24" strokeWidth="5" />
          <circle cx="200" cy="278" r="34" fill="#fff" opacity="0.2" />
          <path d="M200 252l8 18 18 8-18 8-8 18-8-18-18-8 18-8z" fill="#FEF3C7" />
          <circle cx="200" cy="222" r="11" fill="none" stroke="#FBBF24" strokeWidth="5" />
          <path d="M306 92l5 13 13 5-13 5-5 13-5-13-13-5 13-5z" fill={main} opacity="0.7" />
          <path d="M88 168l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill={main} opacity="0.5" />
        </g>
      );

    case "journal":
      return (
        <g>
          <ellipse cx="204" cy="330" rx="108" ry="14" fill={dark} opacity="0.16" />
          <rect x="106" y="90" width="196" height="228" rx="12" fill={dark} opacity="0.35" transform="rotate(5 204 204)" />
          <rect x="96" y="82" width="196" height="228" rx="12" fill={face} />
          <rect x="96" y="82" width="26" height="228" rx="12" fill={dark} opacity="0.4" />
          <rect x="284" y="90" width="12" height="212" rx="6" fill="#fff" opacity="0.65" />
          <rect x="146" y="132" width="108" height="6" rx="3" fill="#fff" opacity="0.5" />
          <rect x="146" y="154" width="76" height="6" rx="3" fill="#fff" opacity="0.32" />
          <rect x="146" y="238" width="108" height="5" rx="2.5" fill="#fff" opacity="0.22" />
          <rect x="146" y="256" width="88" height="5" rx="2.5" fill="#fff" opacity="0.22" />
          <path d="M238 82v92l-20-16-20 16V82z" fill="#FBBF24" />
          <circle cx="200" cy="196" r="20" fill="none" stroke="#fff" strokeWidth="3" opacity="0.35" />
        </g>
      );

    case "hamper":
      return (
        <g>
          <ellipse cx="200" cy="332" rx="116" ry="15" fill={dark} opacity="0.16" />
          <rect x="126" y="92" width="44" height="60" rx="8" fill={light} />
          <rect x="182" y="72" width="38" height="80" rx="19" fill={main} opacity="0.85" />
          <circle cx="252" cy="118" r="32" fill={light} opacity="0.9" />
          <path d="M252 96v44M230 118h44" stroke={dark} strokeWidth="5" strokeLinecap="round" opacity="0.4" />
          <path d="M96 150h208l-18 152a20 20 0 0 1-20 18H134a20 20 0 0 1-20-18z" fill={face} />
          {[0, 1, 2, 3].map((r) => (
            <rect key={r} x="104" y={176 + r * 34} width="192" height="10" rx="5" fill="#fff" opacity="0.13" />
          ))}
          {[0, 1, 2, 3, 4, 5].map((c) => (
            <rect key={c} x={116 + c * 32} y="150" width="10" height="170" fill="#fff" opacity="0.1" />
          ))}
          <rect x="88" y="140" width="224" height="22" rx="11" fill={light} />
        </g>
      );

    case "teddy":
      return (
        <g>
          <ellipse cx="200" cy="336" rx="94" ry="14" fill={dark} opacity="0.16" />
          <circle cx="132" cy="122" r="34" fill={dark} opacity="0.85" />
          <circle cx="268" cy="122" r="34" fill={dark} opacity="0.85" />
          <circle cx="132" cy="122" r="17" fill={light} />
          <circle cx="268" cy="122" r="17" fill={light} />
          <ellipse cx="200" cy="248" rx="86" ry="82" fill={face} />
          <ellipse cx="200" cy="262" rx="52" ry="48" fill={light} opacity="0.55" />
          <circle cx="200" cy="146" r="76" fill={face} />
          <ellipse cx="200" cy="168" rx="38" ry="30" fill={light} opacity="0.75" />
          <circle cx="176" cy="134" r="9" fill={dark} />
          <circle cx="224" cy="134" r="9" fill={dark} />
          <ellipse cx="200" cy="160" rx="12" ry="9" fill={dark} />
          <path d="M200 170c0 10-10 14-18 9M200 170c0 10 10 14 18 9" stroke={dark} strokeWidth="5" strokeLinecap="round" fill="none" />
          <ellipse cx="112" cy="252" rx="26" ry="34" fill={face} transform="rotate(-18 112 252)" />
          <ellipse cx="288" cy="252" rx="26" ry="34" fill={face} transform="rotate(18 288 252)" />
        </g>
      );

    case "frame":
      return (
        <g>
          <ellipse cx="200" cy="336" rx="106" ry="13" fill={dark} opacity="0.16" />
          <rect x="72" y="84" width="256" height="232" rx="14" fill={face} />
          <rect x="94" y="106" width="212" height="188" rx="6" fill="#fff" opacity="0.92" />
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={110 + c * 62}
                y={122 + r * 58}
                width="50"
                height="46"
                rx="5"
                fill={(r + c) % 3 === 0 ? main : (r + c) % 3 === 1 ? light : dark}
                opacity={(r + c) % 3 === 2 ? 0.45 : 0.85}
              />
            )),
          )}
          <rect x="72" y="84" width="256" height="232" rx="14" fill="none" stroke={dark} strokeWidth="10" opacity="0.28" />
          <path d="M328 96l6 16 16 6-16 6-6 16-6-16-16-6 16-6z" fill="#FBBF24" opacity="0.7" />
        </g>
      );

    case "spa":
      return (
        <g>
          <ellipse cx="200" cy="330" rx="112" ry="15" fill={dark} opacity="0.16" />
          <path d="M96 226h208a104 104 0 0 1-104 92 104 104 0 0 1-104-92z" fill={face} />
          <ellipse cx="200" cy="226" rx="104" ry="20" fill={light} />
          <ellipse cx="200" cy="224" rx="84" ry="14" fill="#fff" opacity="0.5" />
          <g transform="translate(0 -8)">
            <path d="M200 208c-34-8-56-34-54-70 34 6 56 32 54 70z" fill={main} opacity="0.85" />
            <path d="M200 208c34-8 56-34 54-70-34 6-56 32-54 70z" fill={dark} opacity="0.5" />
            <path d="M200 208V136" stroke={dark} strokeWidth="5" strokeLinecap="round" opacity="0.5" />
          </g>
          <circle cx="112" cy="122" r="13" fill={light} />
          <circle cx="292" cy="106" r="9" fill={light} opacity="0.8" />
          <circle cx="316" cy="170" r="6" fill={main} opacity="0.5" />
          <path d="M104 176c8-14 8-22 0-34" stroke={main} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.4" />
        </g>
      );

    case "plant":
    default:
      return (
        <g>
          <ellipse cx="200" cy="334" rx="92" ry="14" fill={dark} opacity="0.16" />
          <path d="M138 222h124l-14 88a18 18 0 0 1-18 16h-60a18 18 0 0 1-18-16z" fill={face} />
          <rect x="128" y="204" width="144" height="26" rx="10" fill={light} />
          <path d="M200 204V118" stroke={dark} strokeWidth="7" strokeLinecap="round" opacity="0.65" />
          {[
            { d: "M200 178c-38-4-62-28-64-64 38 0 62 24 64 64z", o: 0.9 },
            { d: "M200 156c38-6 60-32 58-68-38 2-60 28-58 68z", o: 0.7 },
            { d: "M200 202c-30 2-52 20-56 48 30 2 52-16 56-48z", o: 0.55 },
          ].map((leaf, i) => (
            <path key={i} d={leaf.d} fill={main} opacity={leaf.o} />
          ))}
          <path d="M200 196c30 2 50 18 54 44-30 2-50-14-54-44z" fill={dark} opacity="0.4" />
          <circle cx="102" cy="96" r="8" fill={main} opacity="0.35" />
          <circle cx="312" cy="252" r="10" fill={main} opacity="0.25" />
        </g>
      );
  }
}
