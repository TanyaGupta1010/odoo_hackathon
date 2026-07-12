import { useEffect, useState } from "react";

import AssetSelector from "./AssetSelector";
import AllocationWarning from "./AllocationWarning";
import AllocationForm from "./AllocationForm";
import TransferRequestForm from "./TransferRequestForm";
import AllocationHistory from "./AllocationHistory";

import { allocationService } from "../../services/allocation.service";

import type {
  Asset,
  Allocation,
} from "../../types/allocation";

export default function AllocationWorkflow() {
  const [selectedAsset, setSelectedAsset] =
    useState<Asset | null>(null);

  const [activeAllocation, setActiveAllocation] =
    useState<Allocation | null>(null);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (!selectedAsset) return;

    checkAllocation();
  }, [selectedAsset]);

  async function checkAllocation() {
    try {
      setLoading(true);

      const res =
        await allocationService.getAll();

      const active =
        (res.data ?? []).find(
          (allocation: Allocation) =>
            allocation.asset.id ===
              selectedAsset?.id &&
            !allocation.returnedAt
        ) ?? null;

      setActiveAllocation(active);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <AssetSelector
        value={selectedAsset?.id ?? null}
        onChange={setSelectedAsset}
      />

      {loading && (
        <div className="rounded-xl border bg-white p-8 text-center">
          Checking asset...
        </div>
      )}

      {!loading &&
        selectedAsset &&
        !activeAllocation && (
          <AllocationForm
            onSuccess={checkAllocation}
          />
        )}

      {!loading &&
        activeAllocation && (
          <>
            <AllocationWarning
              allocation={activeAllocation}
            />

            <TransferRequestForm
              allocation={activeAllocation}
              onSuccess={checkAllocation}
            />

            <AllocationHistory
              assetId={
                activeAllocation.asset.id
              }
            />
          </>
        )}
    </div>
  );
}