import type { ChannelId, Experience, Objective, RecKind, RecTiming, Recommendation, ResourceStance } from "./types.ts";

export const experienceOptions: { value: Experience; label: string }[] = [
  { value: "none", label: "სტრუქტურირებული მარკეტინგი არ მაქვს" },
  { value: "informal", label: "ცალკეული ნაბიჯები მაქვს, სისტემის გარეშე" },
  { value: "active_unmeasured", label: "აქტიურად ვმუშაობ, შედეგს ვერ ვზომავ" },
];

export const experienceLabel: Record<Experience, string> = {
  none: "სტრუქტურირებული მარკეტინგი არ აქვს",
  informal: "ცალკეული ნაბიჯები აქვს, სისტემის გარეშე",
  active_unmeasured: "აქტიურად მუშაობს, შედეგს ვერ ზომავს",
};

export const objectiveOptions: { value: Objective; label: string }[] = [
  { value: "presence", label: "ციფრული არსებობა და პირველი მომხმარებლები" },
  { value: "awareness", label: "ცნობადობა" },
  { value: "inquiries", label: "მოთხოვნები" },
  { value: "bookings", label: "ჯავშნები" },
  { value: "sales", label: "გაყიდვები" },
];

export const objectiveLabel: Record<Objective, string> = {
  presence: "ციფრული არსებობა და პირველი მომხმარებლები",
  awareness: "ცნობადობა",
  inquiries: "მოთხოვნები",
  bookings: "ჯავშნები",
  sales: "გაყიდვები",
};

export const channelOptions: { value: ChannelId; label: string }[] = [
  { value: "word_of_mouth", label: "რეკომენდაცია და ზეპირი სიტყვა" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "google_ads", label: "Google რეკლამა" },
];

export const channelLabel: Record<ChannelId, string> = {
  word_of_mouth: "რეკომენდაცია და ზეპირი სიტყვა",
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  google_ads: "Google რეკლამა",
};

export const kindLabel: Record<RecKind, string> = {
  ai: "ხელოვნური ინტელექტის ხელსაწყო",
  self: "დამოუკიდებლად",
  freelancer: "ფრილანსერი",
  agency: "სააგენტო",
};

export const timingLabel: Record<RecTiming, string> = {
  now: "ახლა",
  next: "შემდეგ",
  later: "მოგვიანებით",
  not_now: "ამ ეტაპზე არა",
};

export const stanceLabel: Record<ResourceStance, string> = {
  use: "შესაფერისია",
  optional: "არასავალდებულო",
  skip: "არ ერგება",
};

const timingOrder: RecTiming[] = ["now", "next", "later", "not_now"];

export function groupedRecommendations(items: Recommendation[]) {
  return timingOrder
    .map((timing) => ({
      timing,
      items: items.filter((item) => item.timing === timing),
    }))
    .filter((group) => group.items.length > 0);
}

export function ordersFieldLabel(objective: Objective): string {
  if (objective === "bookings") return "ჯავშნები";
  if (objective === "sales") return "შეკვეთები";
  return "შეკვეთები ან ჯავშნები";
}
