import { useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { api } from "../../lib/api";
import "./repo.css";

export default function CreateRepo() {
  const [form, setForm] = useState({ name: "", description: "", visibility: true, content: "" });
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false); const navigate = useNavigate();
  const change = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  async function submit(e) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const content = form.content.split("\n").map((item) => item.trim()).filter(Boolean);
      const data = await api.post("/repo/create", { owner: localStorage.getItem("userId"), name: form.name.trim(), description: form.description.trim(), visibility: form.visibility, content, issues: [] });
      navigate(`/repo/${data.repositoryID}`);
    } catch (err) { setError(err.message || "Unable to create repository."); }
    finally { setLoading(false); }
  }
  return <><Navbar /><main className="page form-page"><Link to="/" className="back-link">← Back to repositories</Link><section className="form-layout"><div><h1>Create a new repository</h1><p className="muted">A repository contains all of your project files and its full revision history.</p></div><form className="panel repo-form" onSubmit={submit}>
    <label>Repository name <input required maxLength="100" value={form.name} onChange={change("name")} placeholder="my-awesome-project" /><small>Great repository names are short and memorable.</small></label>
    <label>Description <input value={form.description} onChange={change("description")} placeholder="What is this project about?" /></label>
    <fieldset><legend>Visibility</legend><label className="radio-row"><input type="radio" checked={form.visibility} onChange={() => setForm({ ...form, visibility: true })} /> <span><strong>Public</strong><small>Anyone can see this repository.</small></span></label><label className="radio-row"><input type="radio" checked={!form.visibility} onChange={() => setForm({ ...form, visibility: false })} /> <span><strong>Private</strong><small>Only you can see this repository.</small></span></label></fieldset>
    <label>Starter files <textarea value={form.content} onChange={change("content")} placeholder={"README.md\nsrc/index.js"} /><small>Optional — add one file path per line.</small></label>
    {error && <p className="form-error">{error}</p>}<div className="form-actions"><Link to="/" className="button">Cancel</Link><button className="button button-primary" disabled={loading}>{loading ? "Creating…" : "Create repository"}</button></div>
  </form></section></main></>;
}
