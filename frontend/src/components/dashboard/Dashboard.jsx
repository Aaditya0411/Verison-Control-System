import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `http://localhost:3002/repo/user/${userId}`
        );
        const data = await response.json();
        setRepositories(data.repositories || []);
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3002/repo/all`);
        const data = await response.json();
        const otherUsersRepos = (data || []).filter((repo) => {
          const ownerId = repo.owner?._id ? repo.owner._id.toString() : repo.owner?.toString();
          return ownerId !== userId;
        });
        setSuggestedRepositories(otherUsersRepos);
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = (repositories || []).filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  return (
    <div className="bg-background text-on-background font-body-base min-h-screen flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 mt-16 pt-lg pb-xl px-sm md:px-lg w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
          {/* LEFT SIDEBAR: Suggested Repositories */}
          <aside className="lg:col-span-3 flex flex-col gap-md">
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-md">
              <h3 className="font-headline-sm text-on-surface font-bold mb-md flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container text-lg">
                  explore
                </span>
                Suggested Repos
              </h3>
              <div className="flex flex-col gap-sm">
                {Array.isArray(suggestedRepositories) && suggestedRepositories.length > 0 ? (
                  suggestedRepositories.map((repo) => (
                    <div
                      key={repo._id}
                      onClick={() => navigate(`/repo/${repo._id}`)}
                      className="p-sm bg-surface border border-outline-variant/60 hover:border-primary-container rounded cursor-pointer transition-all group"
                    >
                      <h4 className="font-code-sm font-bold text-primary group-hover:underline">
                        {repo.name}
                      </h4>
                      <p className="text-on-surface-variant text-xs mt-1 line-clamp-2">
                        {repo.description || "No description available"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-on-surface-variant text-xs italic">
                    No suggested repositories found.
                  </p>
                )}
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT: Your Repositories */}
          <section className="lg:col-span-6 flex flex-col gap-md">
            <div className="flex justify-between items-center mb-xs">
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                Your Repositories
              </h2>
              <button
                onClick={() => navigate("/create")}
                className="btn-primary rounded px-md py-1.5 text-xs font-semibold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                New Repo
              </button>
            </div>

            <div className="relative mb-sm">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                placeholder="Search repositories..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-glass w-full rounded-md pl-9 pr-4 py-2 text-sm text-on-surface"
              />
            </div>

            <div className="flex flex-col gap-md">
              {Array.isArray(searchResults) && searchResults.length > 0 ? (
                searchResults.map((repo) => (
                  <div
                    key={repo._id}
                    onClick={() => navigate(`/repo/${repo._id}`)}
                    className="p-md bg-surface-container-low border border-outline-variant hover:border-primary-container/70 rounded-lg cursor-pointer transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-xs">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary-container text-lg">
                          folder
                        </span>
                        <h4 className="font-headline-sm font-bold text-primary group-hover:underline">
                          {repo.name}
                        </h4>
                      </div>
                      <span className="px-2 py-0.5 rounded-full border border-outline-variant text-xs text-on-surface-variant bg-surface">
                        {repo.visibility ? "Public" : "Private"}
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-sm mt-1">
                      {repo.description || "No description available"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-xl bg-surface-container-low border border-outline-variant rounded-lg text-center">
                  <p className="text-on-surface-variant text-sm mb-md">
                    No repositories found. Create one to get started!
                  </p>
                  <button
                    onClick={() => navigate("/create")}
                    className="btn-primary rounded px-md py-2 text-sm font-semibold inline-flex items-center gap-1"
                  >
                    + Create Repository
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* RIGHT SIDEBAR: Upcoming Events */}
          <aside className="lg:col-span-3 flex flex-col gap-md">
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-md">
              <h3 className="font-headline-sm text-on-surface font-bold mb-md flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-lg">
                  event
                </span>
                Upcoming Events
              </h3>
              <ul className="flex flex-col gap-sm">
                <li className="p-sm bg-surface border border-outline-variant/60 rounded">
                  <p className="font-body-sm font-bold text-on-surface">Tech Conference</p>
                  <p className="text-on-surface-variant text-xs mt-0.5">Dec 15 · Online Event</p>
                </li>
                <li className="p-sm bg-surface border border-outline-variant/60 rounded">
                  <p className="font-body-sm font-bold text-on-surface">Developer Meetup</p>
                  <p className="text-on-surface-variant text-xs mt-0.5">Dec 25 · Community Hub</p>
                </li>
                <li className="p-sm bg-surface border border-outline-variant/60 rounded">
                  <p className="font-body-sm font-bold text-on-surface">React Summit</p>
                  <p className="text-on-surface-variant text-xs mt-0.5">Jan 5 · Global Stage</p>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;