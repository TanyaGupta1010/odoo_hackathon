import type { Allocation } from "../../types/allocation";
import StatusBadge from "./StatusBadge";
import EmptyState from "./EmptyState";

interface Props {
  allocations: Allocation[];
  loading: boolean;
  onReturn: (id: number) => void;
}

export default function AllocationTable({
  allocations,
  loading,
  onReturn,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        Loading allocations...
      </div>
    );
  }

  if (!allocations.length) {
    return (
      <EmptyState
        title="No Allocations"
        description="Allocate an asset to see records here."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">
          Active Allocations
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm">
              <th className="px-6 py-4">Asset</th>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Allocated</th>
              <th className="px-6 py-4">Return</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>

          <tbody>
            {allocations.map((allocation) => (
              <tr
                key={allocation.id}
                className="border-t hover:bg-slate-50"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">
                      {allocation.asset.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      {allocation.asset.assetTag}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4">
                  {allocation.employee.name}
                </td>

                <td className="px-6 py-4">
                  {allocation.department?.name ?? "-"}
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

                <td className="px-6 py-4">
                  {!allocation.returnedAt && (
                    <button
                      onClick={() =>
                        onReturn(allocation.id)
                      }
                      className="rounded-lg bg-[#1F6E5A] px-4 py-2 text-sm text-white hover:bg-[#185847]"
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