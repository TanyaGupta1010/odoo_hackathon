import type {
  Allocation,
} from "../../types/allocation";

interface Props {
  allocation: Allocation;
}

export default function AllocationWarning({
  allocation,
}: Props) {
  return (
    <div className="rounded-xl border border-red-300 bg-red-50 p-5">
      <h3 className="font-semibold text-red-700">
        Asset Already Allocated
      </h3>

      <p className="mt-2 text-sm text-red-600">
        This asset is currently allocated to{" "}
        <span className="font-semibold">
          {allocation.employee.name}
        </span>

        {allocation.department && (
          <>
            {" "}
            (
            {allocation.department.name}
            )
          </>
        )}
      </p>

      <p className="mt-1 text-sm text-red-500">
        Direct re-allocation is blocked.
        Submit a transfer request below.
      </p>
    </div>
  );
}