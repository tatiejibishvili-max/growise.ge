export type Experience = "none" | "informal" | "active_unmeasured";

export type Objective = "presence" | "awareness" | "inquiries" | "bookings" | "sales";

export type ChannelId = "word_of_mouth" | "instagram" | "facebook" | "tiktok" | "google_ads";

export interface BusinessProfile {
  id: string;
  name: string;
  activity: string;
  isDemo: boolean;
  demoKey?: "workshop" | "salon";
  hasWebsite: boolean;
  channels: ChannelId[];
  experience: Experience;
  objective: Objective;
  budgetGel: number;
  ownerDoesMarketing: boolean;
  hasDesigner: boolean;
  situation: string[];
}

export interface Analysis {
  presenceTitle: string;
  presenceBody: string;
  maturityTitle: string;
  maturityBody: string;
  audience: string[];
  strengths: string[];
  weaknesses: string[];
  challenges: string[];
  goalsBody: string;
  resourcesBody: string;
  conclusion: string;
}

export type RecKind = "ai" | "self" | "freelancer" | "agency";
export type RecTiming = "now" | "next" | "later" | "not_now";

export interface Recommendation {
  id: string;
  kind: RecKind;
  timing: RecTiming;
  title: string;
  why: string;
  budget: string;
}

export interface PlanStep {
  id: string;
  priority: string;
  title: string;
  channel: string;
  resources: string;
  budget: string;
  objective: string;
  timeline: string;
}

export type ResourceStance = "use" | "optional" | "skip";

export interface ResourceCard {
  id: string;
  name: string;
  detail: string;
  fit: string;
  cost: string;
  demo: boolean;
  stance: ResourceStance;
  href?: string;
}

export interface PerformanceFigure {
  label: string;
  value: string;
}

export interface DerivedPoint {
  label: string;
  value: string;
  note: string;
}

export interface PerformanceModel {
  state: "unavailable" | "simulated" | "ready" | "incomplete";
  badge: string;
  teaser: string;
  summary: string;
  next: string[];
  figures: PerformanceFigure[];
  derived: DerivedPoint[];
  missingTitle: string;
  missing: string[];
  attribution: string;
  businessSource: string;
  entry: boolean;
}

export interface Workspace {
  profile: BusinessProfile;
  overview: {
    stage: string;
    decision: string;
    because: string;
  };
  analysis: Analysis;
  recommendations: Recommendation[];
  planIntro: string;
  plan: PlanStep[];
  resources: {
    intro: string;
    tools: ResourceCard[];
    freelancerNote: string;
    freelancers: ResourceCard[];
    agencyNote: string;
    agencies: ResourceCard[];
  };
  performance: PerformanceModel;
}

export interface PerformanceDraft {
  period: string;
  spendGel: string;
  inquiries: string;
  newCustomers: string;
  revenueGel: string;
  orders: string;
  reach: string;
}

export interface MetricNumbers {
  spendGel: number | null;
  inquiries: number | null;
  newCustomers: number | null;
  revenueGel: number | null;
  orders: number | null;
  reach: number | null;
}
