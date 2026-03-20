import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Chip } from "@heroui/react";
import { useAuthStore } from "@/stores/useAuthStore";
import { HugeiconsIcon } from "@hugeicons/react";
import { useBranchStore } from "@/stores/useBranchStore";
import { Store01Icon } from "@hugeicons/core-free-icons";

const BranchDetail = () => {
  const { t } = useTranslation(["branch"]);
  const { branchId } = useParams();
  const { branches } = useBranchStore();
  const branch = branches.find((b) => b._id === branchId);
  if (!branch) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <HugeiconsIcon size={100} icon={Store01Icon} />
        <p className="text-2xl">{t("branchDetail.notFound")}</p>
      </div>
    );
  }
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="inline-block">
        <Chip className="inline-flex items-center gap-2 text-accent">
          <HugeiconsIcon size={30} icon={Store01Icon} />
          <span className="capitalize font-bold font-playfair text-2xl text-accent">
            {branch.name}
          </span>
        </Chip>
      </div>
    </div>
  );
};

export default BranchDetail;
