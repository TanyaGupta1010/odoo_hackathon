import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  Info,
  ShieldCheck,
  LineChart,
  User,
  Mail,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "MILITARY GRADE SECURITY",
    body: "AES-256 encryption across all data silos and transfer protocols.",
  },
  {
    icon: LineChart,
    title: "PREDICTIVE ANALYTICS",
    body: "Anticipate maintenance needs before downtime occurs.",
  },
];

const avatars = ["#3B5C4A", "#4A6FA5", "#8A5A44", "#5A5A6E"];

const Signup = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    navigate("/dashboard");
  };

  return (
    <div className="grid min-h-screen bg-white md:grid-cols-2">
      {/* Left: dark green brand panel */}
      <div className="relative hidden flex-col justify-between bg-[#0C3327] p-12 text-white md:flex">
        <div className="flex items-center gap-2.5">
          <Package size={24} />
          <span className="text-xl font-bold">AssetFlow</span>
        </div>

        <div className="max-w-md">
          <h2 className="text-4xl font-bold leading-tight tracking-tight">
            Orchestrate your enterprise assets with absolute precision.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-white/65">
            Join the world's most disciplined logistics teams. Secure, real-time
            tracking for heavy industry and global supply chains.
          </p>

          <div className="mt-10 space-y-6">
            {features.map((f) => (
              <div key={f.title} className="flex gap-3.5">
                <f.icon size={20} className="mt-0.5 shrink-0 text-white/80" />
                <div>
                  <p className="text-xs font-bold tracking-wide">{f.title}</p>
                  <p className="mt-1 text-xs text-white/60">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2.5">
            {avatars.map((c, i) => (
              <span
                key={i}
                className="h-7 w-7 rounded-full border-2 border-[#0C3327]"
                style={{ background: `linear-gradient(135deg, ${c}, ${c}cc)` }}
              />
            ))}
          </div>
          <p className="text-[11px] italic text-white/50">
            Trusted by 400+ Enterprise Operations Globally
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex flex-col px-6 py-8 sm:px-10">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
          <h1 className="text-2xl font-bold tracking-tight text-[#1A2B4A]">
            Create Enterprise Account
          </h1>
          <p className="mt-1.5 text-sm text-[#6B7683]">
            Register your corporate credentials to access the AssetFlow ERP
            environment.
          </p>

          <div className="mt-6 flex gap-3 rounded-r-md border-l-4 border-[#1F6E5A] bg-[#EEF6F2] p-4">
            <Info size={16} className="mt-0.5 shrink-0 text-[#1F6E5A]" />
            <div>
              <p className="text-[10px] font-bold tracking-widest text-[#1F6E5A]">
                REGISTRATION POLICY
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#6B7683]">
                Administrative roles and permissions are assigned by your
                organization's Global Admin after initial account verification.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold tracking-wide text-[#4A5560]">
                FULL NAME
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA5AF]"
                />
                <input
                  type="text"
                  required
                  placeholder="E.g., Jonathan Sterling"
                  className="w-full rounded-lg border border-[#E1E6EA] bg-[#F7F9FA] py-2.5 pl-10 pr-3.5 text-sm text-[#203030] transition placeholder:text-[#9AA5AF] focus:border-[#1F6E5A] focus:bg-white focus:ring-2 focus:ring-[#1F6E5A]/15"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold tracking-wide text-[#4A5560]">
                CORPORATE EMAIL
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA5AF]"
                />
                <input
                  type="email"
                  required
                  placeholder="j.sterling@enterprise.com"
                  className="w-full rounded-lg border border-[#E1E6EA] bg-[#F7F9FA] py-2.5 pl-10 pr-3.5 text-sm text-[#203030] transition placeholder:text-[#9AA5AF] focus:border-[#1F6E5A] focus:bg-white focus:ring-2 focus:ring-[#1F6E5A]/15"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold tracking-wide text-[#4A5560]">
                PASSWORD
              </label>
              <input
                type="password"
                required
                minLength={12}
                placeholder="••••••••••••"
                className="w-full rounded-lg border border-[#E1E6EA] bg-[#F7F9FA] px-3.5 py-2.5 text-sm text-[#203030] transition placeholder:text-[#9AA5AF] focus:border-[#1F6E5A] focus:bg-white focus:ring-2 focus:ring-[#1F6E5A]/15"
              />
              <p className="mt-1.5 text-[11px] text-[#8A97A5]">
                Minimum 12 characters, including one symbol.
              </p>
            </div>

            <label className="flex items-start gap-2.5 pt-1 text-xs text-[#6B7683]">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[#D5DBE0] accent-[#1F6E5A]"
              />
              <span className="tracking-wide">
                I AGREE TO THE{" "}
                <a href="#" className="font-semibold text-[#1F6E5A] underline">
                  TERMS OF SERVICE
                </a>{" "}
                AND{" "}
                <a href="#" className="font-semibold text-[#1F6E5A] underline">
                  DATA PRIVACY POLICY
                </a>
              </span>
            </label>

            <button
              type="submit"
              disabled={!agreed}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1F6E5A] py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-[#195C4B] disabled:cursor-not-allowed disabled:opacity-50"
            >
              CREATE ACCOUNT
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="my-6 h-px bg-[#E7ECEF]" />

          <p className="text-center text-xs text-[#6B7683]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold tracking-wide text-[#1A2B4A] hover:underline"
            >
              LOG IN HERE
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;
