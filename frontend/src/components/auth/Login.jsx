import { useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";
import { api } from "../../lib/api";
import "./auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();
  async function handleLogin(e) {
    e.preventDefault(); setError("");
    try {
      setLoading(true);
      const data = await api.post("/login", { email, password });
      localStorage.setItem("token", data.token); localStorage.setItem("userId", data.userId);
      setCurrentUser(data.userId); navigate("/", { replace: true });
    } catch (err) { setError(err.message || "Unable to sign in."); }
    finally { setLoading(false); }
  }
  return <main className="auth-page"><section className="auth-card">
    <Link to="/auth" className="auth-brand"><img src="/logo.png" alt="Revix Logo" className="auth-logo-img" /> Revix</Link>
    <h1>Sign in to Revix</h1><p className="auth-subtitle">Build, track, and ship together.</p>
    <form onSubmit={handleLogin} className="auth-form">
      <label>Email or username<input required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label>
      <label>Password<input required minLength="6" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary button-wide" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
    </form>
    <p className="auth-switch">New to Revix? <Link to="/signup">Create an account</Link></p>
  </section></main>;
}
