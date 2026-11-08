import { useState } from "react";
import { Badge, PageIntro, Panel } from "../components/ui.tsx";
import { commercial } from "../commercial.ts";
import { stanceLabel } from "../labels.ts";
import type { ResourceCard, Workspace } from "../types.ts";

export function ResourcesPage({ workspace }: { workspace: Workspace }) {
  const { resources } = workspace;
  const [interest, setInterest] = useState<Record<string, boolean>>({});

  return (
    <>
      <PageIntro title="რესურსები" lede={resources.intro} />
      <ResourceGroup title="ხელოვნური ინტელექტის ხელსაწყოები" note="იაფი ან უფასო ხელსაწყო, სანამ ფასიან სპეციალისტზე გადახვალ." cards={resources.tools} interest={interest} onInterest={setInterest} />
      <ResourceGroup title="ფრილანსერები" note={resources.freelancerNote} cards={resources.freelancers} interest={interest} onInterest={setInterest} allowInterest />
      <ResourceGroup title="სააგენტოები" note={resources.agencyNote} cards={resources.agencies} interest={interest} onInterest={setInterest} allowInterest />
      <Panel>
        <h2 className="text-lg font-semibold">როგორ რჩება Growise ნეიტრალური</h2>
        <p className="mt-3 text-[15px] leading-7 text-muted">{commercial.neutral}</p>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold">უფასოდ, ამ პროტოტიპშიც</h3>
            <ul className="mt-2 space-y-1 text-[15px] leading-6 text-muted">
              {commercial.free.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">ფასიანი AI, მოგვიანებით</h3>
            <ul className="mt-2 space-y-1 text-[15px] leading-6 text-muted">
              {commercial.paidLater.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-5 text-[15px] leading-7 text-muted">{commercial.freelancer}</p>
        <p className="mt-2 text-[15px] leading-7 text-muted">{commercial.agency}</p>
        <p className="mt-4 text-[13px] leading-6 text-muted">გადახდა ამ პროტოტიპში არ ირთვება. ანალიზი, გეგმა და შეფასება სრულად იხსნება.</p>
      </Panel>
    </>
  );
}

function ResourceGroup({
  title,
  note,
  cards,
  interest,
  onInterest,
  allowInterest = false,
}: {
  title: string;
  note: string;
  cards: ResourceCard[];
  interest: Record<string, boolean>;
  onInterest: (next: Record<string, boolean>) => void;
  allowInterest?: boolean;
}) {
  return (
    <Panel>
      <h2 className="text-lg font-semibold">{title}</h2>
      {note ? <p className="mt-2 text-[15px] leading-7 text-muted">{note}</p> : null}
      <ul className="mt-5 space-y-5">
        {cards.map((card) => (
          <li key={card.id} className="border-t border-line pt-5 first:border-t-0 first:pt-0">
            <div className="flex flex-wrap gap-2">
              <Badge tone={card.stance === "skip" ? "warn" : card.stance === "use" ? "accent" : "neutral"}>{stanceLabel[card.stance]}</Badge>
              {card.demo ? <Badge>გამოგონილი დემო</Badge> : null}
            </div>
            <h3 className="mt-2 text-[16px] font-semibold">{card.name}</h3>
            <p className="mt-2 text-[15px] leading-7 text-muted">{card.detail}</p>
            <p className="mt-2 text-[15px] leading-7">{card.fit}</p>
            <p className="mt-2 text-[13px]">ღირებულება: {card.cost}</p>
            {card.href ? (
              <a href={card.href} target="_blank" rel="noreferrer" className="mt-3 inline-block text-[14px] font-semibold text-accent">
                საიტის გახსნა
              </a>
            ) : null}
            {allowInterest && card.stance !== "skip" ? (
              <div className="mt-3">
                <button
                  type="button"
                  className="text-[14px] font-semibold text-accent"
                  onClick={() => onInterest({ ...interest, [card.id]: true })}
                >
                  ინტერესის დაფიქსირება
                </button>
                {interest[card.id] ? (
                  <p className="mt-2 text-[13px] leading-6 text-muted">
                    დემო პროტოტიპში შეკვეთა არ იგზავნება. რეალურ ვერსიაში აქ გაიხსნებოდა მოთხოვნა, საკომისიო კი სპეციალისტის ანაზღაურებიდან ჩამოიჭრებოდა.
                  </p>
                ) : null}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
