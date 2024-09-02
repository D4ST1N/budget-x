import { fetchUserAvatar } from "@/helpers/utils";
import stytch from "@/plugins/stytch";
import { OAuthProviders, Products, User } from "@stytch/vanilla-js";
import { defineStore } from "pinia";
import { ref } from "vue";

import { fetchUserDataAction } from "./userActions/fetchUserDataAction";

const REDIRECT_URL = `${import.meta.env.VITE_SERVER_URL}/auth`;

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);

  getUserData();

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

  async function getUserData(): Promise<boolean> {
    const userData = await fetchUserDataAction();

    if (!userData) return false;

    user.value = userData.user;
    user.value.providers[0].profile_picture_url = (await fetchUserAvatar(
      user.value
    )) as string;

    return true;
  }

  return {
    user,
    loginUser,
    getUserData,
  };
});
