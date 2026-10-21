// Progress ring. `value` mode: a single arc 0–1. `criterion` mode: four segments for the criterion
// learning loop — pretested → learned (3 correct in a session) → relearning (spaced sessions) → secured.
export const CRITERION_STAGES = ['Pretested', 'Learned', 'Relearning', 'Secured'] as const;

interface Props {
  size?: number;
  stroke?: number;
  /** 0–1, for the single-arc variant. */
  value?: number;
  /** 0–4 completed criterion stages; `partial` (0–1) fills the next segment. */
  stage?: number;
  partial?: number;
  label?: string;
  showValue?: boolean;
}

export function ProgressRing({ size = 48, stroke = 4, value, stage, partial = 0, label, showValue = false }: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const center = size / 2;
  const common = { cx: center, cy: center, r, fill: 'none', strokeWidth: stroke } as const;

  if (stage === undefined) {
    const v = Math.max(0, Math.min(1, value ?? 0));
    return (
      <svg className="ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label ?? `${Math.round(v * 100)}%`}>
        <circle className="ring__track" {...common} />
        <circle className={`ring__fill${v >= 1 ? ' ring__fill--done' : ''}`} {...common} strokeLinecap="round" strokeDasharray={`${v * c} ${c}`} transform={`rotate(-90 ${center} ${center})`} />
        {showValue && <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize={size * 0.24}>{Math.round(v * 100)}</text>}
      </svg>
    );
  }

  const gap = stroke * 1.5; // visual gap between segments (in px along the circumference)
  const seg = c / 4;
  const done = Math.max(0, Math.min(4, stage));
  const secured = done >= 4;
  const aria = label ?? `${secured ? 'Secured' : done === 0 ? 'Not started' : CRITERION_STAGES[done - 1]} (${done} of 4)`;
  return (
    <svg className="ring ring--criterion" width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={aria}>
      {[0, 1, 2, 3].map((i) => {
        const fill = i < done ? 1 : i === done ? Math.max(0, Math.min(1, partial)) : 0;
        const len = seg - gap;
        const rot = -90 + (i * 360) / 4 + ((gap / 2) / c) * 360;
        return (
          <g key={i} transform={`rotate(${rot} ${center} ${center})`}>
            <circle className="ring__track" {...common} strokeDasharray={`${len} ${c}`} />
            {fill > 0 && <circle className={`ring__fill${secured ? ' ring__fill--done' : ''}`} {...common} strokeDasharray={`${len * fill} ${c}`} />}
          </g>
        );
      })}
    </svg>
  );
}
