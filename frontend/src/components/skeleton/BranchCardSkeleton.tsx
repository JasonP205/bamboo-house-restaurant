import { cn } from "@/lib/utils";
import { Card, Skeleton } from "@heroui/react";

interface BranchCardSkeletonProps {
  className?: string;
  quantity?: number;
}
const BranchCardSkeleton = ({
  quantity = 1,
  className,
}: BranchCardSkeletonProps) => {
  return (
    <>
      {Array.from({ length: quantity }).map((_, i) => (
        <Card className={cn("w-full hover:bg-accent-soft-hover max-w-md items-stretch border-transparent border-2 hover:border-surface-secondary transition-colors", className ?? "")} key={i}>
          <div className="w-full aspect-video overflow-hidden rounded-lg">
            <Skeleton className="w-full h-full" />
          </div>
          <div className="flex-col gap-2">
            <Skeleton className="w-[80%] h-7" />
          </div>
          <Skeleton className="w-full h-5" />
          <Skeleton className="w-full h-5" />
        </Card>
      ))}
    </>
  );
};

export default BranchCardSkeleton;
