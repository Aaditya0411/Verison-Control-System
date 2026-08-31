import { Navigate, Outlet, useRoutes } from "react-router-dom";
import React from "react";
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import { useAuth } from "./authContext";
import CreateRepo from "./components/repo/CreateRepo";
import RepoDetail from "./components/repo/RepoDetail";

function ProtectedRoute() {
  const { currentUser } = useAuth();
  return currentUser ? <Outlet /> : <Navigate to="/auth" replace />;
}

export default function ProjectRoutes() {
  return useRoutes([
    { path: "/auth", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { element: <ProtectedRoute />, children: [
      { path: "/", element: <Dashboard /> },
      { path: "/new", element: <CreateRepo /> },
      { path: "/repo/:repoId", element: <RepoDetail /> },
      { path: "/profile", element: <Profile /> },
    ] },
    { path: "*", element: <Navigate to="/" replace /> },
  ]);
}
