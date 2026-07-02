/** Reusable elevated surface used by modules, features, and admin panels. */
export default function Card({ children, className = '', hoverLift = false, as: As = 'div', ...rest }) {
  return (
    <As
      className={`bg-card border border-line/60 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${
        hoverLift ? 'hover-lift' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </As>
  );
}
