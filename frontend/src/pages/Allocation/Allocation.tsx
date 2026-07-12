import { useEffect, useState } from "react";

import AllocationHeader from "../../components/allocation/AllocationHeader";
import AllocationStats from "../../components/allocation/AllocationStats";
import AllocationForm from "../../components/allocation/AllocationForm";
import AllocationTable from "../../components/allocation/AllocationTable";
import TransferTable from "../../components/allocation/TransferTable";

import { allocationService } from "../../services/allocation.service";
import { transferService } from "../../services/transfer.service";

import type {
  Allocation,
  Transfer,
} from "../../types/allocation";

export default function Allocation() {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  const [loadingAllocations, setLoadingAllocations] =
    useState(true);

  const [loadingTransfers, setLoadingTransfers] =
    useState(true);

  async function loadAllocations() {
    try {
      setLoadingAllocations(true);

      const data = await allocationService.getAll();

      setAllocations(data.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAllocations(false);
    }
  }

  async function loadTransfers() {
    try {
      setLoadingTransfers(true);

      const data = await transferService.getAll();

      setTransfers(data.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTransfers(false);
    }
  }

  useEffect(() => {
    loadAllocations();
    loadTransfers();
  }, []);

  async function handleReturn(id: number) {
    try {
      await allocationService.returnAsset(id);

      await loadAllocations();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleApprove(id: number) {
    try {
      await transferService.approve(id);

      await loadTransfers();
      await loadAllocations();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleReject(id: number) {
    try {
      await transferService.reject(id);

      await loadTransfers();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-8">
      <AllocationHeader />

      <AllocationStats
        allocated={allocations.length}
        pendingTransfers={
          transfers.filter(
            (t) => t.status === "Pending"
          ).length
        }
        returnsDue={
          allocations.filter(
            (a) => !a.returnedAt
          ).length
        }
      />

      <AllocationForm
        onSuccess={() => {
          loadAllocations();
        }}
      />

      <AllocationTable
        allocations={allocations}
        loading={loadingAllocations}
        onReturn={handleReturn}
      />

      <TransferTable
        transfers={transfers}
        loading={loadingTransfers}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}