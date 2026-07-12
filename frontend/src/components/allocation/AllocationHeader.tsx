interface AllocationHeaderProps {
  onAllocate?: () => void;
}

export default function AllocationHeader({
  onAllocate,
}: AllocationHeaderProps) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Asset Allocation & Transfer
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Allocate assets, monitor assignments and manage transfers across
          departments.
        </p>
      </div>

      <button
        type="button"
        onClick={onAllocate}
        className="rounded-lg bg-[#1F6E5A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#185847]"
      >
        + Allocate Asset
      </button>
    </div>
  );
}