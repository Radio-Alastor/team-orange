import type { Language, Translations } from "../types";
import en from "./en";
import zh from "./zh";
import ms from "./ms";
import ta from "./ta";

export const translations: Record<Language, Translations> = {
  en,
  zh,
  ms,
  ta,
};
