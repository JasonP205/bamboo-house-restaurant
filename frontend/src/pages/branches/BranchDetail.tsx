import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, Chip, Separator } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { useBranchStore } from "@/stores/useBranchStore";
import {
  Store01Icon,
  MapPinpoint02Icon,
  TelephoneIcon,
  Clock01Icon,
  DiningTableIcon,
  UserGroupIcon
} from "@hugeicons/core-free-icons";
import { useEffect } from "react";

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// ── Sub-component: labelled info row inside a card ───────────────────────────
interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}
const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <div className="flex items-center gap-3 py-3">
    <span className="shrink-0 text-accent mt-0.5">{icon}</span>
    <Separator orientation="vertical" className="self-stretch" />
    <div className="flex flex-col min-w-0 gap-0.5">
      <span className="text-xs font-semibold text-muted uppercase tracking-widest">
        {label}
      </span>
      <span className="text-sm text-foreground wrap-break-word">{value}</span>
    </div>
  </div>
);

// ── Page ─────────────────────────────────────────────────────────────────────
const BranchDetail = () => {
  const { t } = useTranslation(["branch"]);
  const { branchId } = useParams();
  const { getBranchInfo, loading, selectedBranch : branch } = useBranchStore();
  useEffect(() => {
    if (branchId) {
      getBranchInfo(branchId);
    }
  }, [branchId]);
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center gap-4 text-muted">
        <HugeiconsIcon size={100} icon={Store01Icon} className="animate-spin" />
        <p className="text-2xl">{t("branchDetail.loading")}</p>
      </div>
    );
  }
  /* ── Empty state ── */
  if (!branch) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-muted">
        <HugeiconsIcon size={100} icon={Store01Icon} />
        <p className="text-2xl">{t("branchDetail.notFound")}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-5xl mx-auto flex flex-col gap-6 p-1">

        {/* ── 1. Hero image ─────────────────────────────────────── */}
        <div className="w-full aspect-video overflow-hidden rounded-2xl shadow-lg bg-surface-secondary">
          {branch.imageUrl ? (
            <img
              src={branch.imageUrl}
              alt={branch.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <HugeiconsIcon
                icon={Store01Icon}
                size={72}
                className="text-muted opacity-30"
              />
            </div>
          )}
        </div>

        {/* ── 2. Title area (primary hierarchy) ─────────────────── */}
        <div className="flex flex-col gap-2">
          <h1 className="font-playfair font-bold text-3xl md:text-4xl text-accent capitalize leading-tight">
            {branch.name}
          </h1>
        </div>

        {/* ── 3. Info card (secondary hierarchy) ────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

          {/* Contact & Hours */}
          <Card>
            <Card.Header>
              <Card.Title className="text-base">
                {t("branchDetail.contactTitle")}
              </Card.Title>
              <Card.Description>
                {t("branchDetail.contactDescription")}
              </Card.Description>
            </Card.Header>
            <Card.Content className="flex flex-col gap-0 pt-0">
              <InfoRow
                icon={<HugeiconsIcon icon={MapPinpoint02Icon} size={18} />}
                label={t("branchCard.locationLabel")}
                value={branch.location}
              />
              <Separator />
              <InfoRow
                icon={<HugeiconsIcon icon={TelephoneIcon} size={18} />}
                label={t("branchCard.contactNumberLabel")}
                value={branch.contactNumber}
              />
              <Separator />
              <InfoRow
                icon={<HugeiconsIcon icon={Clock01Icon} size={18} />}
                label={t("branchCard.openingHours")}
                value={`${branch.openingHours.open} – ${branch.openingHours.close}`}
              />
            </Card.Content>
          </Card>

          {/* Meta information */}
          <Card variant="secondary">
            <Card.Header>
              <Card.Title className="text-base">
                {t("branchDetail.metaTitle")}
              </Card.Title>
              <Card.Description>
                {t("branchDetail.metaDescription")}
              </Card.Description>
            </Card.Header>
            <Card.Content className="flex flex-col gap-0 pt-0">
              <InfoRow
                icon={<HugeiconsIcon icon={DiningTableIcon} size={18} />}
                label={t("branchDetail.indoorTables")}
                value={branch.indoorTables.toString()}
              />
              <Separator />
              <InfoRow
                icon={<HugeiconsIcon icon={DiningTableIcon} size={18} />}
                label={t("branchDetail.outdoorTables")}
                value={branch.outdoorTables.toString()}
              />
              <Separator />
              <InfoRow
                icon={<HugeiconsIcon icon={UserGroupIcon} size={18} />}
                label={t("branchDetail.totalStaffs")}
                value={branch.totalStaffs.toString()}
              />
            </Card.Content>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default BranchDetail;
