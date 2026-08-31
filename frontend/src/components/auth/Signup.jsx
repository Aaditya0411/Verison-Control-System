import { useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";
import { api } from "../../lib/api";
import "./auth.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();
  async function handleSignup(e) {
    e.preventDefault(); setError("");
    try {
      setLoading(true);
      const data = await api.post("/signup", { email, password, username });
      localStorage.setItem("token", data.token); localStorage.setItem("userId", data.userId);
      setCurrentUser(data.userId); navigate("/", { replace: true });
    } catch (err) { setError(err.message || "Unable to create your account."); }
    finally { setLoading(false); }
  }
  return <main className="auth-page"><section className="auth-card">
    <Link to="/auth" className="auth-brand"><img src="/logo.png" alt="Revix Logo" className="auth-logo-img" /> Revix</Link>
    <h1>Create your account</h1><p className="auth-subtitle">Start collaborating in minutes.</p>
    <form onSubmit={handleSignup} className="auth-form">
      <label>Username<input required minLength="2" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="octocat" /></label>
      <label>Email address<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label>
      <label>Password<input required minLength="6" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary button-wide" disabled={loading}>{loading ? "Creating…" : "Create account"}</button>
    </form>
    <p className="auth-switch">Already have an account? <Link to="/auth">Sign in</Link></p>
  </section></main>;
}
