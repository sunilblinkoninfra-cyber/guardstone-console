// src/context/AuthContext.tsx

import { createContext, useContext, useState } from "react";
import { User } from "@/types/auth";

type AuthContextType = {
  user: User | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // 🔧 DEV DEFAULT USER (change role to test RBAC)
  const [user] = useState<User>({
    id: "user-001",
    name: "SOC Analyst",
    email: "analyst@company.com",
    role: "SOC_ANALYST", // change to SOC_ADMIN to test
  });

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
