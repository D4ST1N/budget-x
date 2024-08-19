<script setup lang="ts">
import AccessEditor from "@/components/AccessEditor/AccessEditor.vue";
import { useNotificationStore } from "@/store/notification";
import { useWalletStore } from "@/store/wallets";
import { AccessLevel } from "@/types/AccessLevel";
import { InvitationOptions } from "@/types/Invitation";
import { NotificationType } from "@/types/Notification";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

enum TimeUnit {
  Hour = "Hour",
  Minute = "Minute",
}

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["update:isOpen"]);

const { t } = useI18n();

const notificationStore = useNotificationStore();
const walletStore = useWalletStore();
const { currentAccessLevel } = storeToRefs(walletStore);
const expireTime = ref<number>(1);
const expireTimeUnit = ref<TimeUnit>(TimeUnit.Hour);
const activationCount = ref<number>(1);
const selectedAccessLevels = ref<AccessLevel[]>([AccessLevel.View]);
const shareLink = ref<string>("");

const unitLabels = Object.values(TimeUnit).map((unit) => ({
  label: t(`unit.${unit.toLocaleLowerCase()}`),
  value: unit,
}));

const showDialog = computed({
  get: () => props.isOpen,
  set: (value) => emit("update:isOpen", value),
});

async function generateLink() {
  const unitModifier = expireTimeUnit.value === TimeUnit.Hour ? 60 : 1;
  const expiresIn = expireTime.value * 60 * 1000 * unitModifier;
  const payload: InvitationOptions = {
    accessLevels: selectedAccessLevels.value,
    expiresIn,
    maxUses: activationCount.value,
  };

  const token = await walletStore.shareWallet(payload);

  if (token) {
    const baseAppUrl = new URL(import.meta.env.BASE_URL, import.meta.url).href;
    shareLink.value = `${baseAppUrl}wallet/join/${token}`;
  }
}

async function copyClick() {
  try {
    await navigator.clipboard.writeText(shareLink.value);

    notificationStore.add({
      text: t("notification.textCopied"),
      type: NotificationType.Success,
    });
  } catch (error) {
    notificationStore.add({
      text: t("notification.textCopyFailed"),
      type: NotificationType.Error,
    });
  }
}
</script>

<template>
  <v-dialog v-model="showDialog">
    <template #default>
      <v-card>
        <v-card-title>{{ $t("wallet.generateLinkTitle") }}</v-card-title>

        <v-card-text>
          <v-form>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="expireTime"
                  :label="$t('wallet.expireTime')"
                  type="number"
                  min="1"
                  max="999"
                  hide-details
                  density="comfortable"
                />
              </v-col>

              <v-col cols="6">
                <v-select
                  v-model="expireTimeUnit"
                  :items="unitLabels"
                  :label="$t('wallet.expireTimeUnit')"
                  item-title="label"
                  item-value="value"
                  hide-details
                  density="comfortable"
                />
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model="activationCount"
                  :label="$t('wallet.activationCount')"
                  type="number"
                  min="1"
                  max="10"
                  hide-details
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12">
                <v-list-subheader>
                  {{ $t("wallet.accessLevels") }}
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

        <div v-if="shareLink" :class="$style.fieldWrapper">
          <v-text-field
            :value="shareLink"
            density="compact"
            variant="solo"
            append-icon="mdi-content-copy"
            readonly
            @click:append="copyClick"
          ></v-text-field>
        </div>

        <v-card-actions>
          <v-btn @click="showDialog = false" color="error">
            {{ $t("ui.cancel") }}
          </v-btn>

          <v-btn @click="generateLink()" color="primary" variant="elevated">
            {{ $t("wallet.generate") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<style lang="scss" module>
.fieldWrapper {
  padding: 0 8px;
  margin-top: 8px;

  :global(.v-field) {
    background-color: #52474b;
  }
}
</style>
