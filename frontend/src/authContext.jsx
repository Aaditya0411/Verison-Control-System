/* eslint-disable react/prop-types, react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";
import React from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem("userId"));
  const value = useMemo(() => ({
    currentUser,
    setCurrentUser,
    signOut: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setCurrentUser(null);
    },
  }), [currentUser]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
