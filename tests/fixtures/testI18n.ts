import { createI18n } from 'vue-i18n'
import en from '@/i18n/locales/en.json'

function makeTestI18n () {
  return createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: { en }
  })
}

export { makeTestI18n }
