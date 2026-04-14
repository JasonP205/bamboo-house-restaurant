import type { Branch } from "@/types/branch";
import { Switch, Spinner, Tooltip } from "@heroui/react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  MapPinpoint02Icon,
  TelephoneIcon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useBranchStore } from "@/stores/useBranchStore";
import { useTranslation } from "react-i18next";

interface BranchCardProps {
  branch: Branch;
  className?: string;
}
//branch, className
const BranchCard = ({ branch, className }: BranchCardProps) => {
  const { setSelectedBranchId, loadingChangeBranchStatus, changeOpenStatus } = useBranchStore();
  const { t } = useTranslation(["branch"]);
  return (
    <Link
      onClick={() => setSelectedBranchId(branch._id)}
      to={`/branches/${branch._id}`}
      className={cn("w-full", className)}
    >
      <div className="group relative w-full max-w-md bg-surface-secondary rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="aspect-video overflow-hidden relative">
          <img
            src={branch.imageUrl}
            alt={branch.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Badge */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-accent uppercase tracking-tighter">
              {branch.isOpen ? t("branchDetail.badge.open") : t("branchDetail.badge.closed")}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title + maybe status */}
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl italic font-serif text-accent dark:text-surface-secondary-foreground capitalize line-clamp-1">
              {branch.name}
            </h2>
          </div>

          {/* Info */}
          <div className="space-y-2 text-xs text-on-surface-variant opacity-80 mb-6">
            <div className="flex items-center">
              <HugeiconsIcon
                icon={MapPinpoint02Icon}
                size={16}
                className="mr-2"
              />
              <p className="line-clamp-1">{branch.location}</p>
            </div>

            <div className="flex items-center">
              <HugeiconsIcon icon={TelephoneIcon} size={16} className="mr-2" />
              <p className="line-clamp-1">{branch.contactNumber}</p>
            </div>

            <div className="flex items-center">
              <HugeiconsIcon icon={Clock01Icon} size={16} className="mr-2" />
              <p className="line-clamp-1">
                {branch.openingHours.open} - {branch.openingHours.close}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* Status */}
            <div className="flex gap-2 items-center">
              <span className={`w-2 h-2 rounded-full ${branch.isOpen ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                {
                  branch.isOpen ? "Open" : "Closed"
                }
              </span>
            </div>

            {/* Toggle */}
            <Switch
              isSelected={branch.isOpen}
              onChange={() => changeOpenStatus(branch._id)}
              aria-label="Enable branch"
              isDisabled={loadingChangeBranchStatus[branch._id]}
            >
              <Switch.Control>
                <Switch.Thumb className="flex items-center justify-center">
                  {
                    loadingChangeBranchStatus[branch._id] ? (
                      <Spinner size="sm"/>
                    ) : null
                  }
                </Switch.Thumb>
              </Switch.Control>
            </Switch>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BranchCard;
