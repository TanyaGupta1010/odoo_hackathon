import {
  ArrowRightLeft,
  ClipboardList,
  Package,
} from "lucide-react";

interface Props {
  allocated: number;
  pendingTransfers: number;
  returnsDue: number;
}

const Card = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </h2>
        </div>

        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
          {icon}
        </div>
      </div>
    </div>
  );
};

const AllocationStats = ({
  allocated,
  pendingTransfers,
  returnsDue,
}: Props) => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card
        title="Allocated Assets"
        value={allocated}
        icon={<Package size={22} />}
      />

      <Card
        title="Pending Transfers"
        value={pendingTransfers}
        icon={<ArrowRightLeft size={22} />}
      />

      <Card
        title="Returns Due"
        value={returnsDue}
        icon={<ClipboardList size={22} />}
      />
    </div>
  );
};

export default AllocationStats;