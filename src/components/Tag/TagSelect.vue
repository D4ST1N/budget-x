<script setup lang="ts">
import { required } from "@/helpers/inputValidations";
import { useWalletStore } from "@/store/wallet";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

type TagSelectorProps = {
  tags: string[];
  required?: boolean;
};

const props = withDefaults(defineProps<TagSelectorProps>(), {
  required: true,
});
const emit = defineEmits(["update:tags"]);
const { t } = useI18n();
const walletStore = useWalletStore();

const { tags } = storeToRefs(walletStore);

const requiredField = required();

const tagsOptions = computed(() => tags.value.map((tag) => tag.name));
const rules = computed(() => (props.required ? [requiredField] : []));

const selectedTags = computed({
  get: () => props.tags,
  set: (value) => emit("update:tags", value),
});
</script>

<template>
  <v-combobox
    v-model="selectedTags"
    :items="tagsOptions"
    :label="t('tag.tags')"
    :rules="rules"
    item-title="text"
    item-value="value"
    chips
    closable-chips
    multiple
    hide-details="auto"
    :class="$style.tagSelect"
  ></v-combobox>
</template>

<style lang="scss" module>
.tagSelect {
  :global(.v-chip__close) {
    background-color: transparent;
  }
}
</style>
