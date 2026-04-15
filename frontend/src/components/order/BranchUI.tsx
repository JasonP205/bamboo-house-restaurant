import type { Branch } from "@/types/branch";
import { Card, Button, Chip } from "@heroui/react";
import { Link } from "react-router-dom";
interface BranchUIProps {
  branch: Branch;
}
const BranchUI = ({ branch }: BranchUIProps) => {
  return (
    <Card className="w-full p-2 rounded-lg shadow-none border-none">
      <div className="flex gap-2">
        <div className="aspect-square size-20 rounded-md overflow-hidden">
          <img
            src={branch.imageUrl}
            alt={branch.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex justify-between flex-1 gap-2">
          <div className="flex flex-col w-full flex-1 justify-between gap-1">
            <div>
              <h3 className="text-sm font-serif font-medium capitalize text-accent">
                {branch.name}
              </h3>
              <p className="text-[8px] text-muted-foreground">
                {branch.location}
              </p>
            </div>

            <Link to={`/orders/${branch._id}`}>
              <Button
                className="rounded-md max-h-6 px-2 text-[10px]"
                fullWidth
                variant="primary"
                size="sm"
              >
                View Menu & Order
              </Button>
            </Link>
          </div>

          <div className="flex flex-col justify-between items-center gap-1">
            <Chip variant="primary" className="uppercase text-[6px] " size="sm">
              {" "}
              km away
            </Chip>
            <Button
              className="text-[10px] rounded-md max-h-6 px-2"
              variant="tertiary"
              size="sm"
            >
              Reverse
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BranchUI;
