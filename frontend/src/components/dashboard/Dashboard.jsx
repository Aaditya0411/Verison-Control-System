/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import { api } from "../../lib/api";
import "./dashboard.css";

function RepoCard({ repo, compact = false }) {
  const owner = repo.owner?.username || "you";
  return (
    <article className={compact ? "repo-card repo-card-compact" : "repo-card"}>
      <div className="repo-card-head">
        <Link to={`/repo/${repo._id}`} className="repo-link">
          {compact && `${owner} / `}{repo.name}
        </Link>
        <span className="visibility-badge">{repo.visibility === false ? "Private" : "Public"}</span>
      </div>
      <p>{repo.description || "No description provided."}</p>
      <footer>
        <span><i className="language-dot" /> JavaScript</span>
        <span>⭐ {repo.stars?.length || 0}</span>
        <span>🐛 {repo.issues?.length || 0}</span>
      </footer>
    </article>
  );
}

export default function Dashboard() {
  const [repositories, setRepositories] = useState([]);
  const [explore, setExplore] = useState([]);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [location.search]);

  useEffect(() => {
    let active = true;
    Promise.all([api.get(`/repo/user/${userId}`), api.get("/repo/all")])
      .then(([mine, publicRepos]) => {
        if (active) {
          setRepositories(mine.repositories || []);
          setExplore(publicRepos || []);
        }
      })
      .catch((err) => active && setError(err.message || "Could not load repositories."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [userId]);

  const filtered = useMemo(
    () => repositories.filter((repo) => `${repo.name} ${repo.description || ""}`.toLowerCase().includes(query.toLowerCase())),
    [repositories, query]
  );
  const suggested = useMemo(
    () => explore.filter((repo) => String(repo.owner?._id || repo.owner) !== userId).slice(0, 5),
    [explore, userId]
  );

  return (
    <>
      <Navbar />
      <main className="page dashboard-page">
        <aside className="dashboard-sidebar">
          <div className="sidebar-heading">
            <h2>Top repositories</h2>
            <Link to="/new" className="button button-primary button-small">New</Link>
          </div>
          <label className="search-field">
            <span className="sr-only">Find a repository</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find a repository…" />
          </label>
          <div className="sidebar-list">
            {repositories.slice(0, 7).map((repo) => (
              <Link key={repo._id} to={`/repo/${repo._id}`}>{repo.name}</Link>
            ))}
          </div>
          <p className="sidebar-note">Your repositories appear here. Create one to start tracking your code and issues.</p>
        </aside>
        <section className="feed">
          <div className="page-title">
            <div>
              <p className="eyebrow">Your workspace</p>
              <h1>Repositories</h1>
            </div>
            <Link to="/new" className="button button-primary">Create repository</Link>
          </div>
          {error && <div className="notice notice-error">{error}</div>}
          {loading ? (
            <div className="loading-card">Loading your repositories…</div>
          ) : filtered.length ? (
            <div className="repo-grid">{filtered.map((repo) => <RepoCard key={repo._id} repo={repo} />)}</div>
          ) : (
            <section className="empty-state">
              <div className="empty-icon">⌘</div>
              <h2>{query ? "No matching repositories" : "Get started with Revix"}</h2>
              <p>{query ? "Try another name or description." : "Create a repository to organize your project, files, and issues."}</p>
              {!query && <Link to="/new" className="button button-primary">Create your first repository</Link>}
            </section>
          )}
        </section>
        <aside className="explore-panel">
          <h2>Explore public repositories</h2>
          <p className="muted">Discover work shared by the community.</p>
          {suggested.length ? (
            suggested.map((repo) => <RepoCard key={repo._id} repo={repo} compact />)
          ) : (
            <p className="muted">Public projects will appear here.</p>
          )}
        </aside>
      </main>
    </>
  );
}
