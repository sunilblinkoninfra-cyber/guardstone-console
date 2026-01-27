// src/types/auth.ts

export type Role = "SOC_ANALYST" | "SOC_ADMIN";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export const PERMISSIONS = {
  MARK_FALSE_POSITIVE: ["SOC_ANALYST", "SOC_ADMIN"],
  CONFIRM_MALICIOUS: ["SOC_ANALYST", "SOC_ADMIN"],
  RELEASE_EMAIL: ["SOC_ADMIN"],
  BLOCK_SENDER: ["SOC_ADMIN"],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function can(
  user: User | null,
  permission: Permission
): boolean {
  if (!user) return false;
  return PERMISSIONS[permission].includes(user.role);
}
