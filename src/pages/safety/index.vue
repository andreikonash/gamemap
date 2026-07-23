<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import StaticPage from '@/components/features/StaticPage/index.vue'

defineOptions({ name: 'SafetyPage' })

const { t } = useI18n()

const sections = computed(() => [
  { heading: t('legal.safety.sections.meeting.heading'), body: t('legal.safety.sections.meeting.body') },
  { heading: t('legal.safety.sections.reporting.heading'), body: t('legal.safety.sections.reporting.body') },
  { heading: t('legal.safety.sections.venue.heading'), body: t('legal.safety.sections.venue.body') },
  { heading: t('legal.safety.sections.health.heading'), body: t('legal.safety.sections.health.body') },
  { heading: t('legal.safety.sections.emergency.heading'), body: t('legal.safety.sections.emergency.body') }
])
</script>

<template>
  <div class="flex min-h-full w-full flex-col">
    <StaticPage
      :title="t('legal.safety.title')"
      :sections="sections"
    />
  </div>
</template>
