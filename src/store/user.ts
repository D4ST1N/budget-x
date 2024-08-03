import { ref } from "vue";
import { defineStore } from "pinia";
import { OAuthProviders, Products, User } from "@stytch/vanilla-js";
import stytch from "@/plugins/stytch";
import { UserVerificationResponse } from "@/types/User";

const REDIRECT_URL = `${import.meta.env.VITE_SERVER_URL}/auth`;

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);

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
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/auth/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }
    );
    const parsedResponse = (await response.json()) as UserVerificationResponse;

    if (parsedResponse.success) {
      user.value = parsedResponse.user;
    }

    return parsedResponse;
  }

  return {
    loginUser,
    verifyUser,
    user,
  };
});
