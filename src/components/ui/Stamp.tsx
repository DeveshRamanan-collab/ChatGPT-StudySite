// Milestone stamp. Informational, never a reward loop. Animates once (scale .9→1, blur clearing, 600ms).
interface Props {
  big: string;
  label: string;
  animate?: boolean;
}

export function Stamp({ big, label, animate = false }: Props) {
  return (
    <div className="stamp" data-animate={animate || undefined} role="img" aria-label={`${big} ${label}`}>
      <span>
        <span className="stamp__big">{big}</span>
        {label}
      </span>
    </div>
  );
}
