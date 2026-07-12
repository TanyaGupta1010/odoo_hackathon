import type { Allocation } from "../../types/allocation";
import StatusBadge from "./StatusBadge";
import EmptyState from "./EmptyState";

interface AllocationTableProps {
  allocations: Allocation[];
  loading: boolean;
  onReturn?: (allocationId: number) => void;
}

export default function AllocationTable({
  allocations,
  loading,
  onReturn,
}: AllocationTableProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
        <p className="text-slate-500">Loading allocations...</p>
      </div>
    );
  }

  if (!allocations.length) {
    return (
      <EmptyState
        title="No Allocations Found"
        description="Allocate an asset to an employee to see records here."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Active Allocations
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm text-slate-600">
              <th className="px-6 py-4 font-semibold">Asset</th>
              <th className="px-6 py-4 font-semibold">Employee</th>
              <th className="px-6 py-4 font-semibold">Allocated On</th>
              <th className="px-6 py-4 font-semibold">Expected Return</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {allocations.map((allocation) => (
              <tr
                key={allocation.id}
                className="border-t border-slate-100 hover:bg-slate-50 transition"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-slate-900">
                      {allocation.asset.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      {allocation.asset.assetTag}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4">
                  {allocation.employee.name}
                </td>

                <td className="px-6 py-4">
                  {new Date(
                    allocation.allocatedAt
                  ).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  {allocation.expectedReturnDate
                    ? new Date(
                        allocation.expectedReturnDate
                      ).toLocaleDateString()
                    : "-"}
                </td>

                <td className="px-6 py-4">
                  <StatusBadge
                    status={
                      allocation.returnedAt
                        ? "Returned"
                        : "Allocated"
                    }
                  />
                </td>

                <td className="px-6 py-4 text-center">
                  {!allocation.returnedAt && (
                    <button
                      onClick={() =>
                        onReturn?.(allocation.id)
                      }
                      className="rounded-md bg-[#1F6E5A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#185847]"
                    >
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}