import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tabs } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { useBranchStore } from "@/stores/useBranchStore";
import { useEffect } from "react";
import Metadata from "@/components/Metadata";
import { Store01Icon } from "@hugeicons/core-free-icons";
import BranchOverViewTab from "@/components/branch/BranchOverViewTab";
import BranchTableTab from "@/components/branch/BranchTableTab";
import BranchDetailSkeleton from "@/components/branch/BranchDetailSkeleton";
// ── Helpers ───────────────────────────────────────────────────────────────────

// ── Sub-component: labelled info row inside a card ───────────────────────────

// ── Page ─────────────────────────────────────────────────────────────────────
const BranchDetail = () => {
  const { t } = useTranslation(["branch"]);
  const { branchId } = useParams();
  const {
    getBranchInfo,
    loading,
    selectedBranch: branch,
    setSelectedBranchId,
    selectedBranchId,
  } = useBranchStore();
  useEffect(() => {
    setSelectedBranchId(branchId!);
    if (selectedBranchId) {
      getBranchInfo(selectedBranchId);
    }
  }, [selectedBranchId, branchId]);
  if (loading) {
    return <BranchDetailSkeleton title={branch?.name || t("branchDetail.title")} />;
  }
  /* ── Empty state ── */
  if (!branch) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-muted">
        <p className="text-2xl">{t("branchDetail.notFound")}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-thin">
      <Metadata title={`${branch.name} - Bamboo House`} />
      <div className="mx-auto flex flex-col gap-6">
        {/* ── 1. Hero image ─────────────────────────────────────── */}
        <div className="relative w-full aspect-21/9 overflow-hidden shadow-lg bg-surface-secondary">
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
          <div className="absolute inset-0 bg-linear-to-t from-accent/60 to-transparent" />

          <div className="absolute bottom-0 left-0 p-12 w-full flex justify-between items-end">
            <h1 className="text-6xl capitalize font-serif text-white tracking-tight leading-tight">
              {branch.name}
            </h1>
            <div className="bg-surface-container-lowest/10 backdrop-blur-md p-6 rounded-xl border border-white/10 text-white">
              <p className="text-xs uppercase font-light tracking-[0.2em] opacity-60 mb-1 line-clamp-1">
                {t("branchDetail.status.title")}
              </p>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 ${branch.isOpen ? "bg-emerald-400" : "bg-red-400"} rounded-full`} />
                <span className="text-base font-light line-clamp-1">
                  {t(`branchDetail.status.${branch.isOpen ? "open" : "closed"}`)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. Title area (primary hierarchy) ─────────────────── */}
        <div className="w-full p-4 md:p-12">
          <Tabs variant="secondary">
            <Tabs.ListContainer>
              <Tabs.List className="max-w-4xl" aria-label="Options">
                <Tabs.Tab id="overview">
                  {t("branchDetail.tab.overview")}
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="tables">
                  {t("branchDetail.tab.tables")}
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="staff">
                  {t("branchDetail.tab.staff")}
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="analytics">
                  {t("branchDetail.tab.analytics")}
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="configuration">
                  {t("branchDetail.tab.config")}
                  <Tabs.Indicator />
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>
            <Tabs.Panel className="pt-4" id="overview">
              <BranchOverViewTab branch={branch} />
            </Tabs.Panel>
            {/* <Tabs.Panel className="pt-4" id="menu">
              <DishesTab />
            </Tabs.Panel> */}
            <Tabs.Panel className="pt-4" id="tables">
              <BranchTableTab branchId={branch._id} />
            </Tabs.Panel>
            <Tabs.Panel className="pt-4" id="staff">
              <p>View and manage your staff members.</p>
            </Tabs.Panel>
            <Tabs.Panel className="pt-4" id="analytics">
              <p>View detailed analytics and reports for your branch.</p>
            </Tabs.Panel>
            <Tabs.Panel className="pt-4" id="configuration">
              <p>Configure branch settings and preferences.</p>
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BranchDetail;
