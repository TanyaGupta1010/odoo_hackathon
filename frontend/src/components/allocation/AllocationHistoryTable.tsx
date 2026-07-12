import { useEffect, useState } from "react";
import { allocationService } from "../../services/allocation.service";

interface Props {
  assetId: number | null;
}

export default function AllocationHistoryTable({
  assetId,
}: Props) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!assetId) return;

    loadHistory();
  }, [assetId]);

  async function loadHistory() {
    try {
      setLoading(true);

      const res = await allocationService.getHistory(
        assetId!
      );

      setHistory(res.data ?? []);
    } finally {
      setLoading(false);
    }
  }

  if (!assetId) return null;

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">
          Allocation History
        </h2>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          Loading...
        </div>
      ) : history.length === 0 ? (
        <div className="p-8 text-center text-slate-500">
          No History
        </div>
      ) : (
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left">
                Employee
              </th>
              <th className="px-6 py-4 text-left">
                Department
              </th>
              <th className="px-6 py-4 text-left">
                Allocated
              </th>
              <th className="px-6 py-4 text-left">
                Returned
              </th>
            </tr>
          </thead>

          <tbody>
            {history.map((item) => (
              <tr
                key={item.id}
                className="border-t"
              >
                <td className="px-6 py-4">
                  {item.employee?.name}
                </td>

                <td className="px-6 py-4">
                  {item.department?.name ??
                    "-"}
                </td>

                <td className="px-6 py-4">
                  {new Date(
                    item.allocatedAt
                  ).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  {item.returnedAt
                    ? new Date(
                        item.returnedAt
                      ).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}