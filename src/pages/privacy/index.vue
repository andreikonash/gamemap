<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import StaticPage from '@/components/features/StaticPage/index.vue'

defineOptions({ name: 'PrivacyPage' })

const { t } = useI18n()

const sections = computed(() => [
  { heading: t('legal.privacy.sections.collection.heading'), body: t('legal.privacy.sections.collection.body') },
  { heading: t('legal.privacy.sections.usage.heading'), body: t('legal.privacy.sections.usage.body') },
  { heading: t('legal.privacy.sections.sharing.heading'), body: t('legal.privacy.sections.sharing.body') },
  { heading: t('legal.privacy.sections.rights.heading'), body: t('legal.privacy.sections.rights.body') },
  { heading: t('legal.privacy.sections.cookies.heading'), body: t('legal.privacy.sections.cookies.body') }
])
</script>

<template>
  <div class="flex min-h-full w-full flex-col">
    <StaticPage
      :title="t('legal.privacy.title')"
      :sections="sections"
    />
  </div>
</template>
