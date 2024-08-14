<script setup lang="ts">
import DashboardPanel from "@/components/Dashboard/DashboardPanel.vue";
import { useWalletStore } from "@/store/wallets";
import { User } from "@stytch/vanilla-js";
import { storeToRefs } from "pinia";
import ShareSection from "./ShareSection.vue";

const walletStore = useWalletStore();
const { sharedUsers, fetchingWalletUsers } = storeToRefs(walletStore);

walletStore.fetchWalletUsers();

function getUserAvatar(user: User) {
  const [firstProvider] = user.providers;

  return firstProvider.profile_picture_url;
}

async function removeUser(userId: string) {
  await walletStore.deleteWalletUser(userId);
  await walletStore.fetchWalletUsers();
}
</script>

<template>
  <div :class="$style.container">
    <DashboardPanel :class="$style.usersSection">
      <v-list class="mb-3">
        <v-list-subheader>
          {{ $t("wallet.sharedForUsersTitle") }}
        </v-list-subheader>

        <template v-if="fetchingWalletUsers">
          <v-skeleton-loader
            v-for="key in 3"
            :key="key"
            type="list-item-avatar"
          ></v-skeleton-loader>
        </template>
        <template v-else>
          <v-list-item
            v-for="user in sharedUsers"
            :key="user.user_id"
            :title="`${user.name.first_name} ${user.name.last_name}`"
          >
            <template #prepend>
              <v-avatar color="grey-lighten-1">
                <v-img alt="John" :src="getUserAvatar(user)"></v-img>
              </v-avatar>
            </template>

            <template #append>
              <v-btn
                color="grey-lighten-1"
                icon="mdi-account-remove"
                variant="text"
                @click="removeUser(user.user_id)"
              ></v-btn>
            </template>
          </v-list-item>
        </template>
      </v-list>

      <v-alert
        v-if="!fetchingWalletUsers && !sharedUsers.length"
        elevation="4"
        type="info"
        variant="tonal"
        density="compact"
      >
        {{ $t("wallet.noUserAdded") }}
      </v-alert>

      <ShareSection />
    </DashboardPanel>
  </div>
</template>

<style lang="scss" module>
.container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 90px 1fr;
  grid-template-areas: "users" "users";
  height: 100%;
  gap: 12px;
  padding: 6px;
}

.usersSection {
  grid-area: users;
  padding: 6px;
}
</style>
