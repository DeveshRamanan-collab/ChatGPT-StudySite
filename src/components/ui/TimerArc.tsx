// Analogue shrinking-arc timer: the arc is the time left. Purely presentational; the parent owns the clock.
interface Props {
  total: number; // seconds
  remaining: number; // seconds
  size?: number;
  stroke?: number;
  label?: string;
}

export const formatClock = (s: number) => {
  const t = Math.max(0, Math.round(s));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
};

export function TimerArc({ total, remaining, size = 96, stroke = 3, label = 'Time left' }: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const frac = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0;
  return (
    <div className="timer-arc" role="timer" aria-label={`${label}: ${formatClock(remaining)}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle className="timer-arc__track" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={1} />
        <circle className="timer-arc__arc" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${frac * c} ${c}`} />
      </svg>
      <span className="timer-arc__time" aria-hidden="true">{formatClock(remaining)}</span>
    </div>
  );
}
