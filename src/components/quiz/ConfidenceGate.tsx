import type { Confidence } from '../../lib/db';

const LEVELS: { value: Confidence; label: string; key: string }[] = [
  { value: 'sure', label: 'Sure', key: 'S' },
  { value: 'unsure', label: 'Unsure', key: 'U' },
  { value: 'guess', label: 'Guess', key: 'G' },
];

// Confidence is captured before every answer: the options stay locked until one is chosen (keys S / U / G).
export function ConfidenceGate({ value, onChange, disabled }: { value: Confidence | null; onChange: (c: Confidence) => void; disabled?: boolean }) {
  return (
    <div className="confidence" role="radiogroup" aria-label="How sure are you?">
      <span className="confidence__label">How sure are you?</span>
      {LEVELS.map((l) => (
        <button
          key={l.value}
          type="button"
          role="radio"
          aria-checked={value === l.value}
          className="chip confidence__opt"
          disabled={disabled}
          onClick={() => onChange(l.value)}
        >
          {l.label} <kbd className="kbd" aria-hidden="true">{l.key}</kbd>
        </button>
      ))}
    </div>
  );
}
