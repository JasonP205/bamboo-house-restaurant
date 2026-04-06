import { Skeleton } from "@heroui/react";
import Metadata from "../Metadata";
const BranchDetailSkeleton = ({ title }: { title: string }) => {
  return (
    <div className="w-full h-full overflow-y-auto scrollbar-thin">
      <Metadata title={`${title} - Bamboo House`} />
      <div className="mx-auto flex flex-col gap-6">
        {/* ── 1. Hero image ─────────────────────────────────────── */}
        <div className="relative w-full aspect-21/9 overflow-hidden bg-surface-secondary">
          <Skeleton className="w-full h-full" />
        </div>

        {/* ── 2. Title area (primary hierarchy) ─────────────────── */}
        <div className="w-full p-4 md:p-12 space-y-5">
          <Skeleton className="w-3/4 h-10" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Skeleton className="w-full h-120 lg:col-span-2" />
            <Skeleton className="w-full h-80 lg:col-span-1" />
            <Skeleton className="w-full h-80 lg:col-span-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchDetailSkeleton;
