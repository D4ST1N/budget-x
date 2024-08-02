<script setup lang="ts">
import { onMounted } from "vue";
import { StytchUIClient, OAuthProviders, Products } from "@stytch/vanilla-js";

const stytch = new StytchUIClient(
  "public-token-test-1baf643f-2310-434f-a342-d18aee480568"
);
const REDIRECT_URL = `${import.meta.env.VITE_SERVER_URL}/auth`;

onMounted(() => {
  stytch.mountLogin({
    elementId: "#stytch-sdk",
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
});
</script>

<template>
  <div :class="$style.page">
    <h1>Login page</h1>
    <div id="stytch-sdk"></div>
  </div>
</template>

<style lang="scss" module>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}
</style>
