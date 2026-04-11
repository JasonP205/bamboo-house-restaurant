import { useBranchStore } from "@/stores/useBranchStore";
import type { Branch } from "@/types/branch";
import { Card, Button } from "@heroui/react";
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
        <div>
            <h3 className="text-base font-serif font-medium">{branch.name}</h3>
        </div>
        <div>
            
        </div>
      </div>
    </Card>
  );
};

export default BranchUI;
