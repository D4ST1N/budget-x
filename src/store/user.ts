import { verificationInterval } from "@/config/constants";
import { fetchUserAvatar } from "@/helpers/utils";
import stytch from "@/plugins/stytch";
import { OAuthProviders, Products, User } from "@stytch/vanilla-js";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { verifyUserAction } from "./userActions/verifyUserAction";

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

  async function verifyUser(token: string): Promise<boolean> {
    const userData = await verifyUserAction({ token });

    if (!userData) return false;

    user.value = userData.user;
    user.value.providers[0].profile_picture_url = (await fetchUserAvatar(
      user.value
    )) as string;
    lastVerificationTime.value = Date.now();

    return true;
  }

  return {
    user,
    isVerificationNeeded,
    loginUser,
    verifyUser,
  };
});
