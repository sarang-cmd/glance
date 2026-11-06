/**
 * Glance mark: a rounded-square frame (the lock screen), a ring (the habit
 * rings at the heart of the product) and the dot at its center. Flat, two
 * colors, legible at 16 px.
 */
export default function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-hidden="true" focusable="false">
      <rect x="2" y="2" width="28" height="28" rx="8" fill="none" stroke="var(--ink)" strokeWidth="2.4" />
      <circle cx="16" cy="16" r="6.4" fill="none" stroke="var(--accent)" strokeWidth="2.8" />
      <circle cx="16" cy="16" r="1.7" fill="var(--accent)" />
    </svg>
  );
}
