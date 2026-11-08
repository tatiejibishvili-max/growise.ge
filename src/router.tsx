import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type AppPage = "home" | "business" | "analysis" | "recommendations" | "plan" | "resources" | "performance";

export type Route = { name: "landing" } | { name: "choose" } | { name: "register" } | { name: "app"; page: AppPage };

const appPaths: Record<string, AppPage> = {
  "/app": "home",
  "/app/business": "business",
  "/app/analysis": "analysis",
  "/app/recommendations": "recommendations",
  "/app/plan": "plan",
  "/app/resources": "resources",
  "/app/performance": "performance",
};

function normalize(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

export function parseRoute(pathname: string): Route {
  const path = normalize(pathname);
  if (path === "/" || path === "") return { name: "landing" };
  if (path === "/choose") return { name: "choose" };
  if (path === "/register") return { name: "register" };
  const page = appPaths[path];
  if (page) return { name: "app", page };
  return { name: "landing" };
}

export function hrefFor(route: Route): string {
  if (route.name === "landing") return "/";
  if (route.name === "choose") return "/choose";
  if (route.name === "register") return "/register";
  const match = Object.entries(appPaths).find(([, page]) => page === route.page);
  return match?.[0] ?? "/app";
}

interface RouteContextValue {
  route: Route;
  go: (next: Route, mode?: "push" | "replace") => void;
}

const RouteContext = createContext<RouteContextValue | null>(null);

export function RouteProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.pathname));

  useEffect(() => {
    const onPop = () => setRoute(parseRoute(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const go = useCallback((next: Route, mode: "push" | "replace" = "push") => {
    const href = hrefFor(next);
    const current = normalize(window.location.pathname);
    if (current !== href) {
      const update = mode === "replace" ? window.history.replaceState : window.history.pushState;
      update.call(window.history, {}, "", href);
    }
    setRoute(parseRoute(href));
    window.scrollTo(0, 0);
  }, []);

  const value = useMemo(() => ({ route, go }), [route, go]);
  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>;
}

export function useRoute(): RouteContextValue {
  const value = useContext(RouteContext);
  if (!value) throw new Error("useRoute must be used within RouteProvider");
  return value;
}

export function Link({
  to,
  className,
  children,
}: {
  to: Route;
  className?: string;
  children: ReactNode;
}) {
  const { go } = useRoute();
  return (
    <a
      href={hrefFor(to)}
      className={className}
      onClick={(event) => {
        if (event.defaultPrevented || event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        go(to);
      }}
    >
      {children}
    </a>
  );
}
