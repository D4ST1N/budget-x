<script setup lang="ts">
import ConfirmDialog from "@/components/Base/ConfirmDialog.vue";
import UserEditDialog from "@/components/UserEditDialog/UserEditDialog.vue";
import { hasAccess } from "@/helpers/utils";
import { useUserStore } from "@/store/user";
import { useWalletStore } from "@/store/wallet";
import { AccessLevel } from "@/types/AccessLevel";
import { UserData } from "@/types/User";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const userStore = useUserStore();
const walletStore = useWalletStore();

const { user: currentUser } = storeToRefs(userStore);
const { sharedUsers, fetchingWalletUsers, currentAccessLevel } =
  storeToRefs(walletStore);

walletStore.fetchWalletUsers();

const editUserAvailable = computed(() =>
  hasAccess([AccessLevel.UpdateUser], currentAccessLevel.value)
);

const deleteUserAvailable = computed(() =>
  hasAccess([AccessLevel.DeleteUser], currentAccessLevel.value)
);

function isCurrentUser(user: UserData) {
  return user.user_id === currentUser.value!.user_id;
}

function getUserAvatar(user: UserData) {
  const [firstProvider] = user.providers;

  return firstProvider.profile_picture_url;
}

async function removeUser(userId: string) {
  await walletStore.deleteWalletUser(userId);
  await walletStore.fetchWalletUsers();
}
</script>

<template>
  <v-list class="mb-3">
    <v-list-subheader>
      {{ t("wallet.sharedForUsersTitle") }}
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
            <v-img alt="avatar" :src="getUserAvatar(user)"></v-img>
          </v-avatar>
        </template>

        <template v-if="!isCurrentUser(user)" #append>
          <UserEditDialog v-if="editUserAvailable" :user="user" />

          <ConfirmDialog
            v-if="deleteUserAvailable"
            :title="t('wallet.removeUserTitle')"
            :message="t('wallet.removeUserMessage')"
            :confirm="() => removeUser(user.user_id)"
          >
            <template #activator="{ props: activatorProps }">
              <v-btn
                v-bind="activatorProps"
                color="error"
                icon="mdi-account-remove"
                variant="text"
              ></v-btn>
            </template>
          </ConfirmDialog>
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
    {{ t("wallet.noUserAdded") }}
  </v-alert>
</template>
