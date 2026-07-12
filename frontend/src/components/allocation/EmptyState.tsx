import { PackageOpen } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-8 py-16">
      <div className="rounded-full bg-slate-100 p-5">
        <PackageOpen className="h-10 w-10 text-slate-500" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-800">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-center text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}