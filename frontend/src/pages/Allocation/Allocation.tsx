import { useEffect, useMemo, useState } from "react";

import AllocationHeader from "../../components/allocation/AllocationHeader";
import AllocationStats from "../../components/allocation/AllocationStats";
import AllocationForm from "../../components/allocation/AllocationForm";
import AllocationSearch from "../../components/allocation/AllocationSearch";
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

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("ALL");

  async function loadAllocations() {
    try {
      setLoadingAllocations(true);

      const res = await allocationService.getAll();

      setAllocations(res.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAllocations(false);
    }
  }

  async function loadTransfers() {
    try {
      setLoadingTransfers(true);

      const res = await transferService.getAll();

      setTransfers(res.data ?? []);
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
      loadAllocations();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleApprove(id: number) {
    try {
      await transferService.approve(id);

      loadTransfers();
      loadAllocations();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleReject(id: number) {
    try {
      await transferService.reject(id);

      loadTransfers();
    } catch (err) {
      console.error(err);
    }
  }

  const filteredAllocations = useMemo(() => {
    return allocations.filter((allocation) => {
      const text =
        `${allocation.asset.name} ${allocation.asset.assetTag} ${allocation.employee.name}`.toLowerCase();

      const searchMatch = text.includes(
        search.toLowerCase()
      );

      if (status === "ALL") {
        return searchMatch;
      }

      if (status === "Allocated") {
        return searchMatch && !allocation.returnedAt;
      }

      if (status === "Returned") {
        return searchMatch && !!allocation.returnedAt;
      }

      return searchMatch;
    });
  }, [allocations, search, status]);

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
        onSuccess={loadAllocations}
      />

      <AllocationSearch
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onReset={() => {
          setSearch("");
          setStatus("ALL");
        }}
      />

      <AllocationTable
        allocations={filteredAllocations}
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