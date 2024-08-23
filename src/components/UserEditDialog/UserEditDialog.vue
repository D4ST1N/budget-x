<script setup lang="ts">
import AccessEditor from "@/components/AccessEditor/AccessEditor.vue";
import { useWalletStore } from "@/store/wallet";
import { AccessLevel } from "@/types/AccessLevel";
import { UserData } from "@/types/User";
import { storeToRefs } from "pinia";
import { ref, Ref } from "vue";
import { useI18n } from "vue-i18n";
import CloseButton from "../Base/CloseButton.vue";

const props = defineProps<{
  user: UserData;
}>();

const { t } = useI18n();
const walletStore = useWalletStore();

const { currentAccessLevel } = storeToRefs(walletStore);
const accessLevels = walletStore.getUserAccess(props.user.user_id);
const selectedAccessLevels = ref<AccessLevel[]>([...accessLevels]);

async function confirm(isActive: Ref<boolean>) {
  await walletStore.updateWalletUser(
    props.user.user_id,
    selectedAccessLevels.value
  );
  isActive.value = false;
}
</script>

<template>
  <v-dialog>
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="primary"
        icon="mdi-account-key"
        variant="text"
      ></v-btn>
    </template>

    <template #default="{ isActive }">
      <v-card>
        <v-card-title>{{ t("wallet.editAccess") }}</v-card-title>

        <v-card-text>
          <v-form>
            <v-row>
              <v-col cols="12">
                <v-list-subheader>
                  {{ t("wallet.accessLevels") }}
                </v-list-subheader>

                <v-divider />

                <AccessEditor
                  v-model="selectedAccessLevels"
                  :accessLevels="currentAccessLevel"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn @click="confirm(isActive)" color="primary" variant="elevated">
            {{ t("ui.save") }}
          </v-btn>

          <CloseButton @click="isActive.value = false" />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
