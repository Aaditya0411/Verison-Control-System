import { useEffect, useMemo, useState } from "react";
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import { api } from "../../lib/api";
import HeatMapProfile from "./HeatMap";
import "./profile.css";

export default function Profile() {
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [allPublicRepos, setAllPublicRepos] = useState([]);
  const [tab, setTab] = useState("overview");
  const [form, setForm] = useState({ email: "", password: "" });
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get(`/userProfile/${userId}`),
      api.get(`/repo/user/${userId}`),
      api.get(`/repo/all`)
    ])
      .then(([profile, myRepos, publicRepos]) => {
        setUser(profile.user);
        setForm((f) => ({ ...f, email: profile.user.email || "" }));
        setRepos(myRepos.repositories || []);
        setAllPublicRepos(publicRepos || []);
      })
      .catch((err) => setError(err.message));
  }, [userId]);

  const starredRepos = useMemo(() => {
    return allPublicRepos.filter(r => r.stars && r.stars.some(s => String(s._id || s) === userId));
  }, [allPublicRepos, userId]);

  const initials = useMemo(() => (user?.username || "R").slice(0, 2).toUpperCase(), [user]);

  async function save(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const payload = { email: form.email };
      if (form.password) payload.password = form.password;
      const data = await api.put(`/updateProfile/${userId}`, payload);
      setUser(data.user);
      setForm({ email: data.user.email, password: "" });
      setMessage("Profile updated successfully.");
      setEditing(false);
    } catch (err) {
      setError(err.message);
    }
  }

  if (!user && !error) return <><Navbar /><main className="page"><div className="loading-card">Loading profile…</div></main></>;

  return (
    <>
      <Navbar />
      <main className="page profile-page">
        {error && <div className="notice notice-error">{error}</div>}
        {user && (
          <>
            <aside className="profile-sidebar">
              <div className="profile-avatar">{initials}</div>
              <h1>{user.username}</h1>
              <p className="profile-handle">@{user.username}</p>
              <p className="profile-copy">Building and collaborating with Revix.</p>
              <div className="profile-stats">
                <span><strong>{repos.length}</strong> repositories</span>
                <span><strong>{starredRepos.length}</strong> starred</span>
              </div>
              <button className="button button-wide" onClick={() => setEditing(!editing)}>
                {editing ? "Cancel editing" : "Edit profile"}
              </button>
            </aside>

            <section className="profile-main">
              <nav className="profile-tabs">
                <span className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")} style={{ cursor: "pointer" }}>
                  Overview
                </span>
                <span className={tab === "repositories" ? "active" : ""} onClick={() => setTab("repositories")} style={{ cursor: "pointer" }}>
                  Repositories <b>{repos.length}</b>
                </span>
                <span className={tab === "stars" ? "active" : ""} onClick={() => setTab("stars")} style={{ cursor: "pointer" }}>
                  Stars <b>{starredRepos.length}</b>
                </span>
              </nav>

              {editing && (
                <form className="panel profile-form" onSubmit={save}>
                  <h2>Public profile</h2>
                  <label>
                    Username
                    <input value={user.username} disabled />
                    <small>Username updates are not supported by the current backend.</small>
                  </label>
                  <label>
                    Email
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </label>
                  <label>
                    New password
                    <input minLength="6" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Leave blank to keep current password" />
                  </label>
                  <button className="button button-primary">Update profile</button>
                </form>
              )}

              {message && <div className="notice notice-success">{message}</div>}

              {tab === "overview" && (
                <>
                  <section className="contribution-card">
                    <div className="section-head">
                      <h2>{repos.length * 4 + 12} contributions in the last year</h2>
                      <span className="muted">Activity overview</span>
                    </div>
                    <HeatMapProfile count={repos.length * 4 + 12} />
                  </section>

                  <section className="profile-repos">
                    <div className="section-head">
                      <h2>Popular repositories</h2>
                      <Link to="/new">New repository</Link>
                    </div>
                    {repos.length ? (
                      <div className="repo-grid">
                        {repos.map((repo) => (
                          <article className="repo-card" key={repo._id}>
                            <div className="repo-card-head">
                              <Link className="repo-link" to={`/repo/${repo._id}`}>{repo.name}</Link>
                              <span className="visibility-badge">{repo.visibility === false ? "Private" : "Public"}</span>
                            </div>
                            <p>{repo.description || "No description provided."}</p>
                            <footer>
                              <span><i className="language-dot" /> JavaScript</span>
                              <span>⭐ {repo.stars?.length || 0}</span>
                              <span>🐛 {repo.issues?.length || 0} issues</span>
                            </footer>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state compact">
                        <h2>No repositories yet</h2>
                        <p>Your projects will show up here.</p>
                        <Link className="button button-primary" to="/new">Create repository</Link>
                      </div>
                    )}
                  </section>
                </>
              )}

              {tab === "repositories" && (
                <section className="profile-repos">
                  <div className="section-head">
                    <h2>All Repositories ({repos.length})</h2>
                    <Link to="/new">New repository</Link>
                  </div>
                  {repos.length ? (
                    <div className="repo-grid">
                      {repos.map((repo) => (
                        <article className="repo-card" key={repo._id}>
                          <div className="repo-card-head">
                            <Link className="repo-link" to={`/repo/${repo._id}`}>{repo.name}</Link>
                            <span className="visibility-badge">{repo.visibility === false ? "Private" : "Public"}</span>
                          </div>
                          <p>{repo.description || "No description provided."}</p>
                          <footer>
                            <span><i className="language-dot" /> JavaScript</span>
                            <span>⭐ {repo.stars?.length || 0}</span>
                            <span>🐛 {repo.issues?.length || 0} issues</span>
                          </footer>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state compact">
                      <h2>No repositories yet</h2>
                      <Link className="button button-primary" to="/new">Create repository</Link>
                    </div>
                  )}
                </section>
              )}

              {tab === "stars" && (
                <section className="profile-repos">
                  <div className="section-head">
                    <h2>Starred Repositories ({starredRepos.length})</h2>
                  </div>
                  {starredRepos.length ? (
                    <div className="repo-grid">
                      {starredRepos.map((repo) => (
                        <article className="repo-card" key={repo._id}>
                          <div className="repo-card-head">
                            <Link className="repo-link" to={`/repo/${repo._id}`}>{repo.name}</Link>
                            <span className="visibility-badge">{repo.visibility === false ? "Private" : "Public"}</span>
                          </div>
                          <p>{repo.description || "No description provided."}</p>
                          <footer>
                            <span><i className="language-dot" /> JavaScript</span>
                            <span>⭐ {repo.stars?.length || 0}</span>
                          </footer>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state compact">
                      <h2>No starred repositories yet</h2>
                      <p>Star repositories across Revix to find them easily later.</p>
                    </div>
                  )}
                </section>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}
