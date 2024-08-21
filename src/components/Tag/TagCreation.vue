<script setup lang="ts">
import { required } from "@/helpers/inputValidations";
import { useWalletStore } from "@/store/wallet";
import { Tag, TagData } from "@/types/Tag";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { VForm } from "vuetify/components";

export interface TagCreationProps {
  tag?: Tag;
}

const props = defineProps<TagCreationProps>();

const emit = defineEmits(["update:tag"]);

const { t } = useI18n();

const walletStore = useWalletStore();
const tagName = ref<string>(props.tag?.name || "");
const valid = ref<boolean>(false);
const requiredField = required();

const form = ref<typeof VForm | null>(null);

async function createTag() {
  const payload: TagData = {
    name: tagName.value,
  };
  let success: boolean;

  if (props.tag) {
    success = await walletStore.updateTag(payload, props.tag._id);
  } else {
    success = await walletStore.createTag(payload);
  }

  if (success && props.tag) {
    emit("update:tag");

    return;
  }

  if (success && form.value) {
    form.value.reset();
    form.value.resetValidation();
  }
}
</script>

<template>
  <v-card-text>
    <v-form ref="form" v-model="valid" @submit.prevent="createTag">
      <v-text-field
        v-model="tagName"
        :label="t('tag.tagName')"
        hide-details="auto"
        :rules="[requiredField]"
      ></v-text-field>

      <br />

      <div :class="$style.actions">
        <v-btn
          :disabled="!valid"
          type="submit"
          variant="elevated"
          color="primary"
        >
          {{ t("ui.save") }}
        </v-btn>

        <slot name="actions" />
      </div>
    </v-form>
  </v-card-text>
</template>

<style lang="scss" module>
.actions {
  display: flex;
  justify-content: space-between;
}
</style>
