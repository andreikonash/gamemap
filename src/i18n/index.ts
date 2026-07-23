import { useStorage } from '@vueuse/core'
import { watch } from 'vue'
import { createI18n } from 'vue-i18n'
import be from '@/i18n/locales/be.json'
import en from '@/i18n/locales/en.json'
import pl from '@/i18n/locales/pl.json'
import ru from '@/i18n/locales/ru.json'
import uk from '@/i18n/locales/uk.json'
import { isSupportedLocale, SUPPORTED_LOCALES } from '@/i18n/localeMeta'
import type { ISupportedLocale } from '@/i18n/localeMeta'

const LOCALE_STORAGE_KEY = 'gamemap-locale'

function detectDefaultLocale (): ISupportedLocale {
  const browserLocales = navigator.languages ?? [navigator.language]
  for (const browserLocale of browserLocales) {
    const shortCode = browserLocale.slice(0, 2).toLowerCase()
    if (isSupportedLocale(shortCode)) return shortCode
  }
  return 'en'
}

function slavicPluralRule (choice: number, choicesLength: number): number {
  if (choicesLength < 3) return choice === 1 ? 0 : 1
  const isTeen = choice > 10 && choice < 20
  const lastDigit = choice % 10
  if (!isTeen && lastDigit === 1) return 0
  if (!isTeen && lastDigit >= 2 && lastDigit <= 4) return 1
  return 2
}

function polishPluralRule (choice: number, choicesLength: number): number {
  if (choicesLength < 3) return choice === 1 ? 0 : 1
  if (choice === 1) return 0
  const isTeen = choice > 10 && choice < 20
  const lastDigit = choice % 10
  if (!isTeen && lastDigit >= 2 && lastDigit <= 4) return 1
  return 2
}

const storedLocale = useStorage<ISupportedLocale>(LOCALE_STORAGE_KEY, detectDefaultLocale())

const i18n = createI18n({
  legacy: false,
  locale: storedLocale.value,
  fallbackLocale: 'en',
  messages: { en, ru, uk, be, pl },
  pluralRules: {
    ru: slavicPluralRule,
    uk: slavicPluralRule,
    be: slavicPluralRule,
    pl: polishPluralRule
  }
})

watch(storedLocale, (value) => {
  i18n.global.locale.value = value
  document.documentElement.lang = value
}, { immediate: true })

function useAppLocale () {
  return storedLocale
}

export { i18n, LOCALE_STORAGE_KEY, SUPPORTED_LOCALES, useAppLocale }
