import { useEffect, useState } from "react";
import { allocationService } from "../../services/allocation.service";
import { transferService } from "../../services/transfer.service";
import type { Asset, Employee } from "../../types/allocation";

interface Props {
  onSuccess: () => void;
}

export default function TransferForm({ onSuccess }: Props) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [assetId, setAssetId] = useState("");
  const [fromEmployeeId, setFromEmployeeId] = useState("");
  const [toEmployeeId, setToEmployeeId] = useState("");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const assets = await allocationService.getAssets();
      const employees = await allocationService.getEmployees();

      setAssets(assets);
      setEmployees(employees);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    console.log("Transfer form submitted");

    if (!assetId) {
      alert("Select an asset");
      return;
    }

    if (!fromEmployeeId) {
      alert("Select From Employee");
      return;
    }

    if (!toEmployeeId) {
      alert("Select To Employee");
      return;
    }

    if (reason.trim().length < 5) {
      alert("Reason should be at least 5 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await transferService.create({
        assetId: Number(assetId),
        fromEmployeeId: Number(fromEmployeeId),
        toEmployeeId: Number(toEmployeeId),
        reason,
      });

      console.log(response);

      if (!response.success) {
        alert(response.message || "Transfer creation failed");
        return;
      }

      setAssetId("");
      setFromEmployeeId("");
      setToEmployeeId("");
      setReason("");

      await onSuccess();

      alert("Transfer request created successfully.");
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">
        Create Transfer Request
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid gap-5 md:grid-cols-2"
      >
        <select
          value={assetId}
          onChange={(e) => setAssetId(e.target.value)}
          className="rounded-lg border p-3"
        >
          <option value="">Select Asset</option>

          {assets
            .filter((a) => a.status === "Allocated")
            .map((asset) => (
              <option
                key={asset.id}
                value={asset.id}
              >
                {asset.assetTag} - {asset.name}
              </option>
            ))}
        </select>

        <select
          value={fromEmployeeId}
          onChange={(e) =>
            setFromEmployeeId(e.target.value)
          }
          className="rounded-lg border p-3"
        >
          <option value="">From Employee</option>

          {employees.map((employee) => (
            <option
              key={employee.id}
              value={employee.id}
            >
              {employee.name}
            </option>
          ))}
        </select>

        <select
          value={toEmployeeId}
          onChange={(e) =>
            setToEmployeeId(e.target.value)
          }
          className="rounded-lg border p-3"
        >
          <option value="">To Employee</option>

          {employees.map((employee) => (
            <option
              key={employee.id}
              value={employee.id}
            >
              {employee.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={reason}
          onChange={(e) =>
            setReason(e.target.value)
          }
          placeholder="Reason for transfer"
          className="rounded-lg border p-3"
        />

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-[#1F6E5A] px-6 py-3 font-medium text-white hover:bg-[#185847] disabled:opacity-50"
          >
            {loading
              ? "Creating..."
              : "Create Transfer"}
          </button>
        </div>
      </form>
    </div>
  );
}