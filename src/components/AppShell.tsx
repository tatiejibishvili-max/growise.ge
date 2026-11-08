import { useState, type MouseEvent, type ReactNode } from "react";
import { NAV } from "../nav.ts";
import { hrefFor, useRoute, type AppPage, type Route } from "../router.tsx";
import { useBusiness } from "../store.tsx";
import { Icon } from "./Icon.tsx";
import { Logo } from "./ui.tsx";

export function MarketingShell({ action, children }: { action?: ReactNode; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <BrandLink to={{ name: "landing" }} />
          {action}
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

export function AppShell({ page, children }: { page: AppPage; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { go } = useRoute();
  const { active } = useBusiness();
  const current = NAV.find((item) => item.page === page);

  function navigate(event: MouseEvent<HTMLAnchorElement>, next: Route) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setOpen(false);
    go(next);
  }

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {open ? (
        <button className="fixed inset-0 z-30 bg-[#1d1c2b]/30 lg:hidden" aria-label="ნავიგაციის დახურვა" onClick={() => setOpen(false)} />
      ) : null}
      <aside
        id="app-nav"
        className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col border-r border-line bg-white px-3 py-5 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-2">
          <a href="/" onClick={(event) => navigate(event, { name: "landing" })}>
            <Logo />
          </a>
          <button className="rounded-lg p-2 text-muted lg:hidden" aria-label="ნავიგაციის დახურვა" onClick={() => setOpen(false)}>
            <Icon name="close" size={18} />
          </button>
        </div>
        <nav className="mt-8 space-y-1" aria-label="მთავარი ნავიგაცია">
          {NAV.map((item) => {
            const target: Route = item.page === "home" ? { name: "landing" } : { name: "app", page: item.page };
            const selected = item.page !== "home" && item.page === page;
            return (
              <a
                key={item.page}
                href={hrefFor(target)}
                aria-current={selected ? "page" : undefined}
                onClick={(event) => navigate(event, target)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium ${selected ? "bg-soft text-accent" : "text-muted hover:bg-canvas hover:text-ink"}`}
              >
                <Icon name={item.icon} size={18} />
                {item.label}
              </a>
            );
          })}
        </nav>
        <div className="mt-auto space-y-3 px-2">
          <div className="rounded-xl border border-line px-3 py-3">
            <p className="text-[13px] text-muted">არჩეული ბიზნესი</p>
            <p className="mt-1 text-sm font-semibold leading-5">{active?.name}</p>
            <a href="/choose" className="mt-2 inline-block text-[13px] font-semibold text-accent" onClick={(event) => navigate(event, { name: "choose" })}>
              შეცვლა
            </a>
          </div>
          <a href="/" className="block px-1 text-[13px] font-medium text-muted hover:text-ink" onClick={(event) => navigate(event, { name: "landing" })}>
            საწყისი გვერდი
          </a>
        </div>
      </aside>
      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-20 flex h-16 items-center border-b border-line bg-white/90 px-4 backdrop-blur sm:px-6">
          <button
            className="mr-2 rounded-lg p-2 text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="app-nav"
            aria-label="ნავიგაციის გახსნა"
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" />
          </button>
          <a href="/" className="lg:hidden" onClick={(event) => navigate(event, { name: "landing" })}>
            <Logo />
          </a>
          <p className="hidden text-sm font-medium lg:block">{current?.label}</p>
          <div className="ml-auto hidden min-w-0 items-center gap-3 sm:flex">
            <span className="max-w-64 truncate text-sm text-muted">{active?.name}</span>
            <a href="/choose" className="shrink-0 text-sm font-semibold text-accent" onClick={(event) => navigate(event, { name: "choose" })}>
              შეცვლა
            </a>
          </div>
        </header>
        <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}

function BrandLink({ to }: { to: Route }) {
  const { go } = useRoute();
  return (
    <a
      href={hrefFor(to)}
      onClick={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        go(to);
      }}
    >
      <Logo />
    </a>
  );
}
