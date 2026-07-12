import type { Transfer } from "../../types/allocation";
import StatusBadge from "./StatusBadge";
import EmptyState from "./EmptyState";

interface TransferTableProps {
  transfers: Transfer[];
  loading: boolean;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
}

export default function TransferTable({
  transfers,
  loading,
  onApprove,
  onReject,
}: TransferTableProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
        <p className="text-slate-500">Loading transfer requests...</p>
      </div>
    );
  }

  if (!transfers.length) {
    return (
      <EmptyState
        title="No Transfer Requests"
        description="Transfer requests will appear here when employees request an asset transfer."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Transfer Requests
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm text-slate-600">
              <th className="px-6 py-4 font-semibold">Asset</th>
              <th className="px-6 py-4 font-semibold">From</th>
              <th className="px-6 py-4 font-semibold">To</th>
              <th className="px-6 py-4 font-semibold">Reason</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 text-center font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {transfers.map((transfer) => (
              <tr
                key={transfer.id}
                className="border-t border-slate-100 hover:bg-slate-50 transition"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-slate-900">
                      {transfer.asset.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      {transfer.asset.assetTag}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4">
                  {transfer.fromEmployee.name}
                </td>

                <td className="px-6 py-4">
                  {transfer.toEmployee.name}
                </td>

                <td className="px-6 py-4 max-w-xs">
                  <p className="truncate">{transfer.reason}</p>
                </td>

                <td className="px-6 py-4">
                  <StatusBadge status={transfer.status} />
                </td>

                <td className="px-6 py-4">
                  {transfer.status === "Pending" ? (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onApprove?.(transfer.id)}
                        className="rounded-md bg-[#1F6E5A] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#185847]"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => onReject?.(transfer.id)}
                        className="rounded-md border border-red-500 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <StatusBadge status={transfer.status} />
                    </div>
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