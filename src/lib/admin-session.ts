// Shared session storage for the admin password, so both the "Add Project"
// form and the delete button can reuse the same unlocked session without
// asking for the password twice. The real password check always still
// happens on the server (see /api/verify-password and /api/projects) —
// this is just local convenience, not the security boundary.

const ADMIN_SESSION_KEY = "portfolio_admin_password";

export function getStoredAdminPassword(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ADMIN_SESSION_KEY);
}

export function setStoredAdminPassword(password: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ADMIN_SESSION_KEY, password);
}

export function clearStoredAdminPassword(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}
