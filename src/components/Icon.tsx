import type { ReactNode } from "react";

export type IconName = "spark" | "home" | "building" | "search" | "plan" | "team" | "chart" | "menu" | "close" | "arrow";

const paths: Record<IconName, ReactNode> = {
  spark: (
    <>
      <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2Z" />
      <path d="m18 14 .7 2.1L21 17l-2.3.7L18 20l-.7-2.3L15 17l2.3-.9Z" />
    </>
  ),
  home: (
    <>
      <path d="m4 11 8-7 8 7" />
      <path d="M6 10.5V20h12v-9.5" />
    </>
  ),
  building: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M8 21v-4h8v4M8 7h.01M12 7h.01M16 7h.01M8 11h.01M12 11h.01M16 11h.01" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  plan: (
    <>
      <path d="M8 4h9a2 2 0 0 1 2 2v14H8a2 2 0 0 0-2 2V6a2 2 0 0 1 2-2Z" />
      <path d="M8 4v16M11 8h5M11 12h5" />
    </>
  ),
  team: (
    <>
      <path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20" />
      <circle cx="10" cy="8" r="3" />
      <path d="M20 20v-1.2a3 3 0 0 0-2.2-2.9M16 5.2a3 3 0 0 1 0 5.6" />
    </>
  ),
  chart: (
    <>
      <path d="M4 19h16" />
      <path d="M7 16v-4M12 16V8M17 16v-6" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
};

export function Icon({ name, size = 20, className = "" }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
