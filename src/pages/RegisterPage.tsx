import { useState, type FormEvent, type ReactNode } from "react";
import { MarketingShell } from "../components/AppShell.tsx";
import { Button, fieldClass } from "../components/ui.tsx";
import { situationForNew } from "../engine.ts";
import { channelOptions, experienceOptions, objectiveOptions } from "../labels.ts";
import { Link, useRoute } from "../router.tsx";
import { useBusiness, type NewBusiness } from "../store.tsx";
import type { ChannelId, Experience, Objective } from "../types.ts";

interface FormState {
  name: string;
  activity: string;
  hasWebsite: boolean | null;
  channels: ChannelId[];
  experience: Experience | "";
  objective: Objective | "";
  budget: string;
  ownerDoesMarketing: boolean;
  hasDesigner: boolean;
}

const initial: FormState = {
  name: "",
  activity: "",
  hasWebsite: null,
  channels: [],
  experience: "",
  objective: "",
  budget: "",
  ownerDoesMarketing: true,
  hasDesigner: false,
};

export function RegisterPage() {
  const { register } = useBusiness();
  const { go } = useRoute();
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function toggleChannel(id: ChannelId) {
    setForm((current) => ({
      ...current,
      channels: current.channels.includes(id) ? current.channels.filter((item) => item !== id) : [...current.channels, id],
    }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "ჩაწერე ბიზნესის სახელი";
    if (!form.activity.trim()) next.activity = "ჩაწერე საქმიანობა";
    if (form.hasWebsite === null) next.website = "მიუთითე, გაქვთ თუ არა ვებსაიტი ან სხვა სოციალური პლატფორმა";
    if (!form.experience) next.experience = "აირჩიე გამოცდილება";
    if (!form.objective) next.objective = "აირჩიე მთავარი მიზანი";
    const budget = Number(form.budget);
    if (form.budget.trim() === "" || !Number.isFinite(budget) || budget < 0) {
      next.budget = "ჩაწერე თვიური ბიუჯეტი ლარებში. თუ არ გაქვს, ჩაწერე 0.";
    }
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      document.getElementById(`field-${first}`)?.focus();
      return;
    }
    if (form.hasWebsite === null || !form.experience || !form.objective) return;

    const input: NewBusiness = {
      name: form.name.trim(),
      activity: form.activity.trim(),
      hasWebsite: form.hasWebsite,
      channels: form.channels,
      experience: form.experience,
      objective: form.objective,
      budgetGel: budget,
      ownerDoesMarketing: form.ownerDoesMarketing,
      hasDesigner: form.hasDesigner,
      situation: situationForNew({
        hasWebsite: form.hasWebsite,
        channels: form.channels,
        ownerDoesMarketing: form.ownerDoesMarketing,
        hasDesigner: form.hasDesigner,
      }),
    };
    register(input);
    go({ name: "app", page: "business" });
  }

  return (
    <MarketingShell
      action={
        <Link to={{ name: "choose" }} className="text-sm font-semibold text-accent">
          დემო ბიზნესები
        </Link>
      }
    >
      <div className="mx-auto max-w-2xl px-4 py-10 lg:py-14">
        <h1 className="text-[1.75rem] font-semibold leading-tight sm:text-[2rem]">ახალი ბიზნესი</h1>
        <p className="mt-3 text-[15px] leading-7 text-muted">
          მოკლე პროფილი საკმარისია, რომ Growise-მ პირველი ანალიზი გამოიტანოს. ეს ჩანაწერი მხოლოდ ამ ბრაუზერში ინახება.
        </p>
        <form className="mt-8 space-y-6" onSubmit={submit} noValidate>
          <Field label="ბიზნესის სახელი" error={errors.name} id="field-name">
            <input id="field-name" className={fieldClass} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </Field>
          <Field label="საქმიანობა" error={errors.activity} id="field-activity">
            <input
              id="field-activity"
              className={fieldClass}
              value={form.activity}
              placeholder="მაგალითად, საცხობი ან სტომატოლოგიური კაბინეტი"
              onChange={(event) => setForm({ ...form, activity: event.target.value })}
            />
          </Field>
          <fieldset>
            <legend className="text-sm font-semibold">გაქვთ თუ არა ვებსაიტი ან სხვა სოციალური პლატფორმები</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {[
                { value: true, label: "კი" },
                { value: false, label: "არა" },
              ].map((option) => (
                <label key={option.label} className={choiceClass(form.hasWebsite === option.value)}>
                  <input
                    id={option.value ? "field-website" : undefined}
                    type="radio"
                    name="website"
                    checked={form.hasWebsite === option.value}
                    onChange={() => setForm({ ...form, hasWebsite: option.value })}
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {errors.website ? <ErrorText>{errors.website}</ErrorText> : null}
          </fieldset>
          <fieldset>
            <legend className="text-sm font-semibold">რომელი არხით მოდის ან ეძებს მომხმარებელი?</legend>
            <p className="mt-1 text-[13px] text-muted">შეგიძლია რამდენიმე მონიშნო. თუ არცერთი არ გაქვს, ცარიელი დატოვე.</p>
            <div className="mt-3 grid gap-2">
              {channelOptions.map((option) => (
                <label key={option.value} className={choiceClass(form.channels.includes(option.value))}>
                  <input type="checkbox" checked={form.channels.includes(option.value)} onChange={() => toggleChannel(option.value)} />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-semibold">მარკეტინგის გამოცდილება</legend>
            <div className="mt-3 grid gap-2">
              {experienceOptions.map((option, index) => (
                <label key={option.value} className={choiceClass(form.experience === option.value)}>
                  <input
                    id={index === 0 ? "field-experience" : undefined}
                    type="radio"
                    name="experience"
                    checked={form.experience === option.value}
                    onChange={() => setForm({ ...form, experience: option.value })}
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {errors.experience ? <ErrorText>{errors.experience}</ErrorText> : null}
          </fieldset>
          <fieldset>
            <legend className="text-sm font-semibold">მთავარი მიზანი</legend>
            <div className="mt-3 grid gap-2">
              {objectiveOptions.map((option, index) => (
                <label key={option.value} className={choiceClass(form.objective === option.value)}>
                  <input
                    id={index === 0 ? "field-objective" : undefined}
                    type="radio"
                    name="objective"
                    checked={form.objective === option.value}
                    onChange={() => setForm({ ...form, objective: option.value })}
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {errors.objective ? <ErrorText>{errors.objective}</ErrorText> : null}
          </fieldset>
          <Field label="თვიური მარკეტინგის ბიუჯეტი, ლარი" error={errors.budget} id="field-budget">
            <input
              id="field-budget"
              className={fieldClass}
              inputMode="decimal"
              value={form.budget}
              placeholder="მაგალითად 400"
              onChange={(event) => setForm({ ...form, budget: event.target.value })}
            />
            <p className="mt-1 text-[13px] text-muted">თუ გამოყოფილი თანხა არ გაქვს, ჩაწერე 0.</p>
          </Field>
          <Button type="submit">პროფილის შენახვა</Button>
        </form>
      </div>
    </MarketingShell>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block" htmlFor={id}>
      <span className="text-sm font-semibold">{label}</span>
      <div className="mt-2">{children}</div>
      {error ? <ErrorText>{error}</ErrorText> : null}
    </label>
  );
}

function ErrorText({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-[13px] text-warn">{children}</p>;
}

function choiceClass(selected: boolean): string {
  return `flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-[15px] leading-6 ${selected ? "border-accent bg-soft" : "border-line bg-white"}`;
}
