import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Landmark } from "lucide-react";

import city from "../../assets/city.jpg";
import GoogleButton from "./GoogleButton";
import { nameFromEmail, setCurrentUser } from "../../utils/user";

const stats = [
  { value: "1.2B", label: "Assets Tracked" },
  { value: "99.9%", label: "Audit Accuracy" },
  { value: "15ms", label: "Query Latency" },
];

const avatars = ["#3B5C4A", "#4A6FA5", "#8A5A44", "#5A5A6E"];

const Login = () => {
  const navigate = useNavigate();
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const name = nameFromEmail(email);
    if (name) setCurrentUser({ name });
    navigate("/dashboard");
  };

  return (
    <div className="grid min-h-screen bg-white md:grid-cols-[1fr_1.1fr]">
      {/* Left: form */}
      <div className="flex flex-col px-6 py-8 sm:px-10">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
          <div className="mb-8 flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1F6E5A] text-white">
              <Landmark size={20} />
            </span>
            <div className="leading-tight">
              <p className="text-lg font-bold text-[#1A2B4A]">AssetFlow</p>
              <p className="text-[10px] font-semibold tracking-[0.15em] text-[#8A97A5]">
                ENTERPRISE ERP
              </p>
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#1A2B4A]">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-[#6B7683]">
            Enter your credentials to access the management portal.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold tracking-wide text-[#4A5560]">
                BUSINESS EMAIL
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-lg border border-[#E1E6EA] bg-[#F7F9FA] px-3.5 py-2.5 text-sm text-[#203030] transition placeholder:text-[#9AA5AF] focus:border-[#1F6E5A] focus:bg-white focus:ring-2 focus:ring-[#1F6E5A]/15"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-[11px] font-semibold tracking-wide text-[#4A5560]">
                  PASSWORD
                </label>
                <a href="#" className="text-xs font-semibold text-[#1F6E5A] hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#E1E6EA] bg-[#F7F9FA] px-3.5 py-2.5 text-sm text-[#203030] transition placeholder:text-[#9AA5AF] focus:border-[#1F6E5A] focus:bg-white focus:ring-2 focus:ring-[#1F6E5A]/15"
              />
            </div>

            <label className="flex items-center gap-2 pt-1 text-sm text-[#6B7683]">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-[#D5DBE0] accent-[#1F6E5A]"
              />
              Keep me signed in for 30 days
            </label>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#1F6E5A] py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-[#195C4B]"
            >
              SIGN IN
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-[#E7ECEF]" />
            <span className="text-[10px] font-semibold tracking-[0.15em] text-[#9AA5AF]">
              OR CONTINUE WITH
            </span>
            <span className="h-px flex-1 bg-[#E7ECEF]" />
          </div>

          <GoogleButton onClick={() => navigate("/dashboard")} />
        </div>

        <div className="mx-auto w-full max-w-md text-center text-[11px] text-[#8A97A5]">
          New to AssetFlow?{" "}
          <Link to="/signup" className="font-semibold text-[#1F6E5A] hover:underline">
            Request access
          </Link>
        </div>
      </div>

      {/* Right: hero image */}
      <div className="relative hidden md:block">
        <img src={city} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C3327]/85 via-[#0C3327]/55 to-[#071B15]/95" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-white/70">
            ASSET MANAGEMENT REINVENTED
          </p>

          <div>
            <h2 className="max-w-md text-[42px] font-bold leading-[1.1] tracking-tight">
              Master your enterprise lifecycle from a single pane.
            </h2>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-bold">{s.value}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/55">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {avatars.map((c, i) => (
                <span
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-white/80"
                  style={{ background: `linear-gradient(135deg, ${c}, ${c}cc)` }}
                />
              ))}
            </div>
            <p className="max-w-xs text-xs italic leading-snug text-white/75">
              "The transition to AssetFlow reduced our auditing overhead by 40% in
              the first quarter."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
