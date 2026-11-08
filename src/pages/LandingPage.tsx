import { MarketingShell } from "../components/AppShell.tsx";
import { buttonClass } from "../components/ui.tsx";
import { Link } from "../router.tsx";
import { useBusiness } from "../store.tsx";

const steps = [
  {
    title: "ბიზნესის სურათი",
    text: "ტიპი, არხები, გამოცდილება, მიზანი, ბიუჯეტი და ის, რისი კეთებაც შიგნით შეგიძლია.",
  },
  {
    title: "გადაწყვეტილება",
    text: "რა გააკეთო თავად, სად გეყოფა ხელსაწყო და სად გჭირდება ადამიანი.",
  },
  {
    title: "შეფასება",
    text: "ხარჯი, მოთხოვნა, კლიენტი და შემოსავალი, იმის ახსნით, რა არის გაზომილი და რა არის დაშვება.",
  },
];

export function LandingPage() {
  const { active } = useBusiness();

  return (
    <MarketingShell
      action={
        <Link to={{ name: "choose" }} className={buttonClass("primary", "px-3 py-2")}>
          დაიწყე ანალიზი
        </Link>
      }
    >
      <div className="mx-auto max-w-5xl px-4">
        <section className="grid items-end gap-10 py-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.8fr)] lg:py-20">
          <div className="max-w-2xl">
            <p className="text-[13px] font-medium text-accent">ვირტუალური მარკეტინგის მენეჯერი</p>
            <h1 className="mt-3 text-[2rem] font-semibold leading-[1.25] tracking-[-0.03em] sm:text-[2.6rem]">
              შენი ბიზნესის მარკეტინგი, სწორი გადაწყვეტილებებით.
            </h1>
            <p className="mt-4 text-[17px] leading-8 text-muted">
              Growise აანალიზებს შენს ბიზნესს, გეხმარება მარკეტინგული სტრატეგიის დაგეგმვაში და გირჩევს საჭირო რესურსებს.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to={{ name: "choose" }} className={buttonClass("primary")}>
                დაიწყე ბიზნესის ანალიზი
              </Link>
              <a href="#flow" className={buttonClass("secondary")}>
                როგორ მუშაობს
              </a>
            </div>
            {active ? (
              <p className="mt-4 text-sm text-muted">
                არჩეულია {active.name}.{" "}
                <Link to={{ name: "app", page: "home" }} className="font-semibold text-accent">
                  გახსენი
                </Link>
              </p>
            ) : null}
          </div>
          <aside className="rounded-2xl border border-line bg-white p-6 shadow-[0_8px_30px_rgba(29,28,43,0.04)]">
            <p className="text-sm font-semibold">ერთი გადაწყვეტილება, სამ ნაწილად</p>
            <ol className="mt-4 space-y-4">
              {["რა გჭირდება", "რომელი რესურსი გერგება", "მუშაობს თუ არა"].map((item, index) => (
                <li key={item} className="flex gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-soft text-[13px] font-semibold text-accent">
                    {index + 1}
                  </span>
                  <span className="pt-0.5 text-[15px] leading-6">{item}</span>
                </li>
              ))}
            </ol>
          </aside>
        </section>

        <section id="flow" className="border-t border-line py-12">
          <h2 className="text-xl font-semibold">რას აკეთებს Growise</h2>
          <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
            {steps.map((step, index) => (
              <article key={step.title} className="bg-white p-5">
                <p className="text-[13px] font-medium text-accent">ნაბიჯი {index + 1}</p>
                <h3 className="mt-2 text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-7 text-muted">{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="border-t border-line py-6 text-[13px] text-muted">Growise · სადემონსტრაციო პროტოტიპი</footer>
      </div>
    </MarketingShell>
  );
}
