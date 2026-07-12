// Central source of truth for the "current user".
// UI-only for now (reads/writes localStorage); swap for the real auth/backend later.

export type CurrentUser = {
  name: string;
  role: string;
  initials: string;
};

const STORAGE_KEY = "assetflow_user";

const DEFAULT_USER = {
  name: "Sophia Thompson",
  role: "Lead Asset Manager",
};

export const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

export const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;

/** Turn "sophia.thompson@corp.com" into "Sophia Thompson". */
export const nameFromEmail = (email: string): string => {
  const local = (email.split("@")[0] || "").trim();
  const parts = local.split(/[._-]+/).filter(Boolean);
  return parts.map((p) => p[0].toUpperCase() + p.slice(1)).join(" ");
};

export const getCurrentUser = (): CurrentUser => {
  let stored: { name?: string; role?: string } = {};
  try {
    stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    stored = {};
  }
  const name = stored.name?.trim() || DEFAULT_USER.name;
  const role = stored.role?.trim() || DEFAULT_USER.role;
  return { name, role, initials: getInitials(name) };
};

export const setCurrentUser = (user: { name: string; role?: string }) => {
  const name = user.name.trim();
  if (!name) return;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ name, role: user.role?.trim() || DEFAULT_USER.role }),
  );
};
