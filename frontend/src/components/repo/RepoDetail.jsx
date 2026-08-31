/* eslint-disable react/prop-types, react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import { api } from "../../lib/api";
import "./repo.css";

export default function RepoDetail() {
  const { repoId } = useParams();
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");

  const [repo, setRepo] = useState(null);
  const [tab, setTab] = useState("code");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // File Modal state
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditingFile, setIsEditingFile] = useState(false);
  const [fileCodeState, setFileCodeState] = useState("");
  const [fileCommitMsg, setFileCommitMsg] = useState("");

  // New file modal state
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFilePath, setNewFilePath] = useState("");
  const [newFileCode, setNewFileCode] = useState("");
  const [newFileCommitMsg, setNewFileCommitMsg] = useState("");

  // Settings state
  const [description, setDescription] = useState("");

  // Issue creation state
  const [issue, setIssue] = useState({ title: "", description: "" });

  const canManage = repo && String(repo.owner?._id || repo.owner) === currentUserId;
  const isStarred = repo && repo.stars && repo.stars.some(s => String(s._id || s) === currentUserId);

  const load = async () => {
    try {
      const data = await api.get(`/repo/id/${repoId}`);
      setRepo(data);
      setDescription(data.description || "");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, [repoId]);

  async function action(fn) {
    setError("");
    setBusy(true);
    try {
      await fn();
      await load();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  const toggleStar = () => {
    action(() => api.patch(`/repo/star/${repoId}`, { userId: currentUserId }));
  };

  const handleOpenFile = (filename) => {
    const fileObj = (repo.files || []).find(f => f.path === filename);
    const code = fileObj ? fileObj.code : (filename.toLowerCase().includes("readme") ? `# ${repo.name}\n\n${repo.description || ""}` : `// ${filename}`);
    setSelectedFile(filename);
    setFileCodeState(code);
    setIsEditingFile(false);
    setFileCommitMsg(`Update ${filename}`);
  };

  const handleSaveFileCode = (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    action(() => api.put(`/repo/update/${repoId}`, {
      content: selectedFile,
      fileCode: fileCodeState,
      commitMessage: fileCommitMsg || `Update ${selectedFile}`,
      authorId: currentUserId
    })).then((ok) => {
      if (ok) setIsEditingFile(false);
    });
  };

  const handleCreateNewFile = (e) => {
    e.preventDefault();
    if (!newFilePath.trim()) return;
    action(() => api.put(`/repo/update/${repoId}`, {
      content: newFilePath.trim(),
      fileCode: newFileCode,
      commitMessage: newFileCommitMsg || `Create ${newFilePath.trim()}`,
      authorId: currentUserId
    })).then((ok) => {
      if (ok) {
        setShowNewFileModal(false);
        setNewFilePath("");
        setNewFileCode("");
        setNewFileCommitMsg("");
      }
    });
  };

  const updateDescription = (e) => {
    e.preventDefault();
    action(() => api.put(`/repo/update/${repoId}`, { description }));
  };

  const createIssue = (e) => {
    e.preventDefault();
    action(() => api.post("/issue/create", { ...issue, repository: repoId })).then(
      (ok) => ok && setIssue({ title: "", description: "" })
    );
  };

  if (!repo && !error) return <><Navbar /><main className="page"><div className="loading-card">Loading repository…</div></main></>;
  if (!repo) return <><Navbar /><main className="page"><div className="notice notice-error">{error}</div><Link to="/" className="back-link">← Back to repositories</Link></main></>;

  const readmeFile = (repo.files || []).find(f => f.path.toLowerCase() === "readme.md") || (repo.content?.includes("README.md") ? { path: "README.md", code: `# ${repo.name}\n\n${repo.description || "No description provided."}` } : null);

  return (
    <>
      <Navbar />
      <main className="page repo-page">
        {/* Repo Header & Breadcrumbs */}
        <div className="repo-header-bar">
          <div className="repo-crumb">
            <span className="owner-name">{repo.owner?.username || "you"}</span>
            <span>/</span>
            <h1>{repo.name}</h1>
            <span className="visibility-badge">{repo.visibility === false ? "Private" : "Public"}</span>
          </div>

          <div className="repo-actions-header">
            <button className={`star-button ${isStarred ? "starred" : ""}`} onClick={toggleStar} disabled={busy}>
              <span>{isStarred ? "★ Starred" : "☆ Star"}</span>
              <span className="star-count">{repo.stars?.length || 0}</span>
            </button>
            <div className="stat-pill">
              <span>Fork</span>
              <span className="count-badge">0</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="repo-tabs">
          <button className={tab === "code" ? "active" : ""} onClick={() => setTab("code")}>
            💻 Code
          </button>
          <button className={tab === "commits" ? "active" : ""} onClick={() => setTab("commits")}>
            📜 Commits <span>{repo.commits?.length || 1}</span>
          </button>
          <button className={tab === "issues" ? "active" : ""} onClick={() => setTab("issues")}>
            🐛 Issues <span>{repo.issues?.length || 0}</span>
          </button>
          <button className={tab === "settings" ? "active" : ""} onClick={() => setTab("settings")}>
            ⚙️ Settings
          </button>
        </nav>

        {error && <div className="notice notice-error">{error}</div>}

        {/* CODE TAB */}
        {tab === "code" && (
          <section className="repo-content">
            <div className="repo-main">
              <div className="file-toolbar">
                <div className="branch-selector">
                  <span className="branch-pill">🌿 main</span>
                </div>
                {canManage && (
                  <button className="button button-small button-primary" onClick={() => setShowNewFileModal(true)}>
                    + Add File
                  </button>
                )}
              </div>

              {/* Latest commit banner */}
              {repo.commits && repo.commits.length > 0 && (
                <div className="commit-banner">
                  <span className="commit-author-avatar">R</span>
                  <span className="commit-message-text">{repo.commits[repo.commits.length - 1].message}</span>
                  <span className="commit-sha">#{repo.commits[repo.commits.length - 1].id}</span>
                  <span className="commit-date">{new Date(repo.commits[repo.commits.length - 1].date).toLocaleDateString()}</span>
                </div>
              )}

              {/* File List Browser */}
              <div className="file-list">
                {repo.content?.length ? (
                  repo.content.map((item) => (
                    <div className="file-row clickable-row" key={item} onClick={() => handleOpenFile(item)}>
                      <div className="file-name-col">
                        <span className="file-icon">📄</span>
                        <code className="file-link-name">{item}</code>
                      </div>
                      <span className="file-commit-preview">Updated file</span>
                      {canManage && (
                        <button
                          className="icon-action"
                          title="Remove file"
                          disabled={busy}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Delete ${item}?`)) {
                              action(() => api.put(`/repo/update/${repoId}`, { removeContent: item }));
                            }
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="empty-files">This repository has no files yet. Click "+ Add File" to get started.</div>
                )}
              </div>

              {/* README.md Preview Section */}
              {readmeFile && (
                <div className="readme-container">
                  <div className="readme-header">
                    <span>📖 README.md</span>
                  </div>
                  <div className="readme-body">
                    <pre className="readme-text">{readmeFile.code || `# ${repo.name}\n\n${repo.description || ""}`}</pre>
                  </div>
                </div>
              )}
            </div>

            <aside className="about-card">
              <h2>About</h2>
              <p>{repo.description || "No description provided."}</p>
              <div className="about-meta">
                <div>● {repo.visibility === false ? "Private repository" : "Public repository"}</div>
                <div>⭐ {repo.stars?.length || 0} stars</div>
                <div>📜 {repo.commits?.length || 1} commits</div>
              </div>
            </aside>
          </section>
        )}

        {/* COMMITS TAB */}
        {tab === "commits" && (
          <section className="commits-section">
            <h2>Commit History</h2>
            <div className="commits-timeline">
              {(repo.commits || []).slice().reverse().map((c, idx) => (
                <div className="commit-item" key={c.id || idx}>
                  <div className="commit-badge">git</div>
                  <div className="commit-info">
                    <strong className="commit-title">{c.message}</strong>
                    <div className="commit-sub">
                      <span>{c.authorName || "Author"}</span> committed on {new Date(c.date).toLocaleString()}
                    </div>
                  </div>
                  <div className="commit-hash"><code>{c.id}</code></div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ISSUES TAB */}
        {tab === "issues" && (
          <section className="issues-layout">
            <div>
              <h2>{repo.issues?.length || 0} Issues</h2>
              {repo.issues?.length ? (
                <div className="issue-list">
                  {repo.issues.map((item) => (
                    <IssueRow key={item._id} item={item} canManage={canManage} action={action} currentUserId={currentUserId} />
                  ))}
                </div>
              ) : (
                <div className="empty-state compact">
                  <h2>No issues yet</h2>
                  <p>Issues help you track work, ideas, and bugs.</p>
                </div>
              )}
            </div>
            {canManage && (
              <form className="panel issue-form" onSubmit={createIssue}>
                <h2>Open a new issue</h2>
                <label>
                  Title
                  <input required value={issue.title} onChange={(e) => setIssue({ ...issue, title: e.target.value })} placeholder="Short, descriptive title" />
                </label>
                <label>
                  Description
                  <textarea required value={issue.description} onChange={(e) => setIssue({ ...issue, description: e.target.value })} placeholder="Describe the issue" />
                </label>
                <button disabled={busy} className="button button-primary">Submit new issue</button>
              </form>
            )}
          </section>
        )}

        {/* SETTINGS TAB */}
        {tab === "settings" && (
          <section className="settings-grid">
            <form className="panel" onSubmit={updateDescription}>
              <h2>Repository details</h2>
              <label>
                Description
                <input value={description} disabled={!canManage} onChange={(e) => setDescription(e.target.value)} />
              </label>
              {canManage && <button disabled={busy} className="button button-primary">Save changes</button>}
            </form>
            {canManage && (
              <section className="panel danger-panel">
                <h2>Danger zone</h2>
                <div>
                  <span>
                    <strong>Change visibility</strong>
                    <small>Repository is currently {repo.visibility === false ? "private" : "public"}.</small>
                  </span>
                  <button disabled={busy} className="button" onClick={() => action(() => api.patch(`/repo/toggle/${repoId}`))}>
                    Toggle visibility
                  </button>
                </div>
                <div>
                  <span>
                    <strong>Delete this repository</strong>
                    <small>Once deleted, there is no way to restore it.</small>
                  </span>
                  <button
                    disabled={busy}
                    className="button button-danger"
                    onClick={() => {
                      if (window.confirm(`Delete ${repo.name}? This cannot be undone.`)) {
                        action(() => api.delete(`/repo/delete/${repoId}`)).then((ok) => ok && navigate("/"));
                      }
                    }}
                  >
                    Delete repository
                  </button>
                </div>
              </section>
            )}
          </section>
        )}

        {/* FILE VIEWER & EDITOR MODAL */}
        {selectedFile && (
          <div className="modal-backdrop" onClick={() => setSelectedFile(null)}>
            <div className="modal-content file-viewer-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>📄 {selectedFile}</h3>
                <button className="close-modal-btn" onClick={() => setSelectedFile(null)}>✕</button>
              </div>
              <div className="modal-body">
                {isEditingFile ? (
                  <form onSubmit={handleSaveFileCode} className="edit-code-form">
                    <label>File Code Editor</label>
                    <textarea
                      className="code-textarea"
                      value={fileCodeState}
                      onChange={(e) => setFileCodeState(e.target.value)}
                      rows={12}
                    />
                    <label>Commit Message</label>
                    <input
                      type="text"
                      value={fileCommitMsg}
                      onChange={(e) => setFileCommitMsg(e.target.value)}
                      placeholder="e.g. Update index.js logic"
                      required
                    />
                    <div className="modal-actions">
                      <button type="button" className="button" onClick={() => setIsEditingFile(false)}>Cancel</button>
                      <button disabled={busy} className="button button-primary">Commit Changes</button>
                    </div>
                  </form>
                ) : (
                  <div className="code-display-container">
                    {canManage && (
                      <div className="code-display-toolbar">
                        <button className="button button-small" onClick={() => setIsEditingFile(true)}>✏️ Edit File</button>
                      </div>
                    )}
                    <pre className="code-preview-block">
                      <code>{fileCodeState}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CREATE NEW FILE MODAL */}
        {showNewFileModal && (
          <div className="modal-backdrop" onClick={() => setShowNewFileModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Create New File</h3>
                <button className="close-modal-btn" onClick={() => setShowNewFileModal(false)}>✕</button>
              </div>
              <form onSubmit={handleCreateNewFile} className="new-file-form">
                <label>File Path (e.g. src/App.js or README.md)
                  <input required value={newFilePath} onChange={(e) => setNewFilePath(e.target.value)} placeholder="src/main.js" />
                </label>
                <label>Initial Code Content
                  <textarea rows={6} className="code-textarea" value={newFileCode} onChange={(e) => setNewFileCode(e.target.value)} placeholder="// Write code here..." />
                </label>
                <label>Commit Message
                  <input value={newFileCommitMsg} onChange={(e) => setNewFileCommitMsg(e.target.value)} placeholder="Add new file" />
                </label>
                <div className="modal-actions">
                  <button type="button" className="button" onClick={() => setShowNewFileModal(false)}>Cancel</button>
                  <button disabled={busy} className="button button-primary">Commit New File</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

function IssueRow({ item, canManage, action, currentUserId }) {
  const [editing, setEditing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [form, setForm] = useState({ title: item.title, description: item.description, status: item.status });
  const [commentText, setCommentText] = useState("");

  const save = (e) => {
    e.preventDefault();
    action(() => api.put(`/issue/update/${item._id}`, form)).then((ok) => ok && setEditing(false));
  };

  const addComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    action(() => api.post(`/issue/comment/${item._id}`, {
      text: commentText.trim(),
      user: currentUserId,
      username: "Contributor"
    })).then((ok) => ok && setCommentText(""));
  };

  const toggleStatus = () => {
    const newStatus = item.status === "closed" ? "open" : "closed";
    action(() => api.put(`/issue/update/${item._id}`, { status: newStatus }));
  };

  if (editing)
    return (
      <form className="issue-edit" onSubmit={save}>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        <button className="button button-small button-primary">Save</button>
        <button type="button" className="button button-small" onClick={() => setEditing(false)}>Cancel</button>
      </form>
    );

  return (
    <article className="issue-card-block">
      <div className="issue-row">
        <div>
          <h3>
            <span className={item.status === "closed" ? "status-dot closed" : "status-dot"} />
            {item.title}
          </h3>
          <p>
            #{item._id.slice(-5)} · {item.status || "open"} · {item.description}
          </p>
        </div>
        <div className="issue-actions">
          <button className="text-button" onClick={() => setShowComments(!showComments)}>
            💬 {item.comments?.length || 0} Comments
          </button>
          {canManage && (
            <>
              <button className="text-button" onClick={toggleStatus}>
                {item.status === "closed" ? "Re-open" : "Close"}
              </button>
              <button className="text-button" onClick={() => setEditing(true)}>Edit</button>
              <button
                className="text-button delete-text"
                onClick={() => {
                  if (window.confirm("Delete this issue?")) action(() => api.delete(`/issue/delete/${item._id}`));
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {showComments && (
        <div className="issue-comments-thread">
          <h4>Discussion</h4>
          <div className="comments-list">
            {(item.comments || []).map((c, i) => (
              <div className="comment-bubble" key={i}>
                <div className="comment-head">
                  <strong>{c.username || "User"}</strong>
                  <span className="muted">{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <div className="comment-text">{c.text}</div>
              </div>
            ))}
            {(!item.comments || item.comments.length === 0) && (
              <div className="muted">No comments yet. Start the conversation!</div>
            )}
          </div>

          <form onSubmit={addComment} className="add-comment-form">
            <input
              required
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Leave a comment..."
            />
            <button className="button button-small button-primary">Comment</button>
          </form>
        </div>
      )}
    </article>
  );
}

