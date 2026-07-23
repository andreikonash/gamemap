<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import StaticPage from '@/components/features/StaticPage/index.vue'

defineOptions({ name: 'SupportPage' })

const { t } = useI18n()

const sections = computed(() => [
  { heading: t('legal.support.sections.gettingStarted.heading'), body: t('legal.support.sections.gettingStarted.body') },
  { heading: t('legal.support.sections.payments.heading'), body: t('legal.support.sections.payments.body') },
  { heading: t('legal.support.sections.account.heading'), body: t('legal.support.sections.account.body') },
  { heading: t('legal.support.sections.contact.heading'), body: t('legal.support.sections.contact.body') },
  { heading: t('legal.support.sections.reportProblem.heading'), body: t('legal.support.sections.reportProblem.body') }
])
</script>

<template>
  <div class="flex min-h-full w-full flex-col">
    <StaticPage
      :title="t('legal.support.title')"
      :sections="sections"
    />
  </div>
</template>
