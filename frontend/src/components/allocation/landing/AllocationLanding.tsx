import {
  ArrowRightLeft,
  ClipboardList,
  ShieldCheck,
  Users,
} from "lucide-react";

import FeatureCard from "./FeatureCard";
import InfoBanner from "./InfoBanner";

export default function AllocationLanding() {
  return (
    <div className="mt-10">
      <div className="mx-auto max-w-5xl text-center">
        {/* <img
          src="https://cdn-icons-png.flaticon.com/512/3082/3082037.png"
          alt="allocation"
          className="mx-auto mb-8 h-52 object-contain"
        /> */}

        <h1 className="text-3xl font-bold text-slate-800">
          Welcome to Allocation & Transfer
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-500">
          Allocate assets to employees or departments,
          transfer ownership, monitor allocation history
          and manage the complete lifecycle of every asset
          from one place.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <FeatureCard
          icon={Users}
          title="Allocate Assets"
          description="Assign available assets quickly to employees or departments with complete ownership tracking."
        />

        <FeatureCard
          icon={ArrowRightLeft}
          title="Transfer Ownership"
          description="Move assets between employees using approval-based transfer requests."
        />

        <FeatureCard
          icon={ClipboardList}
          title="Track History"
          description="View complete allocation history, returns and transfer records for every asset."
        />

        <FeatureCard
          icon={ShieldCheck}
          title="Ensure Accountability"
          description="Maintain transparency with approvals, audit history and asset ownership records."
        />
      </div>

      <InfoBanner />
    </div>
  );
}