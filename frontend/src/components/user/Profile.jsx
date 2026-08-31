import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ username: "User", email: "" });
  const [userRepos, setUserRepos] = useState([]);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'repos'
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      // Fetch User Details
      axios
        .get(`http://localhost:3002/userProfile/${userId}`)
        .then((res) => {
          setUserDetails(res.data.user || res.data);
        })
        .catch((err) => console.error("Cannot fetch user details: ", err));

      // Fetch User Repositories
      axios
        .get(`http://localhost:3002/repo/user/${userId}`)
        .then((res) => {
          setUserRepos(res.data.repositories || []);
        })
        .catch((err) => console.error("Cannot fetch user repos: ", err));
    }
  }, []);

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <>
      <Navbar />

      {/* Sub-header Navigation */}
      <div className="profile-nav-bar">
        <div className="profile-nav-container">
          <button
            className={`nav-tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            📖 Overview
          </button>
          <button
            className={`nav-tab ${activeTab === "repos" ? "active" : ""}`}
            onClick={() => setActiveTab("repos")}
          >
            📦 Repositories <span className="counter-badge">{userRepos.length}</span>
          </button>
        </div>
      </div>

      <div className="profile-page-container">
        {/* LEFT SIDEBAR - USER INFO */}
        <aside className="profile-sidebar">
          <div className="avatar-circle">
            {getInitial(userDetails.username)}
          </div>

          <div className="user-name-group">
            <h2 className="user-display-name">{userDetails.username}</h2>
            <p className="user-handle">@{userDetails.username?.toLowerCase()}</p>
            {userDetails.email && <p className="user-email">✉️ {userDetails.email}</p>}
          </div>

          <button className="edit-profile-btn">Edit Profile</button>

          <div className="follow-info">
            <span>👥 <strong>10</strong> followers</span>
            <span>·</span>
            <span><strong>3</strong> following</span>
          </div>

          <div className="sidebar-divider" />

          <div className="sidebar-stats">
            <p>📁 Repositories: <strong>{userRepos.length}</strong></p>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="profile-main">
          {activeTab === "overview" && (
            <>
              {/* PINNED REPOSITORIES */}
              <div className="pinned-repos-section">
                <h3>Your Repositories</h3>
                <div className="profile-repo-grid">
                  {userRepos.length > 0 ? (
                    userRepos.map((repo) => (
                      <div
                        key={repo._id}
                        className="profile-repo-card"
                        onClick={() => navigate(`/repo/${repo._id}`)}
                      >
                        <div className="repo-card-header">
                          <span className="repo-card-icon">📁</span>
                          <span className="repo-card-title">{repo.name}</span>
                          <span className={`mini-badge ${repo.visibility ? "public" : "private"}`}>
                            {repo.visibility ? "Public" : "Private"}
                          </span>
                        </div>
                        <p className="repo-card-desc">
                          {repo.description || "No description provided."}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="empty-text">You haven't created any repositories yet.</p>
                  )}
                </div>
              </div>

              {/* HEATMAP CONTRIBUTIONS */}
              <div className="contributions-section">
                <HeatMapProfile />
              </div>
            </>
          )}

          {activeTab === "repos" && (
            <div className="all-repos-section">
              <h3>All Repositories ({userRepos.length})</h3>
              <div className="full-repo-list">
                {userRepos.length > 0 ? (
                  userRepos.map((repo) => (
                    <div
                      key={repo._id}
                      className="full-repo-item"
                      onClick={() => navigate(`/repo/${repo._id}`)}
                    >
                      <div className="full-repo-title">
                        <span>{repo.name}</span>
                        <span className={`mini-badge ${repo.visibility ? "public" : "private"}`}>
                          {repo.visibility ? "Public" : "Private"}
                        </span>
                      </div>
                      <p className="full-repo-desc">{repo.description || "No description provided."}</p>
                    </div>
                  ))
                ) : (
                  <p className="empty-text">No repositories found.</p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Profile;