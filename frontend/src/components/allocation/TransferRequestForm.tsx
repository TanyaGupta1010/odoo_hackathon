import { useEffect, useState } from "react";
import { allocationService } from "../../services/allocation.service";
import { transferService } from "../../services/transfer.service";
import type {
  Allocation,
  Employee,
} from "../../types/allocation";

interface Props {
  allocation: Allocation;
  onSuccess: () => void;
}

export default function TransferRequestForm({
  allocation,
  onSuccess,
}: Props) {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [toEmployeeId, setToEmployeeId] =
    useState("");

  const [reason, setReason] = useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    try {
      const data =
        await allocationService.getEmployees();

      setEmployees(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!toEmployeeId) {
      alert("Select employee");
      return;
    }

    if (reason.trim().length < 5) {
      alert(
        "Reason should contain minimum 5 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const res =
        await transferService.create({
          assetId: allocation.asset.id,
          fromEmployeeId:
            allocation.employee.id,
          toEmployeeId:
            Number(toEmployeeId),
          reason,
        });

      if (!res.success) {
        alert("Transfer failed");
        return;
      }

      alert("Transfer request created.");

      setReason("");
      setToEmployeeId("");

      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border bg-white p-6 shadow-sm"
    >
      <h2 className="mb-5 text-xl font-semibold">
        Transfer Request
      </h2>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">
            From
          </label>

          <input
            readOnly
            value={allocation.employee.name}
            className="w-full rounded-lg border bg-slate-100 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Transfer To
          </label>

          <select
            value={toEmployeeId}
            onChange={(e) =>
              setToEmployeeId(
                e.target.value
              )
            }
            className="w-full rounded-lg border p-3"
          >
            <option value="">
              Select Employee
            </option>

            {employees
              .filter(
                (e) =>
                  e.id !==
                  allocation.employee.id
              )
              .map((employee) => (
                <option
                  key={employee.id}
                  value={employee.id}
                >
                  {employee.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Reason
          </label>

          <textarea
            rows={4}
            value={reason}
            onChange={(e) =>
              setReason(e.target.value)
            }
            className="w-full rounded-lg border p-3"
            placeholder="Reason for transfer..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#1F6E5A] py-3 font-medium text-white hover:bg-[#185847] disabled:opacity-50"
        >
          {loading
            ? "Submitting..."
            : "Submit Transfer Request"}
        </button>
      </div>
    </form>
  );
}