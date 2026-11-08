import { useState } from "react";
import { Badge, BulletList, Button, PageIntro, Panel } from "../components/ui.tsx";
import { channelLabel, experienceLabel, objectiveLabel } from "../labels.ts";
import { budgetLabel } from "../metrics.ts";
import { useRoute } from "../router.tsx";
import { useBusiness } from "../store.tsx";
import type { Workspace } from "../types.ts";

export function ProfilePage({ workspace }: { workspace: Workspace }) {
  const { profile } = workspace;
  const { remove } = useBusiness();
  const { go } = useRoute();
  const [confirm, setConfirm] = useState(false);
  const channels = profile.channels.length > 0 ? profile.channels.map((channel) => channelLabel[channel]).join(", ") : "ციფრული არხი არ არის მითითებული";
  const resources = [
    profile.ownerDoesMarketing ? "მარკეტინგს მფლობელი თავად უძღვება" : "მფლობელი მარკეტინგს თავად არ უძღვება",
    profile.hasDesigner ? "დიზაინერი ჰყავს" : "დიზაინერი არ ჰყავს",
  ].join(". ");

  return (
    <>
      <div className="space-y-3">
        {profile.isDemo ? <Badge tone="accent">სადემონსტრაციო ბიზნესი</Badge> : <Badge>შენი პროფილი</Badge>}
        <PageIntro title={profile.name} lede={profile.activity} />
      </div>
      <Panel>
        <h2 className="text-lg font-semibold">სიტუაცია</h2>
        <div className="mt-4">
          <BulletList items={profile.situation} />
        </div>
        <h2 className="mt-8 text-lg font-semibold">მონაცემები</h2>
        <dl className="mt-2 divide-y divide-line">
          <Row term="საქმიანობა" value={profile.activity} />
          <Row term="ვებსაიტი" value={profile.hasWebsite ? "აქვს" : "არ აქვს"} />
          <Row term="არხები" value={channels} />
          <Row term="გამოცდილება" value={experienceLabel[profile.experience]} />
          <Row term="მთავარი მიზანი" value={objectiveLabel[profile.objective]} />
          <Row term="ბიუჯეტი" value={budgetLabel(profile.budgetGel)} />
          <Row term="შიდა რესურსი" value={resources} />
        </dl>
      </Panel>
      {profile.isDemo ? null : confirm ? (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="secondary"
            onClick={() => {
              remove(profile.id);
              go({ name: "choose" });
            }}
          >
            წაშალე პროფილი
          </Button>
          <Button variant="ghost" onClick={() => setConfirm(false)}>
            დატოვე
          </Button>
        </div>
      ) : (
        <button type="button" className="text-sm font-medium text-muted hover:text-ink" onClick={() => setConfirm(true)}>
          ამ პროფილის წაშლა
        </button>
      )}
    </>
  );
}

function Row({ term, value }: { term: string; value: string }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[200px_1fr] sm:gap-6">
      <dt className="text-[13px] font-medium text-muted">{term}</dt>
      <dd className="text-[15px] leading-6">{value}</dd>
    </div>
  );
}
