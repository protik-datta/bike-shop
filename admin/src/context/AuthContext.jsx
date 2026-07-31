import { createContext, useContext, useMemo, useState } from "react";
import * as auth from "../lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => auth.getSession());

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      login: (email, password) => {
        const result = auth.login(email, password);
        if (result.ok) setSession(auth.getSession());
        return result;
      },
      logout: () => {
        auth.logout();
        setSession(null);
      },
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
