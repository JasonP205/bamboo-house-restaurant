import { Skeleton } from "@heroui/react";

interface TableItemSkeletonProps {
  quantity: number;
}

const TableItemSkeleton = ({ quantity }: TableItemSkeletonProps) => {
  return (
    <>
      {Array.from({ length: quantity }, (_, index) => (
        <Skeleton key={index} className="w-full aspect-4/3 sm:aspect-video rounded-xl" />
      ))}
    </>
  );
};

export default TableItemSkeleton;
