import { verificationInterval } from "@/config/constants";
import { verifyTokenUrl } from "@/helpers/serverUrls";
import { fetchUserAvatar } from "@/helpers/utils";
import { auth } from "@/plugins/axios";
import stytch from "@/plugins/stytch";
import ServerError from "@/types/ServerError";
import { UserVerificationResponse } from "@/types/User";
import { OAuthProviders, Products, User } from "@stytch/vanilla-js";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const REDIRECT_URL = `${import.meta.env.VITE_SERVER_URL}/auth`;

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);
  const lastVerificationTime = ref<number | null>(null);

  const isVerificationNeeded = computed(() => {
    if (!lastVerificationTime.value) return true;

    return Date.now() - lastVerificationTime.value > verificationInterval;
  });

  function loginUser(elementId: string) {
    stytch.mountLogin({
      elementId: elementId,
      config: {
        products: [Products.emailMagicLinks, Products.oauth],
        emailMagicLinksOptions: {
          loginRedirectURL: REDIRECT_URL,
          loginExpirationMinutes: 60,
          signupRedirectURL: REDIRECT_URL,
          signupExpirationMinutes: 60,
        },
        oauthOptions: {
          providers: [
            {
              type: OAuthProviders.Google,
            },
          ],
        },
      },
    });
  }

  async function verifyUser(token: string) {
    try {
      const response = await auth.post<UserVerificationResponse>(
        verifyTokenUrl(),
        JSON.stringify({ token })
      );

      if (response.data.success) {
        user.value = response.data.user;
        user.value.providers[0].profile_picture_url = (await fetchUserAvatar(
          user.value
        )) as string;
        lastVerificationTime.value = Date.now();
      }

      return response.data;
    } catch (e) {
      console.error(e);
      return {
        success: false,
        error: ServerError.ServerConnectionFailed,
      };
    }
  }

  return {
    user,
    isVerificationNeeded,
    loginUser,
    verifyUser,
  };
});
