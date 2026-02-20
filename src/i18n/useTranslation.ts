"use client";

import { useLocaleContext } from "./LocaleProvider";

export function useTranslation() {
  const { dictionary } = useLocaleContext();
  return dictionary;
}

export function useLocale() {
  const { locale } = useLocaleContext();
  return locale;
}
