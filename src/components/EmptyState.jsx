import Icon from './Icon.jsx';
import Button from './Button.jsx';

export default function EmptyState({ icon = 'Inbox', title, message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 rounded-2xl border border-dashed border-line">
      <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4">
        <Icon name={icon} className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-ink mb-1">{title}</h3>
      {message && <p className="text-sm text-muted max-w-sm mb-5">{message}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
