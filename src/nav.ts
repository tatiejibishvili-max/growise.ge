import type { IconName } from "./components/Icon.tsx";
import type { AppPage } from "./router.ts";

export const NAV: { page: AppPage; label: string; icon: IconName }[] = [
  { page: "home", label: "მთავარი", icon: "home" },
  { page: "business", label: "ჩემი ბიზნესი", icon: "building" },
  { page: "analysis", label: "ბიზნესის ანალიზი", icon: "search" },
  { page: "recommendations", label: "რეკომენდაციები", icon: "spark" },
  { page: "plan", label: "მარკეტინგული გეგმა", icon: "plan" },
  { page: "resources", label: "რესურსები", icon: "team" },
  { page: "performance", label: "შედეგების შეფასება", icon: "chart" },
];
