import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import { i18n } from '@/i18n'
import { router } from '@/router'
import '@/styles/main.css'

const SITE_ACCESS_SESSION_KEY = 'gamemap_preview_access'

function hasPreviewAccess (): boolean {
  const sitePassword = import.meta.env.VITE_SITE_PASSWORD
  if (!import.meta.env.PROD || !sitePassword) return true
  if (sessionStorage.getItem(SITE_ACCESS_SESSION_KEY) === 'granted') return true

  const entered = window.prompt('This site is in private preview. Enter the access password:')
  if (entered !== sitePassword) return false

  sessionStorage.setItem(SITE_ACCESS_SESSION_KEY, 'granted')
  return true
}

if (hasPreviewAccess()) {
  createApp(App)
    .use(createPinia())
    .use(router)
    .use(i18n)
    .mount('#app')
} else {
  document.body.innerHTML = '<p style="font-family: sans-serif; text-align: center; margin-top: 20vh;">Access restricted.</p>'
}
