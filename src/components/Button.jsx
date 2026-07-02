import { sanitizeUrl } from '../lib/security.js';

const VARIANTS = {
  primary:
    'bg-accent text-white shadow-sm hover:bg-accent-dark hover:shadow-md',
  secondary:
    'bg-transparent text-accent border border-accent hover:bg-accent/5',
  ghost: 'bg-transparent text-ink hover:bg-black/5',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

/**
 * Shared button/link component. Renders an <a> when a `href` is supplied
 * (destinations are always passed through sanitizeUrl first) and a
 * <button> otherwise, so keyboard/screen-reader semantics stay correct.
 */
export default function Button({
  as,
  href,
  newTab = false,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  style,
  ...rest
}) {
  const base =
    'btn-ripple inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const sizes = {
    sm: 'px-3.5 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };
  const classes = `${base} ${sizes[size] || sizes.md} ${VARIANTS[variant] || VARIANTS.primary} ${className}`;

  if (as === 'a' || href) {
    const safeHref = sanitizeUrl(href);
    return (
      <a
        href={safeHref}
        className={classes}
        style={style}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={rest.type || 'button'} className={classes} style={style} {...rest}>
      {children}
    </button>
  );
}
