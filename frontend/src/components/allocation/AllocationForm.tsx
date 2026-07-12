import { useEffect, useState } from "react";
import { allocationService } from "../../services/allocation.service";

interface Asset {
  id: number;
  assetTag: string;
  name: string;
}

interface Employee {
  id: number;
  name: string;
}

interface Props {
  onSuccess?: () => void;
}

const AllocationForm = ({ onSuccess }: Props) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    assetId: "",
    employeeId: "",
    expectedReturnDate: "",
    departmentId: "",
    reason: "",
  });

  useEffect(() => {
    loadDropdowns();
  }, []);

  const loadDropdowns = async () => {
    try {
      const [assetRes, employeeRes] = await Promise.all([
        allocationService.getAssets(),
        allocationService.getEmployees(),
      ]);

      setAssets(assetRes);
      setEmployees(employeeRes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!form.assetId || !form.employeeId) {
      alert("Please select asset and employee.");
      return;
    }

    try {
      setLoading(true);

      await allocationService.create({
        assetId: Number(form.assetId),
        employeeId: Number(form.employeeId),
        departmentId: form.departmentId
          ? Number(form.departmentId)
          : undefined,
        expectedReturnDate:
          form.expectedReturnDate || undefined,
      });

      setForm({
        assetId: "",
        employeeId: "",
        expectedReturnDate: "",
        departmentId: "",
        reason: "",
      });

      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Unable to allocate asset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">
        Allocate Asset
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Asset
            </label>

            <select
              name="assetId"
              value={form.assetId}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            >
              <option value="">Select Asset</option>

              {assets.map((asset) => (
                <option
                  key={asset.id}
                  value={asset.id}
                >
                  {asset.assetTag} • {asset.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Employee
            </label>

            <select
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            >
              <option value="">Select Employee</option>

              {employees.map((employee) => (
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
              Expected Return
            </label>

            <input
              type="date"
              name="expectedReturnDate"
              value={form.expectedReturnDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Department ID
            </label>

            <input
              type="number"
              name="departmentId"
              value={form.departmentId}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Reason
          </label>

          <textarea
            rows={4}
            name="reason"
            value={form.reason}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
            placeholder="Reason for allocation..."
          />
        </div>

        <div className="flex justify-end">
          <button
            disabled={loading}
            className="rounded-lg bg-[#1F6E5A] px-6 py-3 font-medium text-white transition hover:bg-[#175544] disabled:opacity-50"
          >
            {loading ? "Allocating..." : "Allocate Asset"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AllocationForm;