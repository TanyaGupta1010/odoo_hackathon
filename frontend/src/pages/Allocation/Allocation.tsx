import {
  ArrowRightLeft,
  ClipboardList,
  Package,
  UserRound,
} from "lucide-react";

const StatCard = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-center gap-4">
      <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
        {icon}
      </div>

      <div>
        <p className="text-sm text-slate-500">{title}</p>

        <h2 className="mt-1 text-3xl font-bold text-slate-900">{value}</h2>
      </div>
    </div>
  </div>
);

const Allocation = () => {
  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Asset Allocation & Transfer
          </h1>

          <p className="mt-2 text-slate-500">
            Allocate enterprise assets, manage transfers and monitor history.
          </p>
        </div>

        <button className="rounded-xl bg-emerald-700 px-5 py-3 font-medium text-white transition hover:bg-emerald-800">
          Allocate Asset
        </button>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          icon={<Package size={22} />}
          title="Allocated Assets"
          value="0"
        />

        <StatCard
          icon={<ArrowRightLeft size={22} />}
          title="Pending Transfers"
          value="0"
        />

        <StatCard
          icon={<ClipboardList size={22} />}
          title="Returns Due"
          value="0"
        />
      </div>

      {/* Allocation Form */}

      <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-slate-800">
          Allocate Asset
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Asset
            </label>

            <select className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600">
              <option>Select Asset</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Employee
            </label>

            <select className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600">
              <option>Select Employee</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Expected Return Date
            </label>

            <input
              type="date"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Department
            </label>

            <input
              placeholder="Engineering"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium">
            Reason
          </label>

          <textarea
            rows={4}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button className="rounded-xl bg-emerald-700 px-6 py-3 font-medium text-white hover:bg-emerald-800">
            Allocate Asset
          </button>
        </div>
      </div>

      {/* Table */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-semibold">
            Active Allocations
          </h2>
        </div>

        <table className="w-full">
          <thead className="bg-slate-50 text-left text-sm uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4">Asset</th>
              <th>Employee</th>
              <th>Return Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td
                colSpan={5}
                className="py-16 text-center text-slate-400"
              >
                <div className="flex flex-col items-center gap-4">
                  <UserRound size={40} />

                  <span>No Allocations Yet</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Allocation;