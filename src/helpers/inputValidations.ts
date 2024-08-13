import { useI18n } from "vue-i18n";

export const required = (errorMessage?: string) => {
  const i18n = useI18n();

  return (value: string) => {
    return !!value || errorMessage || i18n.t("validation.fieldIsRequired");
  };
};
