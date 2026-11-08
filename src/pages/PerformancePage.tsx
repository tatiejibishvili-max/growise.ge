import { Badge, BulletList, PageIntro, Panel } from "../components/ui.tsx";
import { ordersFieldLabel } from "../labels.ts";
import { amountError, emptyDraft } from "../metrics.ts";
import { adPlatforms, specialistReport } from "../platform.ts";
import { draftFor, useBusiness } from "../store.tsx";
import type { PerformanceDraft, Workspace } from "../types.ts";

export function PerformancePage({ workspace }: { workspace: Workspace }) {
  const { profile, performance } = workspace;
  const { drafts, updateDraft } = useBusiness();
  const draft = draftFor(drafts, profile.id);
  const report = specialistReport();
  const tone = performance.state === "simulated" || performance.state === "unavailable" ? "warn" : performance.state === "ready" ? "accent" : "neutral";

  function update(field: keyof PerformanceDraft, value: string) {
    updateDraft(profile.id, { ...draft, [field]: value });
  }

  return (
    <>
      <div className="space-y-3">
        <Badge tone={tone}>{performance.badge}</Badge>
        <PageIntro title="შედეგების შეფასება" lede={performance.teaser} />
      </div>

      {performance.entry ? (
        <Panel>
          <h2 className="text-lg font-semibold">ბიზნესის ჩანაწერი</h2>
          <p className="mt-2 text-[15px] leading-7 text-muted">
            ცარიელი ველი ნიშნავს „არ ვიცი“. ნული მხოლოდ მაშინ ჩაწერე, თუ შედეგი ნამდვილად ნულია. ციფრები ამ ბრაუზერში რჩება.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="პერიოდი" value={draft.period} onChange={(value) => update("period", value)} placeholder="მაგალითად, ბოლო 30 დღე" />
            <Field label="სარეკლამო ხარჯი, ლარი" value={draft.spendGel} onChange={(value) => update("spendGel", value)} numeric />
            <Field label="მოთხოვნა" value={draft.inquiries} onChange={(value) => update("inquiries", value)} numeric />
            <Field label={ordersFieldLabel(profile.objective)} value={draft.orders} onChange={(value) => update("orders", value)} numeric />
            <Field label="ახალი კლიენტი" value={draft.newCustomers} onChange={(value) => update("newCustomers", value)} numeric />
            <Field label="გაყიდვებიდან შემოსავალი, ლარი" value={draft.revenueGel} onChange={(value) => update("revenueGel", value)} numeric />
            <Field label="მოცულობა" value={draft.reach} onChange={(value) => update("reach", value)} numeric hint="ცნობადობისთვის. თუ არ იცი, ცარიელი დატოვე." />
          </div>
          <button type="button" className="mt-4 text-sm font-medium text-muted" onClick={() => updateDraft(profile.id, emptyDraft)}>
            ციფრების გასუფთავება
          </button>
        </Panel>
      ) : null}

      {performance.figures.length > 0 ? (
        <Panel>
          <h2 className="text-lg font-semibold">ციფრები</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            {performance.figures.map((figure) => (
              <div key={figure.label} className="rounded-xl bg-canvas px-4 py-3">
                <dt className="text-[13px] text-muted">{figure.label}</dt>
                <dd className="mt-1 text-xl font-semibold tracking-[-0.03em]">{figure.value}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      ) : null}

      {performance.derived.length > 0 ? (
        <Panel className="space-y-5">
          <h2 className="text-lg font-semibold">რა გამოდის ამ ციფრებიდან</h2>
          {performance.derived.map((point) => (
            <div key={point.label}>
              <p className="text-[13px] text-muted">{point.label}</p>
              <p className="mt-1 text-xl font-semibold tracking-[-0.03em]">{point.value}</p>
              <p className="mt-2 text-[15px] leading-7 text-muted">{point.note}</p>
            </div>
          ))}
        </Panel>
      ) : null}

      <Panel>
        <h2 className="text-lg font-semibold">Growise-ის წაკითხვა</h2>
        <p className="mt-3 text-[15px] leading-7">{performance.summary}</p>
        <p className="mt-3 text-[15px] leading-7 text-muted">{performance.attribution}</p>
        <h3 className="mt-6 text-sm font-semibold">შემდეგი ნაბიჯი</h3>
        <div className="mt-3">
          <BulletList items={performance.next} />
        </div>
      </Panel>

      <Panel>
        <h2 className="text-lg font-semibold">{performance.missingTitle}</h2>
        <div className="mt-4">
          <BulletList items={performance.missing} />
        </div>
      </Panel>

      <Panel>
        <h2 className="text-lg font-semibold">მონაცემის წყაროები</h2>
        <p className="mt-2 text-[15px] leading-7 text-muted">
          შედეგი სამი წყაროდან შეიძლება მოვიდეს. ამ პროტოტიპში პირველი ორი არ მუშაობს. Growise არ ამბობს, რომ გაყიდვა ყოველთვის ერთ კამპანიას მიეწერება.
        </p>
        <div className="mt-5 space-y-5">
          <SourceBlock title="გარე პლატფორმები" rows={adPlatforms().map((item) => ({ id: item.id, name: item.name, status: item.status, detail: item.detail }))} />
          <SourceBlock title="ფრილანსერი და სააგენტო" rows={[{ id: report.id, name: report.name, status: report.status, detail: report.detail }]} />
          <SourceBlock title="ბიზნესის ჩანაწერი" rows={[{ id: "business", name: profile.name, status: performance.badge, detail: performance.businessSource }]} />
        </div>
      </Panel>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  numeric = false,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  numeric?: boolean;
  placeholder?: string;
  hint?: string;
}) {
  const error = numeric ? amountError(value) : null;
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-muted">{label}</span>
      <input
        className="mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-accent"
        inputMode={numeric ? "decimal" : "text"}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint ? <span className="mt-1 block text-[13px] text-muted">{hint}</span> : null}
      {error ? <span className="mt-1 block text-[13px] text-warn">{error}</span> : null}
    </label>
  );
}

function SourceBlock({ title, rows }: { title: string; rows: { id: string; name: string; status: string; detail: string }[] }) {
  return (
    <section>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-2 space-y-3">
        {rows.map((row) => (
          <li key={row.id}>
            <p className="text-[15px] font-medium">{row.name}</p>
            <p className="text-[13px] text-accent">{row.status}</p>
            <p className="text-[14px] leading-6 text-muted">{row.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
