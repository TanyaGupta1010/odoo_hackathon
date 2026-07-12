import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Boxes, Info, ShieldCheck, LineChart } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Military Grade Security",
    body: "AES-256 encryption across all data silos and transfer protocols.",
  },
  {
    icon: LineChart,
    title: "Predictive Analytics",
    body: "Anticipate maintenance needs before downtime occurs.",
  },
];

const Signup = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B1220] p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl md:grid-cols-2">
        {/* Left: green panel */}
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-[#1F6E5A] to-[#0D3B30] p-10 text-white md:flex">
          <div className="flex items-center gap-2">
            <Boxes size={22} />
            <span className="text-lg font-bold">AssetFlow</span>
          </div>

          <div>
            <h2 className="mb-4 text-3xl font-bold leading-tight">
              Orchestrate your enterprise assets with absolute precision.
            </h2>
            <p className="mb-8 text-sm text-white/70">
              Join the world's most disciplined logistics teams. Secure,
              real-time tracking for heavy industry and global supply chains.
            </p>

            <div className="space-y-5">
              {features.map((f) => (
                <div key={f.title} className="flex gap-3">
                  <f.icon size={18} className="mt-0.5 shrink-0 text-white/80" />
                  <div>
                    <p className="text-xs font-bold tracking-wide">{f.title}</p>
                    <p className="text-xs text-white/60">{f.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-white/50">
            Trusted by 400+ Enterprise Operations Globally
          </p>
        </div>

        {/* Right: form */}
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <h1 className="mb-1 text-2xl font-bold text-[#22324A]">
            Create Enterprise Account
          </h1>
          <p className="mb-6 text-sm text-[#75808A]">
            Register your corporate credentials to access the AssetFlow ERP
            environment.
          </p>

          <div className="mb-6 flex gap-3 rounded-lg border-l-4 border-[#1F6E5A] bg-[#F5F7F9] p-4">
            <Info size={16} className="mt-0.5 shrink-0 text-[#1F6E5A]" />
            <div>
              <p className="text-[10px] font-bold tracking-widest text-[#1F6E5A]">
                REGISTRATION POLICY
              </p>
              <p className="mt-1 text-xs text-[#75808A]">
                Administrative roles and permissions are assigned by your
                organization's Global Admin after initial account verification.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-[#22324A]">
                FULL NAME
              </label>
              <input
                type="text"
                required
                placeholder="E.g. Jonathan Sterling"
                className="w-full rounded-lg border border-[#E7ECEF] bg-[#F5F7F9] px-3.5 py-2.5 text-sm text-[#203030] transition focus:border-[#1F6E5A] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-[#22324A]">
                CORPORATE EMAIL
              </label>
              <input
                type="email"
                required
                placeholder="j.sterling@enterprise.com"
                className="w-full rounded-lg border border-[#E7ECEF] bg-[#F5F7F9] px-3.5 py-2.5 text-sm text-[#203030] transition focus:border-[#1F6E5A] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-[#22324A]">
                PASSWORD
              </label>
              <input
                type="password"
                required
                minLength={12}
                placeholder="••••••••••••"
                className="w-full rounded-lg border border-[#E7ECEF] bg-[#F5F7F9] px-3.5 py-2.5 text-sm text-[#203030] transition focus:border-[#1F6E5A] focus:bg-white"
              />
              <p className="mt-1.5 text-[11px] text-[#75808A]">
                Minimum 12 characters, including one symbol.
              </p>
            </div>

            <label className="flex items-start gap-2 text-xs text-[#75808A]">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[#E7ECEF] accent-[#1F6E5A]"
              />
              <span>
                I AGREE TO THE{" "}
                <a href="#" className="font-semibold text-[#1F6E5A] hover:underline">
                  TERMS OF SERVICE
                </a>{" "}
                AND{" "}
                <a href="#" className="font-semibold text-[#1F6E5A] hover:underline">
                  DATA PRIVACY POLICY
                </a>
              </span>
            </label>

            <button
              type="submit"
              disabled={!agreed}
              className="w-full rounded-lg bg-[#1F6E5A] py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-[#2C8A71] disabled:cursor-not-allowed disabled:opacity-50"
            >
              CREATE ACCOUNT
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#75808A]">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#1F6E5A] hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
