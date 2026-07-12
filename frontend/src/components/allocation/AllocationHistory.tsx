import { useEffect, useState } from "react";
import { allocationService } from "../../services/allocation.service";

interface Props {
  assetId: number;
}

export default function AllocationHistory({
  assetId,
}: Props) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [assetId]);

  async function loadHistory() {
    try {
      setLoading(true);

      const res =
        await allocationService.getHistory(assetId);

      setHistory(res.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">
        Allocation History
      </h2>

      {loading ? (
        <div className="py-8 text-center">
          Loading...
        </div>
      ) : history.length === 0 ? (
        <div className="py-8 text-center text-slate-500">
          No History Found
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border p-4"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">
                    {item.employee?.name}
                  </p>

                  <p className="text-sm text-slate-500">
                    {item.department?.name ??
                      "No Department"}
                  </p>
                </div>

                <div className="text-right text-sm">
                  <p>
                    Allocated:
                    {" "}
                    {new Date(
                      item.allocatedAt
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    Returned:
                    {" "}
                    {item.returnedAt
                      ? new Date(
                          item.returnedAt
                        ).toLocaleDateString()
                      : "Currently Assigned"}
                  </p>
                </div>
              </div>

              {item.returnCondition && (
                <p className="mt-3 text-sm">
                  <span className="font-medium">
                    Condition:
                  </span>{" "}
                  {item.returnCondition}
                </p>
              )}

              {item.checkinNotes && (
                <p className="mt-1 text-sm text-slate-600">
                  {item.checkinNotes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}