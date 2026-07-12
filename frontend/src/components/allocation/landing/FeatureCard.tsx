import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-[#E9F8F2]">
        <Icon
          size={30}
          className="text-[#1F6E5A]"
        />
      </div>

      <h3 className="mb-3 text-xl font-semibold text-slate-800">
        {title}
      </h3>

      <p className="leading-7 text-slate-500">
        {description}
      </p>
    </div>
  );
}