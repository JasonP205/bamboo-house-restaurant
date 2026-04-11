import { Skeleton } from "@heroui/react";
import { useId } from "react";

interface DishCardSkeletonProps {
  quantity?: number;
}

const DishCardSkeleton = ({ quantity = 1 }: DishCardSkeletonProps) => {
  return (
    <>
      {Array.from({ length: quantity }).map((_) => (
        <div
          key={useId()}
          className="group relative overflow-hidden rounded-xl bg-surface"
        >
          <div className="relative aspect-3/4 overflow-hidden">
            <Skeleton className="h-full w-full rounded-none" />
            <div className="absolute right-4 top-4">
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>

          <div className="space-y-5 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-1/3 rounded-lg" />
              </div>
              <Skeleton className="h-5 w-14 rounded-lg" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-3 w-full rounded-lg" />
              <Skeleton className="h-3 w-5/6 rounded-lg" />
              <Skeleton className="h-3 w-2/3 rounded-lg" />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-3 w-16 rounded-lg" />
              </div>

              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default DishCardSkeleton;
