export function Diamond({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    >
      <path d="M12 2.5 21.5 12 12 21.5 2.5 12z" />
      <path d="M12 7.5 16.5 12 12 16.5 7.5 12z" opacity="0.55" />
    </svg>
  );
}
