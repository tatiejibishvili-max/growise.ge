import { ordersFieldLabel } from "./labels.ts";
import type { BusinessProfile, DerivedPoint, MetricNumbers, Objective, PerformanceDraft, PerformanceFigure, PerformanceModel } from "./types.ts";

export const emptyDraft: PerformanceDraft = {
  period: "",
  spendGel: "",
  inquiries: "",
  newCustomers: "",
  revenueGel: "",
  orders: "",
  reach: "",
};

export function parseAmount(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(/\s/g, "").replace(",", "."));
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

export function amountError(value: string): string | null {
  if (!value.trim()) return null;
  return parseAmount(value) === null ? "ჩაწერე ნული ან დადებითი რიცხვი" : null;
}

export function formatCount(n: number): string {
  return new Intl.NumberFormat("ka-GE", {
    maximumFractionDigits: Number.isInteger(n) ? 0 : 1,
  }).format(n);
}

export function formatGel(n: number): string {
  const digits = Number.isInteger(n) ? 0 : 2;
  const text = new Intl.NumberFormat("ka-GE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
  return `${text} ლარი`;
}

export function formatRatio(n: number): string {
  return new Intl.NumberFormat("ka-GE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function budgetLabel(amount: number): string {
  if (amount <= 0) return "გამოყოფილი ბიუჯეტი არ აქვს";
  return `თვეში ${formatGel(amount)}`;
}

export function numbersFromDraft(draft: PerformanceDraft): MetricNumbers {
  return {
    spendGel: parseAmount(draft.spendGel),
    inquiries: parseAmount(draft.inquiries),
    newCustomers: parseAmount(draft.newCustomers),
    revenueGel: parseAmount(draft.revenueGel),
    orders: parseAmount(draft.orders),
    reach: parseAmount(draft.reach),
  };
}

export function derivedPoints(input: MetricNumbers): DerivedPoint[] {
  const points: DerivedPoint[] = [];

  if (input.spendGel !== null && input.newCustomers !== null && input.newCustomers > 0) {
    points.push({
      label: "ერთი ახალი კლიენტის ღირებულება",
      value: formatGel(input.spendGel / input.newCustomers),
      note: `დაშვება: ${formatCount(input.newCustomers)} ახალი კლიენტი სრულად ამ სარეკლამო ხარჯს უკავშირდება. თუ ნაწილი სხვა გზით მოვიდა, რეალური ღირებულება უფრო მაღალია.`,
    });
  }

  if (input.spendGel !== null && input.revenueGel !== null && input.spendGel > 0) {
    points.push({
      label: "გაყიდვებიდან შემოსავალი / სარეკლამო ხარჯი",
      value: `${formatRatio(input.revenueGel / input.spendGel)}-ჯერ`,
      note: "ეს მოგება არ არის. არც დადასტურებული კამპანიის უკუგებაა, სანამ არ ჩანს, შემოსავლის რა წილი მოდის სწორედ ამ რეკლამიდან.",
    });
  }

  if (input.inquiries !== null && input.newCustomers !== null && input.inquiries > 0) {
    points.push({
      label: "მოთხოვნიდან კლიენტად გადასვლა",
      value: `${Math.round((input.newCustomers / input.inquiries) * 100)}%`,
      note: "ეს წილი მაშინ იკითხება, როცა მოთხოვნები და ახალი კლიენტები ერთ პერიოდს და ერთ წყაროს ეკუთვნის.",
    });
  }

  return points;
}

function needsSales(objective: Objective): boolean {
  return objective !== "awareness";
}

function needsAwareness(objective: Objective): boolean {
  return objective === "awareness" || objective === "presence";
}

export function missingMetrics(objective: Objective, input: MetricNumbers): string[] {
  const missing: string[] = [];

  if (needsSales(objective)) {
    if (input.spendGel === null) missing.push("სარეკლამო ხარჯი");
    if (input.inquiries === null) missing.push("მოთხოვნების რაოდენობა");
    if (input.orders === null) missing.push(ordersFieldLabel(objective));
    if (input.newCustomers === null) missing.push("ახალი კლიენტები");
    if (input.revenueGel === null) missing.push("გაყიდვებიდან შემოსავალი");
  }

  if (needsAwareness(objective)) {
    if (input.reach === null) missing.push("მოცულობა");
    missing.push("ჩვენებები, ჩართულობა და აუდიტორიის ზრდა. ამ პროტოტიპში კაბინეტიდან არ შემოდის");
  }

  return missing;
}

function figuresFrom(input: MetricNumbers, objective: Objective): PerformanceFigure[] {
  const figures: PerformanceFigure[] = [];
  if (input.spendGel !== null) figures.push({ label: "სარეკლამო ხარჯი", value: formatGel(input.spendGel) });
  if (input.inquiries !== null) figures.push({ label: "მოთხოვნა", value: formatCount(input.inquiries) });
  if (input.orders !== null) figures.push({ label: ordersFieldLabel(objective), value: formatCount(input.orders) });
  if (input.newCustomers !== null) figures.push({ label: "ახალი კლიენტი", value: formatCount(input.newCustomers) });
  if (input.revenueGel !== null) figures.push({ label: "გაყიდვებიდან შემოსავალი", value: formatGel(input.revenueGel) });
  if (input.reach !== null) figures.push({ label: "მოცულობა", value: formatCount(input.reach) });
  return figures;
}

export function performanceFromDraft(profile: BusinessProfile, draft: PerformanceDraft): PerformanceModel {
  const numbers = numbersFromDraft(draft);
  const figures = figuresFrom(numbers, profile.objective);
  const derived = derivedPoints(numbers);
  const missing = missingMetrics(profile.objective, numbers);
  const period = draft.period.trim();
  const hasEntry = figures.length > 0;

  const zeroCustomers =
    numbers.newCustomers === 0 && numbers.spendGel !== null
      ? " ახალი კლიენტი ნულია, ამიტომ ერთი კლიენტის ღირებულება ვერ დაითვლება."
      : "";

  const summary = hasEntry
    ? `${profile.name}: შეფასება მხოლოდ შენს მიერ შეყვანილ ციფრებს ეყრდნობა${period ? `, პერიოდი: ${period}` : ""}. ${derived.map((point) => `${point.label}: ${point.value}.`).join(" ")}${zeroCustomers} ცარიელი ველი ნიშნავს, რომ ციფრი არ გვაქვს. ნული მხოლოდ მაშინ ჩაწერე, თუ შედეგი ნამდვილად ნულია.`
    : "შედეგის შესაფასებლად ჯერ ბიზნესის ციფრებია საჭირო. Growise კაბინეტს ამ პროტოტიპში თავად ვერ კითხულობს.";

  const next = hasEntry
    ? [
        "შეადარე ეს პერიოდი მომდევნოს მას შემდეგ, რაც გეგმიდან ერთ კონკრეტულ ქმედებას შეცვლი.",
        "თუ მიზანი გაყიდვა ან ჯავშანია, ერთად გქირდება ხარჯი, მოთხოვნა, შეკვეთა, ახალი კლიენტი და შემოსავალი.",
      ]
    : ["ჩაწერე ის ციფრები, რომლებიც უკვე გაქვს. დანარჩენი ველები ცარიელი დატოვე."];

  return {
    state: hasEntry ? "ready" : "incomplete",
    badge: hasEntry ? "ბიზნესის ჩანაწერი" : "საჭიროა შენი ციფრები",
    teaser: hasEntry ? "შეფასება შენს ჩანაწერს ეყრდნობა, ამ ბრაუზერში." : "შედეგის ციფრები ჯერ არ არის შეყვანილი.",
    summary,
    next,
    figures,
    derived,
    missingTitle: "რა აკლია ამ მიზნის შესაფასებლად",
    missing,
    attribution:
      "შეყვანილი ციფრი ბიზნესის ჩანაწერია. ის თავისით არ ამტკიცებს, რომ გაყიდვა კონკრეტულმა რეკლამამ მოიტანა. კაბინეტი დაკავშირებული არ არის და სპეციალისტის ანგარიშიც არ შესულა.",
    businessSource: hasEntry
      ? "შეყვანილია ამ ბრაუზერში და მხოლოდ ამ მოწყობილობაზე ინახება."
      : "ჯერ არ არის შეყვანილი. გაყიდვის შესაფასებლად საჭიროა ხარჯი, მოთხოვნა, შეკვეთა, ახალი კლიენტი და შემოსავალი.",
    entry: true,
  };
}
