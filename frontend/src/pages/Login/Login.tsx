import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";

import GoogleButton from "./GoogleButton";

const stats = [
  { value: "1.2B", label: "Assets Tracked" },
  { value: "99.9%", label: "Audit Accuracy" },
  { value: "15ms", label: "Query Latency" },
];

const Login = () => {
  const navigate = useNavigate();
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B1220] p-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl md:min-h-[520px] md:grid-cols-2">
        {/* Left: form */}
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <div className="mb-8 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#1F6E5A] text-white">
              <Building2 size={18} />
            </span>
            <div className="leading-tight">
              <p className="text-base font-bold text-[#22324A]">AssetFlow</p>
              <p className="text-[10px] font-semibold tracking-widest text-[#75808A]">
                ENTERPRISE ERP
              </p>
            </div>
          </div>

          <h1 className="mb-1 text-3xl font-bold text-[#22324A]">Welcome back</h1>
          <p className="mb-8 text-sm text-[#75808A]">
            Enter your credentials to access the management portal.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-[#22324A]">
                BUSINESS EMAIL
              </label>
              <input
                type="email"
                required
                placeholder="name@company.com"
                className="w-full rounded-lg border border-[#E7ECEF] bg-[#F5F7F9] px-3.5 py-2.5 text-sm text-[#203030] transition focus:border-[#1F6E5A] focus:bg-white"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-xs font-semibold tracking-wide text-[#22324A]">
                  PASSWORD
                </label>
                <a href="#" className="text-xs font-medium text-[#1F6E5A] hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#E7ECEF] bg-[#F5F7F9] px-3.5 py-2.5 text-sm text-[#203030] transition focus:border-[#1F6E5A] focus:bg-white"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-[#75808A]">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-[#E7ECEF] accent-[#1F6E5A]"
              />
              Keep me signed in for 30 days
            </label>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#1F6E5A] py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-[#2C8A71]"
            >
              SIGN IN
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-[#E7ECEF]" />
            <span className="text-[10px] font-semibold tracking-widest text-[#75808A]">
              OR CONTINUE WITH
            </span>
            <span className="h-px flex-1 bg-[#E7ECEF]" />
          </div>

          <GoogleButton onClick={() => navigate("/dashboard")} />

          <p className="mt-8 text-center text-xs text-[#75808A]">
            New to AssetFlow?{" "}
            <Link to="/signup" className="font-semibold text-[#1F6E5A] hover:underline">
              Request access
            </Link>
          </p>
        </div>

        {/* Right: hero */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#0F3D32] via-[#123A4A] to-[#0B1220] md:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(44,138,113,0.4),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_90%,rgba(31,110,90,0.25),transparent_45%)]" />
          <div className="relative flex h-full flex-col justify-between p-10 text-white">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-white/60">
              ASSET MANAGEMENT REINVENTED
            </p>
            <h2 className="max-w-sm text-4xl font-bold leading-tight">
              Master your enterprise lifecycle from a single pane.
            </h2>
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="mt-1 text-[10px] font-semibold tracking-widest text-white/50">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
