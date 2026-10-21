import { useEffect, useRef, type ReactNode } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

// Native <dialog>: focus trap, Esc and inert background for free. Enter/exit in CSS (@starting-style).
export function Modal({ open, onClose, title, children, actions }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="modal-title"
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
    >
      <h2 className="modal__title" id="modal-title">{title}</h2>
      {children}
      {actions && <div className="modal__actions">{actions}</div>}
    </dialog>
  );
}
