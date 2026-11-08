import { workshopWorkspace, salonWorkspace } from "./data/demos.ts";
import { channelLabel, objectiveLabel } from "./labels.ts";
import { budgetLabel, formatGel, performanceFromDraft } from "./metrics.ts";
import type {
  BusinessProfile,
  ChannelId,
  PerformanceDraft,
  PlanStep,
  Recommendation,
  RecTiming,
  ResourceCard,
  Workspace,
} from "./types.ts";

const digitalChannels: ChannelId[] = ["instagram", "facebook", "tiktok", "google_ads"];

function hasDigital(profile: BusinessProfile): boolean {
  return profile.hasWebsite || profile.channels.some((channel) => channel !== "word_of_mouth");
}

function stageOf(profile: BusinessProfile): "start" | "optimize" {
  if (profile.experience === "active_unmeasured" || hasDigital(profile)) return "optimize";
  return "start";
}

function freelancerTiming(profile: BusinessProfile, stage: "start" | "optimize"): RecTiming {
  if (!profile.ownerDoesMarketing && profile.budgetGel >= 300) return "next";
  if (stage === "start" && profile.budgetGel >= 250) return "later";
  if (stage === "optimize") return "later";
  return "not_now";
}

function agencyTiming(profile: BusinessProfile, stage: "start" | "optimize"): RecTiming {
  if (stage === "optimize" && profile.budgetGel >= 2000) return "later";
  return "not_now";
}

export function situationForNew(input: {
  hasWebsite: boolean;
  channels: ChannelId[];
  ownerDoesMarketing: boolean;
  hasDesigner: boolean;
}): string[] {
  const digital = input.hasWebsite || input.channels.some((channel) => channel !== "word_of_mouth");
  const lines = [
    digital
      ? "ციფრული არხი უკვე აქვს. ანალიზი აქედან იწყება."
      : "ციფრული არხი ჯერ არ აქვს. მომხმარებელი სხვა გზით მოდის.",
    input.ownerDoesMarketing
      ? "პირველ ნაბიჯებს მფლობელი თავად გააკეთებს."
      : "მფლობელს მარკეტინგის საქმე თავად არ მიჰყავს.",
  ];
  if (!input.hasDesigner) lines.push("დიზაინერი არ ჰყავს, ამიტომ ვიზუალი მარტივი უნდა დარჩეს.");
  return lines;
}

function channelSummary(profile: BusinessProfile): string {
  if (profile.channels.length === 0) return "მითითებული არხი არ არის";
  return profile.channels.map((channel) => channelLabel[channel]).join(", ");
}

function buildRecommendations(profile: BusinessProfile, stage: "start" | "optimize"): Recommendation[] {
  const budget = budgetLabel(profile.budgetGel);
  const items: Recommendation[] = [];

  if (stage === "start") {
    items.push(
      {
        id: "audience",
        kind: "self",
        timing: "now",
        title: "ვინ ყიდულობს დღეს: ორი ჯგუფის ჩამოწერა",
        why: `„${profile.activity}“ ჯერ კონკრეტულ ადამიანზე არ არის მიმართული. ჩამოწერე, ვინ იყიდა ბოლოს და რისთვის. ეს ფულს არ ითხოვს.`,
        budget: "0 ლარი",
      },
      {
        id: "presence",
        kind: "self",
        timing: "now",
        title: profile.hasWebsite ? "არსებულ გვერდზე ერთი მკაფიო შეთავაზება" : "ბიზნეს გვერდი და რამდენიმე ფოტო",
        why: profile.hasWebsite
          ? "გვერდი უკვე არის. ჯერ ერთი გასაგები შეთავაზება უნდა გამოჩნდეს, სანამ ახალ არხს გახსნი."
          : "ბიზნესი ძიებაში და რუკაზე უნდა მოიძებნოს. ეს ვებსაიტზე იაფი და სწრაფი პირველი ნაბიჯია.",
        budget: "0 ლარი",
      },
      {
        id: "assistant",
        kind: "ai",
        timing: "now",
        title: "ტექსტის ასისტენტი მონახაზისთვის",
        why: "ასისტენტი გიწერს პოსტის მონახაზს და კითხვებს აუდიტორიისთვის. ფასს, ვადას და დაპირებას თავად ამოწმებ.",
        budget: "0 ლარი, თუ უფასო ლიმიტი გეყოფა",
      },
      {
        id: "rhythm",
        kind: "self",
        timing: "next",
        title: profile.channels.some((channel) => digitalChannels.includes(channel))
          ? "კვირაში ორი პოსტი უკვე არსებულ არხზე"
          : "კვირაში ორი პოსტი Instagram-ზე ან Facebook-ზე",
        why: "ერთი მშვიდი რიტმი საკმარისია. ფასიანი რეკლამა მანამდე არ იწყება, სანამ გვერდზე რეალური მასალა არ დგას.",
        budget: "0 ლარი",
      },
    );
  } else {
    const hasAds = profile.channels.includes("google_ads");
    items.push(
      {
        id: "track",
        kind: "self",
        timing: "now",
        title: hasAds ? "ერთი კამპანიის მოთხოვნების ჩანიშვნა" : "ყოველ მოთხოვნაზე წყაროს ჩანიშვნა",
        why: hasAds
          ? "რეკლამა უკვე გაქვს. ჯერ ერთი კამპანია გამოყავი და ჩაინიშნე, რამდენი მოთხოვნა და გაყიდვა მოჰყვა."
          : "არხი უკვე მუშაობს. აკლია ერთი ველი: საიდან მოვიდა კითხვა, ჯავშანი ან შეკვეთა.",
        budget: "0 ლარი",
      },
      {
        id: "review",
        kind: "self",
        timing: "now",
        title: "ბოლო 30 დღის გადახედვა შედეგის მიხედვით",
        why: "მოწონება და რეალური მომხმარებელი ერთი და იგივე არ არის. გამოყავი ის, რასაც კითხვა ან გაყიდვა მოჰყვა.",
        budget: "0 ლარი",
      },
      {
        id: "assistant",
        kind: "ai",
        timing: "next",
        title: "ერთი შეთავაზების რამდენიმე ვარიანტი",
        why: `ტექსტი „${profile.activity}“-ის ერთ კონკრეტულ შეთავაზებაზე გაიყოს. ასისტენტი წერს ვარიანტს, ფაქტს თავად ამოწმებ.`,
        budget: "0 ლარი, თუ უფასო ლიმიტი გეყოფა",
      },
      {
        id: "test",
        kind: "self",
        timing: "next",
        title: profile.budgetGel >= 150 ? "მცირე ტესტი ერთ შეთავაზებაზე" : "ერთი ორგანული შეთავაზება, ფასიანი ტესტის გარეშე",
        why:
          profile.budgetGel >= 150
            ? `ახალი ბიუჯეტი არ გჭირდება. ${budget} ჩარჩოდან მცირე ნაწილი ერთ შეთავაზებას შეადარე დანარჩენ ხარჯს.`
            : "გამოყოფილი თანხა ფასიან ტესტს არ ერგება. ჯერ ერთი შეთავაზება გამოაქვეყნე და ჩაინიშნე, მოჰყვა თუ არა მოთხოვნა.",
        budget: profile.budgetGel >= 150 ? "მცირე წილი არსებული ბიუჯეტიდან" : "0 ლარი",
      },
    );
  }

  const freelancer = freelancerTiming(profile, stage);
  items.push({
    id: "freelancer",
    kind: "freelancer",
    timing: freelancer,
    title: stage === "start" ? "ერთჯერადი დახმარება განხორციელებაზე" : "დახმარება მხოლოდ გაზომვის სტრუქტურაზე",
    why:
      freelancer === "not_now"
        ? "ჯერ უფასო ნაბიჯები გეყოფა. ფრილანსერი მაშინ დაბრუნდება, თუ ამ საქმეს თავად ვერ ასრულებ და ცალკე თანხას გამოყოფ."
        : freelancer === "next"
          ? "მარკეტინგს თავად არ უძღვები, ამიტომ პირველი უფასო ჩარჩოს შემდეგ ერთჯერადი დახმარება გამართლებულია. სააგენტო მაინც არ არის პირველი არჩევანი."
          : "სპეციალისტი პირველი ნაბიჯი არ არის. ის მაშინ გჭირდება, თუ ჩანაწერს ან მარტივ გვერდს თავად ვერ აწყობ.",
    budget:
      freelancer === "not_now"
        ? "ახლა არ ჯდება"
        : profile.budgetGel >= 800
          ? "საორიენტაციოდ, ერთი თვე ან ერთჯერადი სამუშაო. ზუსტი ფასი შეთავაზების შემდეგ დგინდება."
          : "მიმდინარე ბიუჯეტში არ ჯდება. მხოლოდ ცალკე გამოყოფილი თანხით.",
  });

  const agency = agencyTiming(profile, stage);
  items.push({
    id: "agency",
    kind: "agency",
    timing: agency,
    title: "მარკეტინგული სააგენტო",
    why:
      agency === "later"
        ? "ბიუჯეტი სააგენტოს ზღვარს უახლოვდება, მაგრამ პირველი საქმე მაინც გაზომვაა. სააგენტო მას შემდეგ განიხილება, რაც გამოჩნდება, რას მოაქვს შედეგი."
        : stage === "start"
          ? `ბიზნესი ახლა იწყებს მარკეტინგს და ბიუჯეტი ${budget}. სააგენტო არც ეტაპს ერგება და არც ამ ჩარჩოს. გადაწყვეტილება საკომისიოზე არ დგას.`
          : "არხი უკვე გაქვს. ჯერ შედეგი უნდა დაინახო. სააგენტო მაშინაა საუბრის თემა, როცა ბიუჯეტი და ამოცანა ამას გაუტოლდება.",
    budget: agency === "later" ? "მხოლოდ მას შემდეგ, რაც გაზომვა დადგება" : "არ არის რეკომენდებული",
  });

  return items;
}

function buildPlan(profile: BusinessProfile, stage: "start" | "optimize"): { intro: string; steps: PlanStep[] } {
  if (stage === "start") {
    return {
      intro: `გეგმა „${profile.activity}“-ის პირველ ყოფნაზე დგას. რეკლამა იწყება მას შემდეგ, რაც გვერდზე რეალური მასალა გამოჩნდება.`,
      steps: [
        {
          id: "p1",
          priority: "პრიორიტეტი 1",
          title: "ორი სამიზნე ჯგუფის ჩამოწერა",
          channel: "შიდა სამუშაო",
          resources: "მფლობელი და ტექსტის ასისტენტი კითხვებისთვის",
          budget: "0 ლარი",
          objective: "გაირკვეს, ვინ ყიდულობს დღეს და რისთვის",
          timeline: "პირველი კვირა",
        },
        {
          id: "p2",
          priority: "პრიორიტეტი 1",
          title: profile.hasWebsite ? "ერთი მკაფიო შეთავაზება არსებულ გვერდზე" : "ბიზნეს გვერდი",
          channel: profile.hasWebsite ? "ვებსაიტი" : "სოციალური პლატფორმა",
          resources: "მფლობელი",
          budget: "0 ლარი",
          objective: profile.hasWebsite ? "გვერდზე ერთი გასაგები შეთავაზება გამოჩნდეს" : "ბიზნესი მოიძებნოს რუკაზე და ძიებაში",
          timeline: "პირველი კვირა",
        },
        {
          id: "p3",
          priority: "პრიორიტეტი 2",
          title: `კვირაში ორი პოსტი: ${profile.activity}`,
          channel: "Instagram ან Facebook",
          resources: "საკუთარი ფოტო, ვიზუალის ხელსაწყო, ტექსტის მონახაზი",
          budget: "0 ლარი",
          objective: "ოთხი კვირის განმავლობაში რვა გასაგები პოსტი",
          timeline: "მე-2 კვირიდან მე-4 კვირამდე",
        },
        {
          id: "p4",
          priority: "პრიორიტეტი 2",
          title: "ყოველი შეკვეთის წყაროს ჩანიშვნა",
          channel: "შიდა აღრიცხვა",
          resources: "მარტივი ცხრილი",
          budget: "0 ლარი",
          objective: "გამოჩნდეს, შეკვეთა ნაცნობით მოვიდა თუ ახალი არხიდან",
          timeline: "პირველივე შეკვეთიდან",
        },
      ],
    };
  }

  return {
    intro: `გეგმა ახალ არხს არ ხსნის. „${profile.activity}“-ის არსებულ აქტივობას უმატებს წყაროს ჩანაწერს და ერთ გამიზნულ შეთავაზებას.`,
    steps: [
      {
        id: "p1",
        priority: "პრიორიტეტი 1",
        title: "მოთხოვნის წყაროს ჩანიშვნა",
        channel: "შიდა აღრიცხვა",
        resources: "მფლობელი და მარტივი ცხრილი",
        budget: "0 ლარი",
        objective: "ყოველ მოთხოვნაზე ერთი წყარო: პოსტი, რეკლამა, რეკომენდაცია ან სხვა",
        timeline: "დღესვე, ჩვევისთვის 2 კვირა",
      },
      {
        id: "p2",
        priority: "პრიორიტეტი 1",
        title: "ბოლო 30 დღის გადახედვა",
        channel: channelSummary(profile),
        resources: "მფლობელი",
        budget: "0 ლარი",
        objective: "გამოიყოს ის, რასაც მოთხოვნა მოჰყვა, არა მხოლოდ მოწონება",
        timeline: "1 კვირა",
      },
      {
        id: "p3",
        priority: "პრიორიტეტი 2",
        title: "ერთი შეთავაზების ტესტი",
        channel: channelSummary(profile),
        resources: "ტექსტის ასისტენტი და მფლობელი",
        budget: profile.budgetGel >= 150 ? "მცირე წილი არსებული ბიუჯეტიდან" : "0 ლარი",
        objective: `გაირკვეს, „${profile.activity}“-ის ეს შეთავაზება მოთხოვნას იძლევა თუ მხოლოდ ყურადღებას`,
        timeline: "მე-3 კვირიდან მე-4 კვირამდე",
      },
      {
        id: "p4",
        priority: "პრიორიტეტი 2",
        title: "ყოველკვირეული მოკლე შეჯამება",
        channel: "შიდა აღრიცხვა",
        resources: "მფლობელი",
        budget: "0 ლარი",
        objective: "ერთ გვერდზე ჩანდეს ხარჯი, მოთხოვნა, ახალი კლიენტი და შემოსავალი",
        timeline: "ყოველ კვირას, დაახლოებით 20 წუთი",
      },
    ],
  };
}

function stanceFrom(timing: RecTiming): "optional" | "skip" {
  return timing === "not_now" ? "skip" : "optional";
}

function buildResources(profile: BusinessProfile, stage: "start" | "optimize", recommendations: Recommendation[]) {
  const freelancer = recommendations.find((item) => item.kind === "freelancer");
  const agency = recommendations.find((item) => item.kind === "agency");
  const freelancerStance = stanceFrom(freelancer?.timing ?? "not_now");
  const agencyStance = stanceFrom(agency?.timing ?? "not_now");
  const visualStance = profile.hasDesigner ? "skip" : stage === "start" ? "use" : "optional";

  const tools: ResourceCard[] = [
    {
      id: "tool-text",
      name: "ტექსტის ასისტენტი",
      detail: "პოსტის და შეთავაზების მონახაზი. მაგალითია ChatGPT ან სხვა მსგავსი სერვისი. Growise-ის პარტნიორი არ არის.",
      fit: stage === "start" ? "გეხმარება პირველი ტექსტების მომზადებაში. ფაქტს თავად ამოწმებ." : "გეხმარება, ერთი შეთავაზება რამდენიმე გასაგებ ვარიანტად ჩამოყალიბდეს.",
      cost: "0 ლარი, თუ უფასო ლიმიტი გეყოფა",
      demo: false,
      stance: "use",
    },
    {
      id: "tool-visual",
      name: "ვიზუალის ხელსაწყო",
      detail: "მარტივი პოსტის აწყობა. უფასო ვერსია ხშირად ეყოფა. მაგალითია Canva. პარტნიორობა არ არის.",
      fit: profile.hasDesigner ? "დიზაინერი უკვე გყავს. ცალკე ხელსაწყო პირველი ხარჯი არ არის." : "დიზაინერის გარეშე პოსტი მაინც იკრიბება.",
      cost: "0 ლარი უფასო ვერსიით",
      demo: false,
      stance: visualStance,
      href: "https://www.canva.com",
    },
  ];

  return {
    intro: "რესურსი მაშინ ჩანს, როცა საქმეს ერგება. უფასო ნაბიჯი ფასიან სპეციალისტზე წინ დგას.",
    tools,
    freelancerNote: freelancer?.why ?? "",
    freelancers: [
      {
        id: "freelancer",
        name: "დემო პროფილი: შესრულების დახმარება",
        detail: "გამოგონილი პროფილი. რეალურ ადამიანს არ წარმოადგენს.",
        fit: freelancer?.why ?? "",
        cost: freelancer?.budget ?? "",
        demo: true,
        stance: freelancerStance,
      },
    ],
    agencyNote: agency?.why ?? "",
    agencies: [
      {
        id: "agency",
        name: "დემო სააგენტო „ვექტორი“",
        detail: "გამოგონილი სააგენტო. რეალურ კომპანიას არ წარმოადგენს. საორიენტაციო ზღვარი თვეში 2 000 ლარიდან.",
        fit: agency?.why ?? "",
        cost: agency?.budget ?? "",
        demo: true,
        stance: agencyStance,
      },
    ],
  };
}

function customWorkspace(profile: BusinessProfile, draft: PerformanceDraft): Workspace {
  const stage = stageOf(profile);
  const recommendations = buildRecommendations(profile, stage);
  const plan = buildPlan(profile, stage);
  const digital = hasDigital(profile);
  const budget = profile.budgetGel > 0 ? formatGel(profile.budgetGel) : "გამოყოფილი თანხა არ არის";

  const decision =
    stage === "start"
      ? "პირველი ნაბიჯი მარტივი ციფრული არსებობაა. სააგენტო ამ ეტაპზე არ ერგება."
      : "პირველი ნაბიჯი არსებული აქტივობის გაზომვაა. ახალი არხი მანამდე არ იხსნება.";

  const because =
    stage === "start"
      ? `${profile.name} ჯერ აწყობს საწყის ყოფნას. რეკომენდაცია ეყრდნობა ბიუჯეტს (${budget}) და იმას, მარკეტინგს მფლობელი თავად უძღვება თუ არა.`
      : `${profile.name} უკვე იყენებს მარკეტინგულ არხს. ჯერ უნდა ჩანდეს ხარჯი, მოთხოვნა და კლიენტი. ბიუჯეტის ჩარჩოა ${budget}.`;

  const strengths = [
    profile.channels.includes("word_of_mouth") ? "რეკომენდაცია უკვე მოაქვს მომხმარებელს." : "",
    profile.hasWebsite ? "ვებსაიტი უკვე არსებობს და ნულიდან ასაწყობი არ არის." : "",
    digital && !profile.hasWebsite ? "ციფრული არხი უკვე არის. ახალი ანგარიშით დაწყება პირველი საქმე არ არის." : "",
    profile.ownerDoesMarketing ? "მფლობელს შეუძლია პირველი ნაბიჯები თავად გადადგას." : "",
    profile.hasDesigner ? "ვიზუალი შიდა რესურსით კეთდება." : "",
    profile.budgetGel > 0 ? `თვეში ${formatGel(profile.budgetGel)} უკვე გათვლილია. რჩევა ამ ჩარჩოში რჩება.` : "",
  ].filter((item) => item.length > 0);

  const weaknesses = [
    !profile.hasWebsite && !profile.channels.some((channel) => channel === "instagram" || channel === "facebook" || channel === "tiktok")
      ? "სოციალურ ქსელში რეგულარული ყოფნა არ ჩანს."
      : "",
    profile.experience !== "none" ? "აქტივობა არის, მაგრამ შედეგი მიზანთან მიბმული არ არის." : "სტრუქტურირებული მარკეტინგი ჯერ არ დაწყებულა.",
    !profile.hasDesigner ? "დიზაინერი არ ჰყავს." : "",
    profile.budgetGel <= 0 ? "გამოყოფილი ბიუჯეტი არ აქვს, ამიტომ ფასიანი ნაბიჯი ახლა არ ჯდება." : "",
  ].filter((item) => item.length > 0);

  return {
    profile,
    overview: {
      stage: stage === "start" ? "საწყისი ეტაპი" : "არსებული აქტივობა გასაზომია",
      decision,
      because,
    },
    analysis: {
      presenceTitle: digital ? "არხი უკვე არის" : "ციფრული არსებობა სუსტია",
      presenceBody: digital
        ? `მითითებული არხები: ${channelSummary(profile)}. ${profile.hasWebsite ? "ვებსაიტიც აქვს." : "ვებსაიტი არ აქვს."} ანალიზი ამ სურათს ეყრდნობა, კაბინეტის მონაცემს კი არა.`
        : "ვებსაიტი და აქტიური ციფრული არხი არ ჩანს. ბიზნესი სხვა გზით იღებს მომხმარებელს. პირველი საქმე მოძებნადობაა, არა დიდი კამპანია.",
      maturityTitle: stage === "start" ? "საწყისი ეტაპი" : "აქტივობა გაზომვის გარეშე",
      maturityBody:
        stage === "start"
          ? "მარკეტინგის სისტემა ჯერ არ დაწყებულა. სააგენტო და ფართო რეკლამა ამ ეტაპზე ადრეა."
          : "მარკეტინგი უკვე სრულდება, მაგრამ ვერ ჩანს, რომელ ნაბიჯს მოაქვს მომხმარებელი.",
      audience: [
        `„${profile.activity}“: ვინ ყიდულობს დღეს, ცალკე ჩამოწერილი არ არის.`,
        "პირველ ეტაპზე გამოყავი ორი ჯგუფი: ვინც უკვე ყიდულობს და ვისთანაც გინდა მოხვედრა.",
      ],
      strengths: strengths.length > 0 ? strengths : ["ბიზნესი მუშაობს. მარკეტინგი ამ ფაქტს უნდა დაეყრდნოს."],
      weaknesses,
      challenges: [
        stage === "start" ? "ყოფნა ნულიდან უნდა შეიკრას, იმ დროით და თანხით, რაც ახლა გაქვს." : "უნდა გამოჩნდეს, არსებული ხარჯი და პოსტი რეალურ მომხმარებელს მოაქვს თუ არა.",
        profile.ownerDoesMarketing ? "საქმეს მფლობელის დრო ზღუდავს." : "მფლობელი საქმეს თავად არ უძღვება, ამიტომ ნაბიჯი მოკლე და კონკრეტული უნდა იყოს.",
      ],
      goalsBody: `მთავარი მიზანია: ${objectiveLabel[profile.objective]}. რეკომენდაცია ამ მიზანს ერგება და არა ზოგად მარკეტინგულ სიას.`,
      resourcesBody: `ბიუჯეტი: ${budget}. ${profile.ownerDoesMarketing ? "მარკეტინგს მფლობელი თავად უძღვება." : "მფლობელი მარკეტინგს თავად არ უძღვება."} ${profile.hasDesigner ? "დიზაინერი ჰყავს." : "დიზაინერი არ ჰყავს."}`,
      conclusion: `${decision} ${because}`,
    },
    recommendations,
    planIntro: plan.intro,
    plan: plan.steps,
    resources: buildResources(profile, stage, recommendations),
    performance: performanceFromDraft(profile, draft),
  };
}

export function buildWorkspace(profile: BusinessProfile, draft: PerformanceDraft): Workspace {
  if (profile.demoKey === "workshop") return workshopWorkspace(profile);
  if (profile.demoKey === "salon") return salonWorkspace(profile);
  return customWorkspace(profile, draft);
}
