import { useEffect } from "react";
import { AppShell } from "./components/AppShell.tsx";
import { buildWorkspace } from "./engine.ts";
import { NAV } from "./nav.ts";
import { AnalysisPage } from "./pages/AnalysisPage.tsx";
import { ChoosePage } from "./pages/ChoosePage.tsx";
import { LandingPage } from "./pages/LandingPage.tsx";
import { OverviewPage } from "./pages/OverviewPage.tsx";
import { PerformancePage } from "./pages/PerformancePage.tsx";
import { PlanPage } from "./pages/PlanPage.tsx";
import { ProfilePage } from "./pages/ProfilePage.tsx";
import { RecommendationsPage } from "./pages/RecommendationsPage.tsx";
import { RegisterPage } from "./pages/RegisterPage.tsx";
import { ResourcesPage } from "./pages/ResourcesPage.tsx";
import { RouteProvider, useRoute } from "./router.tsx";
import { BusinessProvider, draftFor, useBusiness } from "./store.tsx";

export default function App() {
  return (
    <BusinessProvider>
      <RouteProvider>
        <AppRoutes />
      </RouteProvider>
    </BusinessProvider>
  );
}

function AppRoutes() {
  const { route, go } = useRoute();
  const { active, drafts } = useBusiness();
  const workspace = active ? buildWorkspace(active, draftFor(drafts, active.id)) : null;

  useEffect(() => {
    if (route.name === "app" && !active) go({ name: "choose" }, "replace");
  }, [route, active, go]);

  useEffect(() => {
    if (route.name === "landing") document.title = "Growise: მარკეტინგის გადაწყვეტილებები";
    else if (route.name === "choose") document.title = "Growise: ბიზნესის არჩევა";
    else if (route.name === "register") document.title = "Growise: ახალი ბიზნესი";
    else document.title = `Growise: ${NAV.find((item) => item.page === route.page)?.label ?? "Growise"}`;
  }, [route]);

  if (route.name === "landing") return <LandingPage />;
  if (route.name === "choose") return <ChoosePage />;
  if (route.name === "register") return <RegisterPage />;
  if (!workspace) return null;

  return (
    <AppShell page={route.page}>
      {route.page === "home" && <OverviewPage workspace={workspace} />}
      {route.page === "business" && <ProfilePage workspace={workspace} />}
      {route.page === "analysis" && <AnalysisPage workspace={workspace} />}
      {route.page === "recommendations" && <RecommendationsPage workspace={workspace} />}
      {route.page === "plan" && <PlanPage workspace={workspace} />}
      {route.page === "resources" && <ResourcesPage workspace={workspace} />}
      {route.page === "performance" && <PerformancePage workspace={workspace} />}
    </AppShell>
  );
}
