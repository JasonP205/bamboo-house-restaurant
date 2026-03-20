import type { Branch } from "@/types/branch";
import { Button, Card, Tooltip } from "@heroui/react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  MapPinpoint02Icon,
  TelephoneIcon,
  Clock01Icon,
  Tool,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface BranchCardProps {
  branch: Branch;
  className?: string;
}
//branch, className
const BranchCard = ({ branch, className }: BranchCardProps) => {
  const { t } = useTranslation(["branch"]);

  return (
    <Link
      to={`/app/branches/${branch._id}`}
      className={cn("w-full", className)}
    >
      <Card className="w-full hover:bg-accent-soft-hover max-w-md items-stretch border-transparent border-2 hover:border-surface-secondary transition-colors">
        <div className="w-full aspect-video overflow-hidden rounded-lg">
          <img
            src={branch.imageUrl}
            alt={branch.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-col gap-2">
          <h2 className="text-lg text-accent font-semibold capitalize">
            {branch.name}
          </h2>
          <span className="text-sm text-muted flex items-center">
            <HugeiconsIcon
              icon={MapPinpoint02Icon}
              size={20}
              className="inline-block mr-2"
            />
            <p className="line-clamp-1">
              {t("branchCard.locationLabel")}: {branch.location}
            </p>
          </span>
          <span className="mt-2 text-sm text-muted flex items-center">
            <HugeiconsIcon
              icon={TelephoneIcon}
              size={20}
              className="inline-block mr-2"
            />
            <p className="line-clamp-1">
              {t("branchCard.contactNumberLabel")}: {branch.contactNumber}
            </p>
          </span>
          <span className="mt-2 text-sm text-muted flex items-center">
            <HugeiconsIcon
              icon={Clock01Icon}
              size={20}
              className="inline-block mr-2"
            />
            <p className="line-clamp-1">
              {t("branchCard.openingHours")}: {branch.openingHours.open} -{" "}
              {branch.openingHours.close}
            </p>
          </span>
        </div>
      </Card>
    </Link>
  );
};

export default BranchCard;
