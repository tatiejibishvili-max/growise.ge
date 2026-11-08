import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { demoProfiles } from "./data/demos.ts";
import { channelOptions, experienceOptions, objectiveOptions } from "./labels.ts";
import { emptyDraft } from "./metrics.ts";
import type { BusinessProfile, ChannelId, Experience, Objective, PerformanceDraft } from "./types.ts";

const STORAGE_KEY = "growise.v1";

export type NewBusiness = Omit<BusinessProfile, "id" | "isDemo" | "demoKey">;

interface StoredShape {
  custom: BusinessProfile[];
  activeId: string | null;
  drafts: Record<string, PerformanceDraft>;
}

interface BusinessContextValue {
  demos: BusinessProfile[];
  custom: BusinessProfile[];
  active: BusinessProfile | null;
  drafts: Record<string, PerformanceDraft>;
  select: (id: string) => void;
  register: (input: NewBusiness) => void;
  remove: (id: string) => void;
  updateDraft: (id: string, draft: PerformanceDraft) => void;
}

const BusinessContext = createContext<BusinessContextValue | null>(null);

const experienceSet = new Set<string>(experienceOptions.map((item) => item.value));
const objectiveSet = new Set<string>(objectiveOptions.map((item) => item.value));
const channelSet = new Set<string>(channelOptions.map((item) => item.value));

function sanitizeDraft(value: unknown): PerformanceDraft {
  const source = value && typeof value === "object" ? (value as Partial<PerformanceDraft>) : {};
  const text = (field: keyof PerformanceDraft) => (typeof source[field] === "string" ? source[field] : "");
  return {
    period: text("period"),
    spendGel: text("spendGel"),
    inquiries: text("inquiries"),
    newCustomers: text("newCustomers"),
    revenueGel: text("revenueGel"),
    orders: text("orders"),
    reach: text("reach"),
  };
}

function sanitizeProfile(value: unknown): BusinessProfile | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Partial<BusinessProfile>;
  if (typeof source.id !== "string" || source.id === "workshop" || source.id === "salon") return null;
  if (typeof source.name !== "string" || !source.name.trim()) return null;
  if (typeof source.activity !== "string" || !source.activity.trim()) return null;
  if (typeof source.budgetGel !== "number" || !Number.isFinite(source.budgetGel) || source.budgetGel < 0) return null;
  if (typeof source.experience !== "string" || !experienceSet.has(source.experience)) return null;
  if (typeof source.objective !== "string" || !objectiveSet.has(source.objective)) return null;
  if (!Array.isArray(source.channels) || !Array.isArray(source.situation)) return null;

  const channels = source.channels.filter((item): item is ChannelId => typeof item === "string" && channelSet.has(item));
  const situation = source.situation.filter((item): item is string => typeof item === "string").slice(0, 8);

  return {
    id: source.id,
    name: source.name.trim(),
    activity: source.activity.trim(),
    isDemo: false,
    hasWebsite: Boolean(source.hasWebsite),
    channels,
    experience: source.experience as Experience,
    objective: source.objective as Objective,
    budgetGel: source.budgetGel,
    ownerDoesMarketing: source.ownerDoesMarketing !== false,
    hasDesigner: Boolean(source.hasDesigner),
    situation,
  };
}

function readStored(): StoredShape {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { custom: [], activeId: null, drafts: {} };
    const parsed = JSON.parse(raw) as Partial<StoredShape>;
    const custom = Array.isArray(parsed.custom) ? parsed.custom.map(sanitizeProfile).filter((item) => item !== null) : [];
    const known = new Set<string>([...demoProfiles.map((item) => item.id), ...custom.map((item) => item.id)]);
    const activeId = typeof parsed.activeId === "string" && known.has(parsed.activeId) ? parsed.activeId : null;
    const drafts: Record<string, PerformanceDraft> = {};
    if (parsed.drafts && typeof parsed.drafts === "object") {
      for (const [id, draft] of Object.entries(parsed.drafts)) drafts[id] = sanitizeDraft(draft);
    }
    return { custom, activeId, drafts };
  } catch {
    return { custom: [], activeId: null, drafts: {} };
  }
}

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `custom-${crypto.randomUUID()}`;
  return `custom-${Date.now()}`;
}

export function BusinessProvider({ children }: { children: ReactNode }) {
  const stored = useMemo(() => readStored(), []);
  const [custom, setCustom] = useState<BusinessProfile[]>(stored.custom);
  const [activeId, setActiveId] = useState<string | null>(stored.activeId);
  const [drafts, setDrafts] = useState<Record<string, PerformanceDraft>>(stored.drafts);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ custom, activeId, drafts }));
    } catch {
      // The prototype still works if the browser refuses storage.
    }
  }, [custom, activeId, drafts]);

  const select = useCallback((id: string) => setActiveId(id), []);

  const register = useCallback((input: NewBusiness) => {
    const profile: BusinessProfile = { ...input, id: createId(), isDemo: false };
    setCustom((current) => [...current, profile]);
    setActiveId(profile.id);
  }, []);

  const remove = useCallback((id: string) => {
    setCustom((current) => current.filter((item) => item.id !== id));
    setActiveId((current) => (current === id ? null : current));
    setDrafts((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }, []);

  const updateDraft = useCallback((id: string, draft: PerformanceDraft) => {
    setDrafts((current) => ({ ...current, [id]: draft }));
  }, []);

  const active = useMemo(() => {
    return [...demoProfiles, ...custom].find((item) => item.id === activeId) ?? null;
  }, [activeId, custom]);

  const value = useMemo(
    () => ({ demos: demoProfiles, custom, active, drafts, select, register, remove, updateDraft }),
    [custom, active, drafts, select, register, remove, updateDraft],
  );

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
}

export function useBusiness(): BusinessContextValue {
  const value = useContext(BusinessContext);
  if (!value) throw new Error("useBusiness must be used within BusinessProvider");
  return value;
}

export function draftFor(drafts: Record<string, PerformanceDraft>, id: string): PerformanceDraft {
  return drafts[id] ?? emptyDraft;
}
