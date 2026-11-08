import { MarketingShell } from "../components/AppShell.tsx";
import { BulletList, buttonClass } from "../components/ui.tsx";
import { objectiveLabel } from "../labels.ts";
import { budgetLabel } from "../metrics.ts";
import { Link, useRoute } from "../router.tsx";
import { useBusiness } from "../store.tsx";
import type { BusinessProfile } from "../types.ts";

export function ChoosePage() {
  const { demos, custom, select } = useBusiness();
  const { go } = useRoute();

  function open(profile: BusinessProfile) {
    select(profile.id);
    go({ name: "app", page: "home" });
  }

  return (
    <MarketingShell
      action={
        <Link to={{ name: "register" }} className={buttonClass("secondary", "px-3 py-2")}>
          ახალი პროფილი
        </Link>
      }
    >
      <div className="mx-auto max-w-5xl px-4 py-10 lg:py-14">
        <div className="max-w-2xl">
          <h1 className="text-[1.75rem] font-semibold leading-tight sm:text-[2rem]">აირჩიე ბიზნესი</h1>
          <p className="mt-3 text-[15px] leading-7 text-muted">
            დემონსტრაციისთვის ორი განსხვავებული სიტუაციაა. ორივე მაშინვე იხსნება. შეგიძლია ახალი პროფილიც შეავსო.
          </p>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {demos.map((profile) => (
            <article key={profile.id} className="flex flex-col rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(29,28,43,0.04)] sm:p-6">
              <p className="text-[13px] font-medium text-accent">
                {profile.demoKey === "workshop" ? "საწყისი ეტაპი" : "უკვე მუშაობს ბაზარზე"}
              </p>
              <h2 className="mt-2 text-xl font-semibold">{profile.name}</h2>
              <p className="mt-1 text-[15px] text-muted">{profile.activity}</p>
              <p className="mt-3 text-[13px] text-muted">
                {objectiveLabel[profile.objective]} · {budgetLabel(profile.budgetGel)}
              </p>
              <div className="mt-4">
                <BulletList items={profile.situation} />
              </div>
              <button type="button" className={`${buttonClass("primary")} mt-6`} onClick={() => open(profile)}>
                ამ ბიზნესით გაგრძელება
              </button>
            </article>
          ))}
        </div>

        {custom.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-lg font-semibold">შენი პროფილები</h2>
            <div className="mt-4 grid gap-3">
              {custom.map((profile) => (
                <article key={profile.id} className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{profile.name}</p>
                    <p className="text-[14px] text-muted">{profile.activity}</p>
                  </div>
                  <button type="button" className={buttonClass("secondary")} onClick={() => open(profile)}>
                    გახსნა
                  </button>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <p className="mt-8 text-[15px] leading-7 text-muted">
          ორი ბარათი სადემონსტრაციო ბიზნესია.{" "}
          <Link to={{ name: "register" }} className="font-semibold text-accent">
            ახალი ბიზნესის შევსება
          </Link>
        </p>
      </div>
    </MarketingShell>
  );
}
