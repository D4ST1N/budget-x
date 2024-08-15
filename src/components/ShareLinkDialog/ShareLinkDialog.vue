<script setup lang="ts">
import AccessEditor from "@/components/AccessEditor/AccessEditor.vue";
import { useWalletStore } from "@/store/wallets";
import { AccessLevel } from "@/types/AccessLevel";
import { InvitationOptions } from "@/types/Invitation";
import { storeToRefs } from "pinia";
import { ref, Ref } from "vue";
import { useI18n } from "vue-i18n";

enum TimeUnit {
  Hour = "Hour",
  Minute = "Minute",
}

const { t } = useI18n();

const emit = defineEmits(["submit"]);

const walletStore = useWalletStore();
const { currentAccessLevel } = storeToRefs(walletStore);
const expireTime = ref<number>(1);
const expireTimeUnit = ref<TimeUnit>(TimeUnit.Hour);
const activationCount = ref<number>(1);
const selectedAccessLevels = ref<AccessLevel[]>([AccessLevel.View]);

const unitLabels = Object.values(TimeUnit).map((unit) => ({
  label: t(`unit.${unit.toLocaleLowerCase()}`),
  value: unit,
}));

function generateLink(isActive: Ref<boolean>) {
  const unitModifier = expireTimeUnit.value === TimeUnit.Hour ? 60 : 1;
  const expiresIn = expireTime.value * 60 * 1000 * unitModifier;
  const payload: InvitationOptions = {
    accessLevels: selectedAccessLevels.value,
    expiresIn,
    maxUses: activationCount.value,
  };

  emit("submit", payload);
  isActive.value = false;
}
</script>

<template>
  <v-dialog>
    <template #activator="{ props: activatorProps }">
      <v-btn variant="text" v-bind="activatorProps">
        <template #prepend>
          <v-icon>mdi-link-plus</v-icon>
        </template>
        {{ $t("wallet.generateLink") }}
      </v-btn>
    </template>

    <template #default="{ isActive }">
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

        <v-card-actions>
          <v-btn @click="isActive.value = false" color="error">
            {{ $t("ui.cancel") }}
          </v-btn>

          <v-btn
            @click="generateLink(isActive)"
            color="primary"
            variant="elevated"
          >
            {{ $t("wallet.generate") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
