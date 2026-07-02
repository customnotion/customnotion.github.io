import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/** Accessible modal: traps focus visually, closes on Escape/backdrop click. */
export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  const dialogRef = useRef(null);
  // Keep the latest onClose in a ref instead of a effect dependency. Parents
  // typically pass an inline `onClose={() => setOpen(false)}`, which gets a
  // new function identity on every render (e.g. every keystroke inside the
  // modal's form). If `onClose` were a dependency of the focus effect below,
  // that effect would re-run on every keystroke and steal focus back to the
  // dialog container, forcing the user to click into the field again for
  // each character. Reading it from a ref avoids that without needing a
  // stable callback from every call site.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Move focus into the dialog only when it transitions from closed to open
  // -- not on every re-render.
  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  // Escape-to-close listener. This can safely depend on `open` alone since
  // it always calls the latest onClose via the ref.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onCloseRef.current?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className={`w-full ${widths[size] || widths.md} bg-card rounded-2xl shadow-2xl animate-scale-in outline-none max-h-[90vh] flex flex-col`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h2 id="modal-title" className="text-base font-semibold text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-muted hover:bg-black/5 hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-line flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}
