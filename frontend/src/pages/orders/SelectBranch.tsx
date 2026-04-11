import { Link } from "react-router-dom";
import { useBranchStore } from "@/stores/useBranchStore";
import { useEffect } from "react";
import BranchUI from "@/components/order/BranchUI";
const SelectBranch = () => {
  const { branches, loading, fetchBranches } = useBranchStore();

  useEffect(() => {
    const init = async () => {
      await fetchBranches();
    };
    init();
  }, [fetchBranches]);

  return (
    <div className="p-4 flex flex-col items-center justify-start gap-4">
      <div className="w-full">
        <h2 className="text-2xl italic font-serif text-accent">Select a Branch</h2>
        <p className="text-muted text-xs">
          Please choose a branch to proceed with your order.
        </p>
      </div>
      {loading ? (
        <p>Loading branches...</p>
      ) : (
        <div className="w-full max-w-md flex flex-col gap-4">
          {branches.map((branch) => (
            <BranchUI key={branch._id} branch={branch} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectBranch;
