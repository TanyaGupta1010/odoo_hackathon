import { useEffect, useState } from "react";
import { allocationService } from "../../services/allocation.service";
import type {
  Asset,
  Employee,
} from "../../types/allocation";

interface Props {
  onSuccess: () => void;
}

export default function AllocationForm({
  onSuccess,
}: Props) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [assetId, setAssetId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [expectedReturnDate, setExpectedReturnDate] =
    useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const assets = await allocationService.getAssets();
    const employees =
      await allocationService.getEmployees();

    setAssets(assets);
    setEmployees(employees);
  }

  async function handleSubmit(
  e: React.FormEvent
) {
  e.preventDefault();

  if (!assetId || !employeeId) return;

  try {
    const res = await allocationService.create({
      assetId: Number(assetId),
      employeeId: Number(employeeId),
      expectedReturnDate,
    });

    console.log("CREATE RESPONSE:", res);

    setAssetId("");
    setEmployeeId("");
    setExpectedReturnDate("");

    await onSuccess();
  } catch (err) {
    console.error("CREATE ERROR:", err);
  }
}

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">
        Allocate Asset
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid gap-5 md:grid-cols-2"
      >
        <select
          value={assetId}
          onChange={(e) =>
            setAssetId(e.target.value)
          }
          className="rounded-lg border p-3"
        >
          <option value="">
            Select Asset
          </option>

          {assets
            .filter(
              (a) => a.status === "Available"
            )
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
          value={employeeId}
          onChange={(e) =>
            setEmployeeId(e.target.value)
          }
          className="rounded-lg border p-3"
        >
          <option value="">
            Select Employee
          </option>

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
          type="date"
          value={expectedReturnDate}
          onChange={(e) =>
            setExpectedReturnDate(
              e.target.value
            )
          }
          className="rounded-lg border p-3"
        />

        <button
          className="rounded-lg bg-[#1F6E5A] text-white"
        >
          Allocate Asset
        </button>
      </form>
    </div>
  );
}