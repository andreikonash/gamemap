const SUPPORTED_LOCALES = ['en', 'ru', 'uk', 'be', 'pl'] as const

type ISupportedLocale = typeof SUPPORTED_LOCALES[number]

type ILocaleMeta = {
  label: string
  bcp47Tag: string
}

const LOCALE_META: Record<ISupportedLocale, ILocaleMeta> = {
  en: { label: 'English', bcp47Tag: 'en-US' },
  ru: { label: 'Русский', bcp47Tag: 'ru-RU' },
  uk: { label: 'Українська', bcp47Tag: 'uk-UA' },
  be: { label: 'Беларуская', bcp47Tag: 'be-BY' },
  pl: { label: 'Polski', bcp47Tag: 'pl-PL' }
}

function isSupportedLocale (value: string): value is ISupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

export { SUPPORTED_LOCALES, LOCALE_META, isSupportedLocale }
export type { ISupportedLocale }
