import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-[#F5F7F9]">
      <div className="rounded-2xl bg-white p-10 shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-[#22324A]">
          AssetFlow
        </h1>

        <Link
          to="/dashboard"
          className="rounded-lg bg-[#1F6E5A] px-6 py-3 text-white"
        >
          Go To Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Login;