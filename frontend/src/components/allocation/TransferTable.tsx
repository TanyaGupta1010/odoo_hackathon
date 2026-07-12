import type { Transfer } from "../../types/allocation";
import StatusBadge from "./StatusBadge";
import EmptyState from "./EmptyState";

interface Props {
  transfers: Transfer[];
  loading: boolean;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

export default function TransferTable({
  transfers,
  loading,
  onApprove,
  onReject,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        Loading transfer requests...
      </div>
    );
  }

  if (!transfers.length) {
    return (
      <EmptyState
        title="No Transfer Requests"
        description="Transfer requests will appear here."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">
          Transfer Requests
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm">
              <th className="px-6 py-4">Asset</th>
              <th className="px-6 py-4">From</th>
              <th className="px-6 py-4">To</th>
              <th className="px-6 py-4">Reason</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {transfers.map((transfer) => (
              <tr
                key={transfer.id}
                className="border-t hover:bg-slate-50"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">
                      {transfer.asset.name}
                    </p>

                    <p className="text-xs text-slate-500">
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

                <td className="px-6 py-4">
                  {transfer.reason}
                </td>

                <td className="px-6 py-4">
                  <StatusBadge
                    status={transfer.status}
                  />
                </td>

                <td className="px-6 py-4">
                  {transfer.status ===
                  "Pending" ? (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          onApprove(
                            transfer.id
                          )
                        }
                        className="rounded-lg bg-[#1F6E5A] px-4 py-2 text-sm text-white hover:bg-[#185847]"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          onReject(
                            transfer.id
                          )
                        }
                        className="rounded-lg border border-red-500 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <StatusBadge
                        status={
                          transfer.status
                        }
                      />
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