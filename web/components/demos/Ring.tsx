export function Ring({
  value = 60,
  size = 104,
}: {
  value?: number;
  size?: number;
}) {
  return (
    <svg
      className="ring"
      width={size}
      height={size}
      viewBox="0 0 110 110"
      aria-hidden="true"
    >
      <circle
        cx="55"
        cy="55"
        r="45"
        fill="none"
        stroke="var(--ring-track)"
        strokeWidth="8"
      />
      <circle
        cx="55"
        cy="55"
        r="45"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${Math.min(value, 100) * 2.827} 283`}
        transform="rotate(-90 55 55)"
      />
    </svg>
  );
}
