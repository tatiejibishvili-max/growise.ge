export interface SourceRow {
  id: string;
  name: string;
  status: string;
  detail: string;
}

export function adPlatforms(): SourceRow[] {
  return [
    {
      id: "meta",
      name: "Meta: Facebook და Instagram",
      status: "არ არის დაკავშირებული",
      detail: "საჭიროებს ბიზნესის ავტორიზაციას და უფლებებს. ამ პროტოტიპში კავშირი არ მუშაობს.",
    },
    {
      id: "google-ads",
      name: "Google Ads",
      status: "არ არის დაკავშირებული",
      detail: "საჭიროებს ანგარიშის წვდომას. ამ პროტოტიპში კავშირი არ მუშაობს.",
    },
  ];
}

export function specialistReport(): SourceRow {
  return {
    id: "specialist-report",
    name: "ფრილანსერის ან სააგენტოს ანგარიში",
    status: "ანგარიში არ შესულა",
    detail: "მოგვიანებით სპეციალისტი აქ დატოვებს შესრულებულ სამუშაოს და კამპანიის შედეგს.",
  };
}
