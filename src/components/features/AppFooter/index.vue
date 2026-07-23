<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'AppFooter' })

const { t } = useI18n()

const LINKS = computed(() => [
  { label: t('footer.terms'), to: { name: 'terms' } },
  { label: t('footer.privacy'), to: { name: 'privacy' } },
  { label: t('footer.safety'), to: { name: 'safety' } },
  { label: t('footer.support'), to: { name: 'support' } }
])
</script>

<template>
  <footer class="shrink-0 px-margin-mobile pb-4 md:px-margin-desktop">
    <div class="glass-panel mx-auto flex h-14 w-full max-w-[1920px] items-center justify-between gap-md rounded-full px-lg shadow-sm">
      <div class="flex min-w-0 items-center gap-2 text-label-sm text-on-surface-variant">
        <span class="font-bold text-primary">{{ t('common.brand') }}</span>
        <span class="hidden truncate sm:inline">{{ t('footer.copyright') }}</span>
      </div>
      <nav class="hidden items-center gap-lg text-label-sm text-on-surface-variant md:flex">
        <router-link
          v-for="link in LINKS"
          :key="link.label"
          :to="link.to"
          class="transition-colors hover:text-primary"
        >
          {{ link.label }}
        </router-link>
      </nav>
    </div>
  </footer>
</template>
