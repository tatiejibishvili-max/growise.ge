import type { ButtonHTMLAttributes, ReactNode } from "react";

export function buttonClass(variant: "primary" | "secondary" | "ghost" = "primary", extra = ""): string {
  const styles = {
    primary: "bg-accent text-white hover:bg-accent-dark",
    secondary: "border border-line bg-white text-ink hover:border-accent/40",
    ghost: "text-accent hover:bg-soft",
  };
  return `inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[15px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${extra}`;
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  return <button className={buttonClass(variant, className)} {...props} />;
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(29,28,43,0.04)] sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

export function PageIntro({ eyebrow, title, lede }: { eyebrow?: string; title: string; lede?: string }) {
  return (
    <header className="max-w-3xl">
      {eyebrow ? <p className="mb-2 text-[13px] font-medium text-accent">{eyebrow}</p> : null}
      <h1 className="text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[2rem]">{title}</h1>
      {lede ? <p className="mt-3 text-[15px] leading-7 text-muted">{lede}</p> : null}
    </header>
  );
}

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "good" | "warn" | "accent";
  children: ReactNode;
}) {
  const tones = {
    neutral: "border-line bg-white text-muted",
    good: "border-transparent bg-good-soft text-good",
    warn: "border-transparent bg-warn-soft text-warn",
    accent: "border-transparent bg-soft text-accent",
  };
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[13px] font-medium ${tones[tone]}`}>{children}</span>;
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, index) => (
        <li key={`${index}-${item}`} className="flex gap-3 text-[15px] leading-7">
          <span className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent/80" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return <img src="/logo.png?v=2" alt="growise" className={`block h-7 w-auto max-w-full ${className}`} />;
}

export const fieldClass =
  "w-full rounded-xl border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-accent";
