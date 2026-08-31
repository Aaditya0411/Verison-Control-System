import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";
import axios from "axios";

const Navbar = () => {
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .get(`http://localhost:3002/userProfile/${userId}`)
        .then((res) => {
          const user = res.data.user || res.data;
          if (user?.username) setUsername(user.username);
        })
        .catch(() => {});
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    navigate("/auth");
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <nav className="bg-surface font-body-base text-body-base fixed top-0 w-full z-50 border-b border-outline-variant flex justify-between items-center px-lg py-sm h-16 max-w-full">
      <div className="flex items-center gap-lg">
        <Link
          to="/"
          className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-primary-container text-2xl">
            terminal
          </span>
          REVIX
        </Link>
        <div className="hidden md:flex gap-lg">
          <Link
            to="/"
            className="text-primary font-bold border-b-2 border-primary pb-1 transition-colors duration-200"
          >
            Repositories
          </Link>
          <Link
            to="/profile"
            className="text-on-surface-variant hover:text-primary transition-colors duration-200"
          >
            Profile
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-md">
        <div className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline text-sm">
            search
          </span>
          <input
            className="bg-surface-container-low border-outline-variant text-on-surface rounded-md pl-8 pr-4 py-1 text-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container/30 w-64 transition-all"
            placeholder="Search repositories..."
            type="text"
          />
        </div>

        <button
          onClick={() => navigate("/create")}
          className="bg-[#238636] hover:bg-[#39d353] text-[#f0f6fc] px-4 py-1.5 rounded-md font-body-sm text-body-sm transition-colors duration-200 hidden sm:block"
        >
          + Create
        </button>

        <button
          onClick={handleLogout}
          className="text-on-surface-variant hover:text-on-surface text-sm ml-2 font-medium"
        >
          Logout
        </button>

        <div
          onClick={() => navigate("/profile")}
          className="w-8 h-8 rounded-full border border-outline-variant ml-2 bg-gradient-to-tr from-primary-container to-secondary flex items-center justify-center font-bold text-on-primary-container cursor-pointer text-sm"
          title={`Profile (${username})`}
        >
          {getInitial(username)}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;