import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3002/login", {
        email: email,
        password: password,
      });

      const { token, userId } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      setCurrentUser(userId);

      setLoading(false);
      navigate("/");
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message || "Invalid username or password. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ambient-bg p-md relative overflow-hidden font-body-base text-body-base">
      <main className="w-full max-w-[420px] relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-xl">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-surface-container-high border border-outline-variant mb-md shadow-sm">
            <span className="material-symbols-outlined text-primary-container text-2xl">
              terminal
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Sign in to REVIX
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-sm">
            Secure access to your developer platform.
          </p>
        </div>

        {/* Glassmorphic Auth Card */}
        <div className="glass-panel rounded-lg p-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-50"></div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="flex items-start gap-sm p-sm mb-lg bg-error-container/20 border border-error-container rounded text-error font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">
                error
              </span>
              <p>{errorMsg}</p>
            </div>
          )}

          <form className="flex flex-col gap-lg" onSubmit={handleLogin}>
            {/* Username / Email */}
            <div className="flex flex-col gap-sm">
              <label
                className="font-code-sm text-code-sm text-on-surface-variant uppercase tracking-wider"
                htmlFor="username"
              >
                Username or Email
              </label>
              <div className="relative input-glow rounded transition-all duration-200 border border-outline-variant bg-surface flex items-center overflow-hidden h-10">
                <span className="material-symbols-outlined text-on-surface-variant pl-sm pr-xs text-[18px]">
                  person
                </span>
                <input
                  className="w-full bg-transparent border-none text-on-surface font-body-sm text-body-sm focus:ring-0 px-sm h-full"
                  id="username"
                  name="username"
                  placeholder="developer@revix.io"
                  required
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-sm">
              <div className="flex justify-between items-center">
                <label
                  className="font-code-sm text-code-sm text-on-surface-variant uppercase tracking-wider"
                  htmlFor="password"
                >
                  Password
                </label>
                <a
                  className="font-code-sm text-code-sm text-primary hover:text-primary-container transition-colors"
                  href="#"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot?
                </a>
              </div>
              <div className="relative input-glow rounded transition-all duration-200 border border-outline-variant bg-surface flex items-center overflow-hidden h-10">
                <span className="material-symbols-outlined text-on-surface-variant pl-sm pr-xs text-[18px]">
                  lock
                </span>
                <input
                  className="w-full bg-transparent border-none text-on-surface font-body-sm text-body-sm focus:ring-0 px-sm h-full"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="text-on-surface-variant hover:text-on-surface p-sm focus:outline-none flex items-center justify-center transition-colors"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="w-full btn-primary rounded font-body-base text-body-base font-semibold py-sm mt-sm flex justify-center items-center gap-sm disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              <span>{loading ? "Signing In..." : "Sign In"}</span>
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="mt-xl text-center border-t border-outline-variant/30 pt-lg">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            New to REVIX?{" "}
            <Link
              className="text-primary hover:text-primary-container hover:underline transition-colors ml-1 font-semibold"
              to="/signup"
            >
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;