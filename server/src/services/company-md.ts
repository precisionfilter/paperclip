import { promises as fs } from "node:fs";
import path from "node:path";
import { resolveCompanyMdPath } from "../home-paths.js";

export async function readCompanyMd(companyId: string): Promise<string> {
  const filePath = resolveCompanyMdPath(companyId);
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return "";
    throw error;
  }
}

export async function writeCompanyMd(companyId: string, content: string): Promise<void> {
  const filePath = resolveCompanyMdPath(companyId);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf-8");
}
