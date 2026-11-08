import { BulletList, PageIntro, Panel } from "../components/ui.tsx";
import type { Workspace } from "../types.ts";

export function AnalysisPage({ workspace }: { workspace: Workspace }) {
  const { analysis } = workspace;

  return (
    <>
      <PageIntro eyebrow={analysis.maturityTitle} title="ბიზნესის ანალიზი" lede={analysis.conclusion} />
      <p className="text-[13px] leading-6 text-muted">ანალიზი ბიზნესის პროფილს ეყრდნობა. სარეკლამო კაბინეტები ამ პროტოტიპში არ იკითხება.</p>
      <Panel className="space-y-6">
        <Block title="ციფრული არსებობა" kicker={analysis.presenceTitle} body={analysis.presenceBody} />
        <Block title="მარკეტინგის მზაობა" kicker={analysis.maturityTitle} body={analysis.maturityBody} />
        <div>
          <h2 className="text-base font-semibold">სამიზნე აუდიტორია</h2>
          <div className="mt-3">
            <BulletList items={analysis.audience} />
          </div>
        </div>
        <Block title="მიზანი" body={analysis.goalsBody} />
        <Block title="რესურსი და ბიუჯეტი" body={analysis.resourcesBody} />
        <div>
          <h2 className="text-base font-semibold">მთავარი სირთულე</h2>
          <div className="mt-3">
            <BulletList items={analysis.challenges} />
          </div>
        </div>
      </Panel>
      <div className="grid gap-4 md:grid-cols-2">
        <Panel>
          <h2 className="text-base font-semibold">ძლიერი მხარე</h2>
          <div className="mt-3">
            <BulletList items={analysis.strengths} />
          </div>
        </Panel>
        <Panel>
          <h2 className="text-base font-semibold">სუსტი მხარე</h2>
          <div className="mt-3">
            <BulletList items={analysis.weaknesses} />
          </div>
        </Panel>
      </div>
    </>
  );
}

function Block({ title, kicker, body }: { title: string; kicker?: string; body: string }) {
  return (
    <div>
      <h2 className="text-base font-semibold">{title}</h2>
      {kicker ? <p className="mt-2 text-[15px] font-medium">{kicker}</p> : null}
      <p className="mt-2 text-[15px] leading-7 text-muted">{body}</p>
    </div>
  );
}
