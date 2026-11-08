import { Icon } from "../components/Icon.tsx";
import { PageIntro, Panel } from "../components/ui.tsx";
import { Link } from "../router.tsx";
import type { Workspace } from "../types.ts";

export function OverviewPage({ workspace }: { workspace: Workspace }) {
  const { profile, overview, plan, performance } = workspace;

  return (
    <>
      <PageIntro eyebrow={overview.stage} title={profile.name} lede={overview.decision} />
      <Panel>
        <h2 className="text-lg font-semibold">რატომ ასე</h2>
        <p className="mt-3 text-[15px] leading-7 text-muted">{overview.because}</p>
        <Link to={{ name: "app", page: "analysis" }} className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-accent">
          სრული ანალიზი <Icon name="arrow" size={16} />
        </Link>
      </Panel>
      <Panel>
        <h2 className="text-lg font-semibold">პირველი ნაბიჯები</h2>
        <ol className="mt-4 space-y-4">
          {plan.slice(0, 3).map((step, index) => (
            <li key={step.id} className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-soft text-[13px] font-semibold text-accent">{index + 1}</span>
              <div>
                <p className="font-medium leading-6">{step.title}</p>
                <p className="mt-1 text-[13px] leading-5 text-muted">
                  {step.timeline} · {step.budget}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <Link to={{ name: "app", page: "plan" }} className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-accent">
          სრული გეგმა <Icon name="arrow" size={16} />
        </Link>
      </Panel>
      <Panel>
        <h2 className="text-lg font-semibold">შედეგი</h2>
        <p className="mt-3 text-[15px] leading-7">{performance.teaser}</p>
        <Link to={{ name: "app", page: "performance" }} className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-accent">
          შედეგების შეფასება <Icon name="arrow" size={16} />
        </Link>
      </Panel>
    </>
  );
}
