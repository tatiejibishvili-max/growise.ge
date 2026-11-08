import { PageIntro, Panel } from "../components/ui.tsx";
import type { Workspace } from "../types.ts";

const fields = [
  ["არხი", "channel"],
  ["რესურსი", "resources"],
  ["ბიუჯეტი", "budget"],
  ["მიზანი", "objective"],
  ["ვადა", "timeline"],
] as const;

export function PlanPage({ workspace }: { workspace: Workspace }) {
  return (
    <>
      <PageIntro title="მარკეტინგული გეგმა" lede={workspace.planIntro} />
      <Panel>
        {workspace.plan.map((step) => (
          <article key={step.id} className="border-t border-line py-5 first:border-t-0 first:pt-0 last:pb-0">
            <p className="text-[13px] font-medium text-accent">{step.priority}</p>
            <h2 className="mt-1 text-[16px] font-semibold leading-6">{step.title}</h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              {fields.map(([label, key]) => (
                <div key={key}>
                  <dt className="text-[13px] text-muted">{label}</dt>
                  <dd className="mt-0.5 text-[15px] leading-6">{step[key]}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </Panel>
    </>
  );
}
