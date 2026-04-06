import {
  Button,
  Card,
  CardHeader,
  Separator,
  useOverlayState,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Location08Icon,
  TelephoneIcon,
  Clock01Icon,
  RulerIcon,
  PencilEdit02Icon,
  DiningTableIcon,
  Mail02Icon,
  IdIcon,
  Edit,
} from "@hugeicons/core-free-icons";
import type { BranchDetail } from "@/types/branch";
import InfoRow from "./InfoRow";
import EditBranchDrawer from "./EditBranchDrawer";
import { getEmbedMapLink } from "@/lib/helper";

interface BranchOverViewTabProps {
  branch: BranchDetail;
}

const BranchOverViewTab = ({ branch }: BranchOverViewTabProps) => {
  const { t } = useTranslation(["branch"]);
  const editDrawerState = useOverlayState();
  const details = [
    {
      icon: Location08Icon,
      label: t("branchDetail.overview.address"),
      value: branch.location,
    },
    {
      icon: TelephoneIcon,
      label: t("branchDetail.overview.contactNumber"),
      value: branch.contactNumber,
      secondaryIcon: Mail02Icon,
      secondaryLabel: t("branchDetail.overview.email"),
      secondaryValue: "contact@bamboohouse.com",
    },
    {
      icon: Clock01Icon,
      label: t("branchDetail.overview.openingHours"),
      value: `${branch.openingHours.open} - ${branch.openingHours.close}`,
      description: t("branchDetail.overview.kitchenHours"),
    },
    {
      icon: RulerIcon,
      label: t("branchDetail.overview.floorSpace"),
      value: `${branch.floorSpace} m²`,
    },
  ];
  const keyInventory = [
    {
      icon: DiningTableIcon,
      value: branch.totalTables,
      label: t("branchDetail.overview.tables"),
    },
    {
      icon: IdIcon,
      value: branch.totalStaffs,
      label: t("branchDetail.overview.staffs"),
    },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
      <div className="lg:col-span-2">
        <Card className="p-10 rounded-xl space-y-5">
          <Card.Header className="flex text-accent flex-row gap-3 items-center justify-between dark:text-surface-secondary-foreground">
            <h1 className="font-serif text-2xl">
              {t("branchDetail.overview.title")}
            </h1>
            <span
              onClick={() => {
                editDrawerState.open();
              }}
              className="flex items-center gap-1 text-sm cursor-pointer hover:text-muted transition-colors duration-300 dark:text-surface-secondary-foreground"
            >
              <HugeiconsIcon size={20} icon={PencilEdit02Icon} />
              {t("editBranch.triggerButton")}
            </span>
            <EditBranchDrawer state={editDrawerState} />
          </Card.Header>

          <Card.Content className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
            {details.map((detail) => (
              <InfoRow
                type="primary"
                key={detail.label}
                icon={detail.icon}
                label={detail.label}
                value={detail.value}
                secondaryIcon={detail.secondaryIcon}
                secondaryLabel={detail.secondaryLabel}
                secondaryValue={detail.secondaryValue}
                desciption={detail.description}
              />
            ))}
          </Card.Content>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="bg-accent rounded-xl text-surface space-y-5 p-10">
          <Card.Header className="flex font-serif text-xl flex-row gap-3 items-center dark:text-surface-secondary-foreground">
            {t("branchDetail.overview.keyInventory")}
          </Card.Header>
          <Card.Content className="flex flex-col gap-6">
            {keyInventory.map((item) => (
              <InfoRow
                type="secondary"
                key={item.label}
                icon={item.icon}
                label={item.label}
                value={item.value.toString()}
              />
            ))}
          </Card.Content>
        </Card>
      </div>
      {branch.mapCoordinates && (
        <div className="lg:col-span-2">
          <Card className="rounded-xl p-10 space-y-5">
            <CardHeader>
              <h1 className="font-serif text-2xl text-accent dark:text-surface-secondary-foreground">
                {t("branchDetail.overview.locationOnMap")}
              </h1>
            </CardHeader>
            <Card.Content>
              <iframe
                width="100%"
                height="400"
                loading="lazy"
                className="rounded-xl"
                allowFullScreen
                src={getEmbedMapLink(branch.mapCoordinates)}
              />
            </Card.Content>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BranchOverViewTab;
