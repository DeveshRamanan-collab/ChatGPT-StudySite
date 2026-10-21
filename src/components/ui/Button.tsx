import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'md' | 'sm';
  children: ReactNode;
}

export function Button({ variant = 'secondary', size = 'md', className = '', children, type = 'button', ...rest }: Props) {
  const cls = ['btn', `btn--${variant}`, size === 'sm' && 'btn--sm', variant === 'icon' && 'btn--secondary', className].filter(Boolean).join(' ');
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  );
}

export const Kbd = ({ children }: { children: ReactNode }) => <kbd className="kbd">{children}</kbd>;

export function Chip({ pressed, className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { pressed?: boolean }) {
  return <button type="button" className={`chip ${className}`} aria-pressed={pressed} {...rest} />;
}
