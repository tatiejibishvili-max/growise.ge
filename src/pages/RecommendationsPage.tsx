import { Badge, PageIntro, Panel } from "../components/ui.tsx";
import { commercial } from "../commercial.ts";
import { groupedRecommendations, kindLabel, timingLabel } from "../labels.ts";
import type { Workspace } from "../types.ts";

export function RecommendationsPage({ workspace }: { workspace: Workspace }) {
  const groups = groupedRecommendations(workspace.recommendations);

  return (
    <>
      <PageIntro title="რეკომენდაციები" lede={workspace.overview.decision} />
      <p className="text-[15px] leading-7 text-muted">{commercial.neutral}</p>
      <Panel>
        {groups.map((group) => (
          <section key={group.timing} className="border-t border-line py-5 first:border-t-0 first:pt-0 last:pb-0">
            <h2 className="text-base font-semibold">{timingLabel[group.timing]}</h2>
            <ul className="mt-4 space-y-5">
              {group.items.map((item) => (
                <li key={item.id}>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{kindLabel[item.kind]}</Badge>
                  </div>
                  <h3 className="mt-2 text-[16px] font-semibold leading-6">{item.title}</h3>
                  <p className="mt-2 text-[15px] leading-7 text-muted">{item.why}</p>
                  <p className="mt-2 text-[13px] text-ink">ბიუჯეტი: {item.budget}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Panel>
    </>
  );
}
