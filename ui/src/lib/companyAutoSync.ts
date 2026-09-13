/**
 * Whether COMPANY.md should auto-sync into agent context. Persisted per
 * browser only for now (the agent adapter does not read this yet, that is
 * separate follow-up work), so the checkbox state survives reloads without
 * inventing a schema field ahead of it.
 */
function storageKey(companyId: string): string {
  return `paperclip:company:${companyId}:autoSyncCompanyMd`;
}

export function getCompanyAutoSync(companyId: string): boolean {
  try {
    return localStorage.getItem(storageKey(companyId)) === "true";
  } catch {
    return false;
  }
}

export function setCompanyAutoSync(companyId: string, value: boolean): void {
  try {
    localStorage.setItem(storageKey(companyId), value ? "true" : "false");
  } catch {
    /* best effort */
  }
}
