<script setup lang="ts">
import i18n from "@/plugins/i18n";
import { useLanguageStore } from "@/store/language";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const languageStore = useLanguageStore();
const { t, availableLocales, locale } = useI18n();

const languageOptions = computed(() => {
  return availableLocales.map((locale) => {
    return {
      value: locale,
      title: t("languageName", 1, { locale }),
    };
  });
});

function getFlagUrl(locale: string) {
  // Dynamic urls for public assets should be handled this way
  // Note: Since base option for URL specified in Vite config
  // I have to add import.meta.env.BASE_URL to the public asset url
  return new URL(
    `${import.meta.env.BASE_URL}img/flags/${locale}.png`,
    import.meta.url
  ).href;
}

function updateLanguage(locale: string) {
  languageStore.changeLanguage(locale as typeof i18n.global.locale.value);
}
</script>

<template>
  <v-select
    :model-value="locale"
    :items="languageOptions"
    hide-details
    @update:model-value="updateLanguage"
  >
    <template #prepend-inner>
      <img :src="getFlagUrl(locale)" :alt="locale" :class="$style.flagMain" />
    </template>
    <template #item="{ props, item }">
      <v-list-item v-bind="props">
        <template #prepend>
          <img
            :src="getFlagUrl(item.value)"
            :alt="item.value"
            :class="$style.flag"
          />
        </template>
      </v-list-item>
    </template>
  </v-select>
</template>

<style lang="scss" module>
.flag {
  margin-right: 24px;
}
.flagMain {
  margin-right: 16px;
}
</style>
