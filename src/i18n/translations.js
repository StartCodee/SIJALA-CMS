import { DEFAULT_LANGUAGE } from "./localeConfig";

const commonDictionaries = {
  id: {},
  en: {},
};

const sharedDictionaries = {
  id: {},
  en: {},
};

export function getCommonDictionary(language) {
  return commonDictionaries[language] || commonDictionaries[DEFAULT_LANGUAGE];
}

export function getPageDictionary(language, pageKey) {
  return {};
}

export function getMergedDictionary(language, pageKey) {
  return {
    ...getCommonDictionary(language),
    ...getPageDictionary(language, pageKey),
    ...(sharedDictionaries[language] || sharedDictionaries[DEFAULT_LANGUAGE]),
  };
}
