import { useI18n } from "vue-i18n";

export const required = (errorMessage?: string) => {
  const i18n = useI18n();

  return (value: string) => {
    return !!value || errorMessage || i18n.t("validation.fieldIsRequired");
  };
};

export const minValue = (min: number, errorMessage?: string) => {
  const i18n = useI18n();

  return (value: number) => {
    return (
      value >= min || errorMessage || i18n.t("validation.minValue", { min })
    );
  };
};

export const maxValue = (max: number, errorMessage?: string) => {
  const i18n = useI18n();

  return (value: number) => {
    return (
      value <= max || errorMessage || i18n.t("validation.maxValue", { max })
    );
  };
};
