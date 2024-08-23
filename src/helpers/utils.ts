import { auth } from "@/plugins/axios";
import { AccessLevel } from "@/types/AccessLevel";
import { UserData } from "@/types/User";
import { User } from "@stytch/vanilla-js";

import { getUserAvatarUrl } from "./serverUrls";

export function timeout(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function fetchUserAvatar(
  user: User | UserData
): Promise<string | null> {
  const [provider] = user.providers;
  const avatarUrl = provider.profile_picture_url;

  try {
    const response = await auth.get(getUserAvatarUrl(), {
      params: {
        url: avatarUrl,
      },
      responseType: "blob",
    });

    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error("errors.AvatarFetchError", error);
  }

  return null;
}

export function hasAccess(
  requiredAccess: AccessLevel[],
  userAccess: AccessLevel[],
  operator: "AND" | "OR" = "AND"
) {
  if (operator === "AND") {
    requiredAccess.every((access) => userAccess.includes(access));
  }

  return requiredAccess.some((access) => userAccess.includes(access));
}

export function hashStringToNumber(str: string): number {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }

  return Math.abs(hash);
}

export function generateColorFromHash(str: string): string {
  const hash = hashStringToNumber(str);
  const r = (hash & 0xff0000) >> 16;
  const g = (hash & 0x00ff00) >> 8;
  const b = hash & 0x0000ff;

  return `rgb(${r}, ${g}, ${b})`;
}

export function formatDate(
  input: Date | string,
  format: string = "YYYY-MM-DD"
): string {
  const date = typeof input === "string" ? new Date(input) : input;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const formattedDate = format
    .replace("YYYY", year.toString())
    .replace("MM", month)
    .replace("DD", day);

  return formattedDate;
}
