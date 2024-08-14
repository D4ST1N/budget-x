import i18n from "@/plugins/i18n";
import { defineStore } from "pinia";
import { ref, WritableComputedRef } from "vue";
import { useI18n } from "vue-i18n";

export const useLanguageStore = defineStore(
  "language",
  () => {
    const { availableLocales } = useI18n();

    const currentLanguage = ref<string>("ua") as WritableComputedRef<string>;

    function changeLanguage(newLanguage: typeof i18n.global.locale.value) {
      if (!availableLocales.includes(String(newLanguage))) return;

      currentLanguage.value = newLanguage;
      i18n.global.locale.value = newLanguage;
    }

    return {
      currentLanguage,
      changeLanguage,
    };
  },
  {
    persist: {
      paths: ["currentLanguage"],
      afterRestore: ({ store }) => {
        store.changeLanguage(store.currentLanguage);
      },
    },
  }
);
