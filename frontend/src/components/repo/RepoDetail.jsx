import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";

const RepoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Sub-tabs: 'code', 'issues', 'settings'
  const [activeTab, setActiveTab] = useState("code");

  // Add File state
  const [fileName, setFileName] = useState("");
  const [addingFile, setAddingFile] = useState(false);

  // Issue state
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDesc, setIssueDesc] = useState("");
  const [creatingIssue, setCreatingIssue] = useState(false);
  const [issueFilter, setIssueFilter] = useState("all");

  const fetchRepo = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3002/repo/id/${id}`);
      setRepo(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load repository.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepo();
  }, [id]);

  // FILE OPERATIONS
  const handleAddFile = async (e) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    try {
      setAddingFile(true);
      await axios.put(`http://localhost:3002/repo/update/${id}`, {
        content: fileName.trim(),
        description: repo.description,
      });
      setFileName("");
      setAddingFile(false);
      fetchRepo();
    } catch (err) {
      console.error(err);
      alert("Failed to add file.");
      setAddingFile(false);
    }
  };

  const handleDeleteFile = async (fileToDelete) => {
    if (!window.confirm(`Delete '${fileToDelete}' from repository?`)) return;

    try {
      setLoading(true);
      await axios.put(`http://localhost:3002/repo/update/${id}`, {
        removeContent: fileToDelete,
      });
      alert(`File '${fileToDelete}' deleted!`);
      fetchRepo();
    } catch (err) {
      console.error(err);
      alert("Failed to delete file.");
      setLoading(false);
    }
  };

  // VISIBILITY & REPO DELETE
  const handleToggleVisibility = async () => {
    try {
      await axios.patch(`http://localhost:3002/repo/toggle/${id}`);
      fetchRepo();
    } catch (err) {
      console.error(err);
      alert("Failed to toggle visibility.");
    }
  };

  const handleDeleteRepo = async () => {
    if (!window.confirm("Are you sure you want to delete this repository? This cannot be undone.")) return;

    try {
      await axios.delete(`http://localhost:3002/repo/delete/${id}`);
      alert("Repository deleted!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to delete repository.");
    }
  };

  // ISSUE OPERATIONS
  const handleCreateIssue = async (e) => {
    e.preventDefault();
    if (!issueTitle.trim() || !issueDesc.trim()) return;

    try {
      setCreatingIssue(true);
      await axios.post("http://localhost:3002/issue/create", {
        id: id,
        title: issueTitle.trim(),
        description: issueDesc.trim(),
      });
      setIssueTitle("");
      setIssueDesc("");
      setCreatingIssue(false);
      fetchRepo();
    } catch (err) {
      console.error(err);
      alert("Failed to create issue.");
      setCreatingIssue(false);
    }
  };

  const handleToggleIssueStatus = async (issueId, currentStatus) => {
    const newStatus = currentStatus === "closed" ? "open" : "closed";
    try {
      await axios.put(`http://localhost:3002/issue/update/${issueId}`, {
        status: newStatus,
      });
      fetchRepo();
    } catch (err) {
      console.error(err);
      alert("Failed to update issue status.");
    }
  };

  const handleDeleteIssue = async (issueId) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;

    try {
      await axios.delete(`http://localhost:3002/issue/delete/${issueId}`);
      alert("Issue deleted!");
      fetchRepo();
    } catch (err) {
      console.error(err);
      alert("Failed to delete issue.");
    }
  };

  if (loading) {
    return (
      <div className="bg-background text-on-background font-body-base min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 mt-16 p-lg max-w-7xl mx-auto w-full">
          <p className="text-on-surface-variant">Loading repository details...</p>
        </main>
      </div>
    );
  }

  if (error || !repo) {
    return (
      <div className="bg-background text-on-background font-body-base min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 mt-16 p-lg max-w-7xl mx-auto w-full">
          <div className="p-sm mb-lg bg-error-container/20 border border-error-container rounded text-error">
            {error || "Repository not found"}
          </div>
          <button
            className="flex items-center gap-1 hover:text-primary transition-colors text-body-sm text-on-surface"
            onClick={() => navigate("/")}
          >
            ← Back to Dashboard
          </button>
        </main>
      </div>
    );
  }

  const currentUserId = (localStorage.getItem("userId") || "").toString();
  const ownerId = (repo.owner?._id || repo.owner || "").toString();
  const isOwner = Boolean(currentUserId && ownerId && currentUserId === ownerId);

  if (!repo.visibility && !isOwner) {
    return (
      <div className="bg-background text-on-background font-body-base min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 mt-16 p-lg max-w-7xl mx-auto w-full">
          <div className="p-sm mb-lg bg-error-container/20 border border-error-container rounded text-error">
            🔒 This repository is Private. Access is restricted to the repository owner.
          </div>
          <button
            className="flex items-center gap-1 hover:text-primary transition-colors text-body-sm text-on-surface"
            onClick={() => navigate("/")}
          >
            ← Back to Dashboard
          </button>
        </main>
      </div>
    );
  }

  const filteredIssues = (repo.issues || []).filter((issue) => {
    if (typeof issue === "string") return true;
    if (issueFilter === "open") return issue.status !== "closed";
    if (issueFilter === "closed") return issue.status === "closed";
    return true;
  });

  return (
    <div className="bg-background text-on-background font-body-base min-h-screen flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 overflow-y-auto mt-16 pt-lg pb-xl px-sm md:px-lg w-full max-w-7xl mx-auto">
        {/* Repo Header Area */}
        <header className="mb-lg">
          <div className="flex items-center gap-sm mb-xs text-on-surface-variant">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 hover:text-primary transition-colors font-body-sm text-body-sm group"
            >
              <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">
                arrow_back
              </span>
              Back to Dashboard
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md mb-md">
            <div className="flex items-center gap-md">
              <div className="bg-surface-container-low p-2 rounded-lg border border-outline-variant">
                <span
                  className="material-symbols-outlined text-primary-container text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  folder
                </span>
              </div>
              <div>
                <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface flex items-center gap-2">
                  <span className="text-on-surface-variant font-normal">
                    {repo.owner?.username || "user"}
                  </span>
                  <span className="text-on-surface-variant font-normal">/</span>
                  <span className="font-bold">{repo.name}</span>
                </h1>
              </div>
              <span className="px-2 py-0.5 rounded-full border border-outline-variant text-on-surface-variant font-code-sm text-code-sm bg-surface-container-low ml-2">
                {repo.visibility ? "Public" : "Private"}
              </span>
            </div>

            <div className="flex items-center gap-sm">
              <button className="flex items-center gap-2 border border-outline-variant bg-surface hover:border-primary-container/50 text-on-surface px-3 py-1.5 rounded-md font-body-sm transition-all group">
                <span className="material-symbols-outlined text-[18px] group-hover:text-primary-container">
                  star
                </span>
                <span>Star</span>
                <span className="bg-surface-container-highest px-1.5 rounded text-xs text-on-surface-variant ml-1">
                  12
                </span>
              </button>
              <button className="flex items-center gap-2 border border-outline-variant bg-surface hover:border-primary-container/50 text-on-surface px-3 py-1.5 rounded-md font-body-sm transition-all group">
                <span className="material-symbols-outlined text-[18px] group-hover:text-primary-container">
                  fork_right
                </span>
                <span>Fork</span>
                <span className="bg-surface-container-highest px-1.5 rounded text-xs text-on-surface-variant ml-1">
                  4
                </span>
              </button>
            </div>
          </div>

          <p className="text-on-surface-variant font-body-base max-w-3xl mb-lg">
            {repo.description || "No description provided."}
          </p>

          {/* Repo Tabs */}
          <div className="border-b border-outline-variant flex gap-lg font-body-sm text-body-sm">
            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-2 pb-2 px-1 transition-colors ${
                activeTab === "code"
                  ? "text-primary font-bold border-b-2 border-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">code</span>
              Code ({repo.content?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab("issues")}
              className={`flex items-center gap-2 pb-2 px-1 transition-colors ${
                activeTab === "issues"
                  ? "text-primary font-bold border-b-2 border-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">error</span>
              Issues
              <span className="bg-surface-container-highest px-1.5 rounded-full text-xs">
                {repo.issues?.length || 0}
              </span>
            </button>

            {isOwner && (
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-2 pb-2 px-1 transition-colors ${
                  activeTab === "settings"
                    ? "text-primary font-bold border-b-2 border-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">settings</span>
                Settings
              </button>
            )}
          </div>
        </header>

        {/* TAB 1: CODE */}
        {activeTab === "code" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
            <div className="lg:col-span-9 flex flex-col gap-sm">
              {/* Commit Bar */}
              <div className="bg-surface-container-low border border-outline-variant rounded-t-lg p-md flex items-center justify-between">
                <div className="flex items-center gap-sm">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary-container to-secondary flex items-center justify-center font-bold text-xs text-on-primary-container">
                    {(repo.owner?.username || "U").charAt(0).toUpperCase()}
                  </div>
                  <span className="font-body-sm font-bold text-on-surface">
                    {repo.owner?.username || "owner"}
                  </span>
                  <span className="text-on-surface-variant font-body-sm truncate max-w-[200px] sm:max-w-md">
                    Initial repository setup and content push
                  </span>
                </div>
                <div className="flex items-center gap-sm font-code-sm text-code-sm">
                  <span className="text-on-surface-variant hidden sm:inline">Just now</span>
                  <span className="text-primary hover:underline font-mono">main</span>
                </div>
              </div>

              {/* File List */}
              <div className="border-x border-b border-outline-variant rounded-b-lg bg-surface flex flex-col">
                {repo.content && repo.content.length > 0 ? (
                  repo.content.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-sm hover:bg-surface-container-low transition-colors border-b border-outline-variant/50 group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-outline">
                          description
                        </span>
                        <span className="font-code-sm text-code-sm text-on-surface font-mono">
                          {file}
                        </span>
                      </div>
                      <div className="flex items-center gap-md font-code-sm text-code-sm text-on-surface-variant">
                        <span className="hidden sm:inline">Added file</span>
                        {isOwner && (
                          <button
                            onClick={() => handleDeleteFile(file)}
                            className="opacity-0 group-hover:opacity-100 hover:text-error transition-all p-1"
                            title="Delete file"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              delete
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-md text-on-surface-variant font-body-sm text-center">
                    No files added yet.
                  </div>
                )}
              </div>

              {/* ADD FILE FORM - ONLY OWNER */}
              {isOwner ? (
                <form
                  onSubmit={handleAddFile}
                  className="mt-md bg-surface-container-low border border-outline-variant rounded-lg p-md"
                >
                  <h4 className="font-headline-sm text-on-surface font-bold mb-xs">
                    Add New File
                  </h4>
                  <div className="flex gap-sm mt-sm">
                    <input
                      type="text"
                      placeholder="e.g. index.js, README.md, style.css"
                      className="input-glass flex-1 rounded px-sm py-sm font-code-base text-code-base text-on-surface placeholder-outline"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      required
                    />
                    <button
                      type="submit"
                      disabled={addingFile}
                      className="btn-primary rounded px-lg py-sm font-body-sm font-semibold flex items-center gap-xs disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      {addingFile ? "Adding..." : "+ Add File"}
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-on-surface-variant italic text-sm mt-sm">
                  🔒 Only the repository owner can add or remove files.
                </p>
              )}
            </div>

            {/* Sidebar / About */}
            <div className="lg:col-span-3 flex flex-col gap-lg">
              <div className="bg-surface-container-low border border-outline-variant rounded-lg p-md">
                <h3 className="font-headline-sm text-on-surface font-bold mb-sm">About</h3>
                <p className="text-on-surface-variant font-body-sm mb-md">
                  {repo.description || "No description provided."}
                </p>
                <div className="flex items-center gap-2 text-on-surface-variant font-body-sm mb-2 hover:text-primary transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">link</span>
                  <a href="#">revix.dev/{repo.name}</a>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant font-body-sm mb-4">
                  <span className="material-symbols-outlined text-[18px]">book</span>
                  <span>Readme</span>
                </div>
                <h4 className="font-body-sm text-on-surface font-bold mb-xs mt-md">
                  Languages
                </h4>
                <div className="w-full bg-surface-container-highest rounded-full h-2 mb-2 flex overflow-hidden">
                  <div className="bg-[#dea584] h-full" style={{ width: "70%" }}></div>
                  <div className="bg-yellow-400 h-full" style={{ width: "30%" }}></div>
                </div>
                <ul className="font-code-sm text-code-sm text-on-surface-variant space-y-1">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#dea584]"></span> JavaScript 70%
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span> HTML/CSS 30%
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ISSUES */}
        {activeTab === "issues" && (
          <div className="bg-surface-container-low border border-outline-variant rounded-lg p-md">
            <div className="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
              <h3 className="font-headline-sm text-on-surface font-bold">
                Issues ({repo.issues?.length || 0})
              </h3>
              <div className="flex gap-xs bg-surface p-1 rounded-md border border-outline-variant">
                <button
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    issueFilter === "all" ? "bg-surface-container-high text-on-surface font-bold" : "text-on-surface-variant"
                  }`}
                  onClick={() => setIssueFilter("all")}
                >
                  All
                </button>
                <button
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    issueFilter === "open" ? "bg-surface-container-high text-on-surface font-bold" : "text-on-surface-variant"
                  }`}
                  onClick={() => setIssueFilter("open")}
                >
                  Open
                </button>
                <button
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    issueFilter === "closed" ? "bg-surface-container-high text-on-surface font-bold" : "text-on-surface-variant"
                  }`}
                  onClick={() => setIssueFilter("closed")}
                >
                  Closed
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-sm mb-lg">
              {filteredIssues.length > 0 ? (
                filteredIssues.map((issue) => {
                  const issueObj = typeof issue === "string" ? { _id: issue, title: issue } : issue;
                  const isClosed = issueObj.status === "closed";

                  return (
                    <div
                      key={issueObj._id}
                      className="p-md bg-surface border border-outline-variant rounded-md flex justify-between items-start"
                    >
                      <div>
                        <div className="flex items-center gap-sm">
                          <span
                            className={`material-symbols-outlined text-[18px] ${
                              isClosed ? "text-tertiary-container" : "text-secondary"
                            }`}
                          >
                            {isClosed ? "check_circle" : "error"}
                          </span>
                          <h4
                            className={`font-body-base font-bold text-on-surface ${
                              isClosed ? "line-through opacity-70" : ""
                            }`}
                          >
                            {issueObj.title || "Untitled Issue"}
                          </h4>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full border ${
                              isClosed
                                ? "bg-tertiary-container/20 text-tertiary-container border-tertiary-container/40"
                                : "bg-secondary-container/20 text-secondary border-secondary-container/40"
                            }`}
                          >
                            {isClosed ? "Closed" : "Open"}
                          </span>
                        </div>
                        {issueObj.description && (
                          <p className="text-on-surface-variant text-body-sm mt-1 ml-6">
                            {issueObj.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-sm">
                        <button
                          onClick={() => handleToggleIssueStatus(issueObj._id, issueObj.status)}
                          className="px-2 py-1 border border-outline-variant rounded text-xs text-on-surface-variant hover:text-on-surface"
                        >
                          {isClosed ? "Reopen" : "Close"}
                        </button>
                        <button
                          onClick={() => handleDeleteIssue(issueObj._id)}
                          className="text-error hover:opacity-80 p-1"
                          title="Delete Issue"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-on-surface-variant italic text-sm">No issues found.</p>
              )}
            </div>

            {/* CREATE ISSUE FORM */}
            <form onSubmit={handleCreateIssue} className="border-t border-outline-variant pt-md">
              <h4 className="font-headline-sm text-on-surface font-bold mb-xs">
                Submit an Issue
              </h4>
              <input
                type="text"
                placeholder="Issue Title"
                className="input-glass w-full rounded px-sm py-sm font-body-base text-on-surface mb-sm"
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
                required
              />
              <textarea
                placeholder="Describe the bug or feature request..."
                className="input-glass w-full rounded px-sm py-sm font-body-base text-on-surface mb-sm h-20 resize-none"
                value={issueDesc}
                onChange={(e) => setIssueDesc(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={creatingIssue}
                className="btn-primary rounded px-lg py-sm font-body-sm font-semibold disabled:opacity-50"
              >
                {creatingIssue ? "Submitting..." : "Submit Issue"}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: SETTINGS */}
        {activeTab === "settings" && isOwner && (
          <div className="bg-surface-container-low border border-outline-variant rounded-lg p-md flex flex-col gap-lg">
            <h3 className="font-headline-sm text-on-surface font-bold">
              Repository Settings
            </h3>

            <div className="p-md bg-surface border border-outline-variant rounded-md">
              <h4 className="font-body-base font-bold text-on-surface mb-xs">
                Visibility
              </h4>
              <p className="text-on-surface-variant text-body-sm mb-sm">
                Current Status:{" "}
                <strong className="text-on-surface font-bold">
                  {repo.visibility ? "Public" : "Private"}
                </strong>
              </p>
              <button
                onClick={handleToggleVisibility}
                className="px-md py-1.5 border border-outline-variant rounded text-body-sm text-on-surface hover:border-primary-container"
              >
                Switch to {repo.visibility ? "Private" : "Public"}
              </button>
            </div>

            <div className="p-md bg-error-container/10 border border-error-container/40 rounded-md">
              <h4 className="font-body-base font-bold text-error mb-xs">Danger Zone</h4>
              <p className="text-on-surface-variant text-body-sm mb-sm">
                Deleting this repository is permanent and cannot be undone.
              </p>
              <button
                onClick={handleDeleteRepo}
                className="bg-error-container text-on-error-container px-md py-1.5 rounded font-body-sm font-semibold hover:bg-error hover:text-on-error transition-colors"
              >
                Delete Repository
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RepoDetail;
