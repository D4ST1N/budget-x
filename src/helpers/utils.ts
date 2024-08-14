import { auth } from "@/plugins/axios";
import { UserData } from "@/types/User";
import { User } from "@stytch/vanilla-js";
import { getAvatar } from "./serverUrls";

export function timeout(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function fetchUserAvatar(
  user: User | UserData
): Promise<string | null> {
  const [provider] = user.providers;
  const avatarUrl = provider.profile_picture_url;

  try {
    const response = await auth.get(getAvatar(), {
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
