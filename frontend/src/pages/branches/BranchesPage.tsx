import { useBranchStore } from "@/stores/useBranchStore";
import CreateBranchModal from "@/components/branch/CreateBranchModal";
import { Store01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Metadata from "@/components/Metadata";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/useAuthStore";
import BranchCard from "@/components/ui/BranchCard";
import { useEffect } from "react";

const BranchesPage = () => {
  const { branches, fetchBranches } = useBranchStore();
  const { role } = useAuthStore();
  const { t } = useTranslation("branch");

  useEffect(() => {
    fetchBranches();
  }, []);

  if (branches.length === 0) {
    return (
      <>
        <Metadata title={t("page.title")} description={t("page.description")} />
        <div className="w-full flex flex-col items-center gap-4 text-muted justify-between">
          <HugeiconsIcon size={150} icon={Store01Icon} />
          <p className="text-center text-2xl">{t("page.emptyBranchList")}</p>
          <CreateBranchModal />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="w-full h-full overflow-y-auto p-4">
        <Metadata title={t("page.title")} description={t("page.description")} />
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-muted justify-between">
          {branches.map((branch) => (
            <BranchCard key={branch._id} branch={branch} />
          ))}
        </div>
      </div>
      {role === "manager" && <CreateBranchModal isFloating />}
    </>
  );
};

export default BranchesPage;
