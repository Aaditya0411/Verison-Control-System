import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3002/signup", {
        username: username,
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
        err.response?.data?.message || "Failed to create account. Please try again."
      );
      setLoading(false);
    }
  };

  // Password strength calculation
  const getPasswordStrength = (val) => {
    const len = val.length;
    if (len === 0) return { score: 0, text: "Password strength", color: "text-outline" };
    if (len < 6) return { score: 1, text: "Weak", color: "text-error" };
    if (len < 10) return { score: 2, text: "Fair", color: "text-tertiary-container" };
    if (len < 14) return { score: 3, text: "Good", color: "text-secondary-container" };
    return { score: 4, text: "Strong", color: "text-secondary" };
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="text-on-surface antialiased min-h-screen flex items-center justify-center p-md relative overflow-hidden bg-background">
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(88, 166, 255, 0.1) 0%, transparent 60%)",
        }}
      ></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-30"></div>

      <main className="w-full max-w-[480px] z-10">
        {/* Header / Logo Area */}
        <div className="text-center mb-xl">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-sm tracking-tight flex items-center justify-center gap-sm">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "32px", fontVariationSettings: "'FILL' 1" }}
            >
              terminal
            </span>
            REVIX
          </h1>
          <p className="font-body-base text-body-base text-on-surface-variant">
            Create your developer account
          </p>
        </div>

        {/* Glassmorphic Card */}
        <div className="glass-panel rounded-lg p-lg shadow-2xl">
          {errorMsg && (
            <div className="flex items-start gap-sm p-sm mb-lg bg-error-container/20 border border-error-container rounded text-error font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">
                error
              </span>
              <p>{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="flex flex-col gap-md">
            {/* Username */}
            <div className="flex flex-col gap-xs">
              <label
                className="font-label-caps text-label-caps text-on-surface-variant uppercase"
                htmlFor="username"
              >
                Username
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant opacity-70">
                  alternate_email
                </span>
                <input
                  className="input-glass w-full rounded pl-[36px] pr-sm py-sm font-code-base text-code-base text-on-surface placeholder-outline"
                  id="username"
                  name="username"
                  placeholder="ada_dev"
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-xs">
              <label
                className="font-label-caps text-label-caps text-on-surface-variant uppercase"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant opacity-70">
                  mail
                </span>
                <input
                  className="input-glass w-full rounded pl-[36px] pr-sm py-sm font-code-base text-code-base text-on-surface placeholder-outline"
                  id="email"
                  name="email"
                  placeholder="ada@example.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-xs">
              <label
                className="font-label-caps text-label-caps text-on-surface-variant uppercase"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant opacity-70">
                  key
                </span>
                <input
                  className="input-glass w-full rounded pl-[36px] pr-sm py-sm font-code-base text-code-base text-on-surface placeholder-outline"
                  id="password"
                  name="password"
                  placeholder="••••••••••••"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Password Strength Meter */}
              <div className="mt-unit flex flex-col gap-unit">
                <div className="flex gap-unit h-1 w-full">
                  <div
                    className={`h-full w-1/4 rounded-full transition-all duration-300 ${
                      strength.score >= 1
                        ? strength.score === 1
                          ? "bg-error"
                          : strength.score === 2
                          ? "bg-tertiary-container"
                          : strength.score === 3
                          ? "bg-secondary-container"
                          : "bg-secondary"
                        : "bg-surface-container-highest opacity-40"
                    }`}
                  ></div>
                  <div
                    className={`h-full w-1/4 rounded-full transition-all duration-300 ${
                      strength.score >= 2
                        ? strength.score === 2
                          ? "bg-tertiary-container"
                          : strength.score === 3
                          ? "bg-secondary-container"
                          : "bg-secondary"
                        : "bg-surface-container-highest"
                    }`}
                  ></div>
                  <div
                    className={`h-full w-1/4 rounded-full transition-all duration-300 ${
                      strength.score >= 3
                        ? strength.score === 3
                          ? "bg-secondary-container"
                          : "bg-secondary"
                        : "bg-surface-container-highest"
                    }`}
                  ></div>
                  <div
                    className={`h-full w-1/4 rounded-full transition-all duration-300 ${
                      strength.score >= 4
                        ? "bg-secondary shadow-[0_0_8px_rgba(123,219,128,0.5)]"
                        : "bg-surface-container-highest"
                    }`}
                  ></div>
                </div>
                <p className={`font-code-sm text-code-sm text-right ${strength.color}`}>
                  {strength.text}
                </p>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-sm mt-sm">
              <input
                className="mt-1 input-glass rounded text-primary-container focus:ring-primary-container focus:ring-offset-0 bg-surface h-4 w-4"
                id="terms"
                name="terms"
                required
                type="checkbox"
              />
              <label
                className="font-body-sm text-body-sm text-on-surface-variant"
                htmlFor="terms"
              >
                I agree to the{" "}
                <a
                  className="text-primary-container hover:underline hover:text-primary transition-colors"
                  href="#"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  className="text-primary-container hover:underline hover:text-primary transition-colors"
                  href="#"
                >
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            {/* Submit Button */}
            <button
              className="btn-primary w-full rounded-DEFAULT py-sm px-lg font-headline-md text-body-base font-bold flex items-center justify-center gap-sm mt-sm h-12 disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              <span>{loading ? "Creating Account..." : "Create Account"}</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="mt-xl text-center">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Already have an account?{" "}
            <Link
              className="font-bold text-primary-container hover:text-primary hover:underline transition-colors ml-unit"
              to="/auth"
            >
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Signup;