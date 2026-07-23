<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import StaticPage from '@/components/features/StaticPage/index.vue'

defineOptions({ name: 'TermsPage' })

const { t } = useI18n()

const sections = computed(() => [
  { heading: t('legal.terms.sections.acceptance.heading'), body: t('legal.terms.sections.acceptance.body') },
  { heading: t('legal.terms.sections.usage.heading'), body: t('legal.terms.sections.usage.body') },
  { heading: t('legal.terms.sections.payments.heading'), body: t('legal.terms.sections.payments.body') },
  { heading: t('legal.terms.sections.account.heading'), body: t('legal.terms.sections.account.body') },
  { heading: t('legal.terms.sections.changes.heading'), body: t('legal.terms.sections.changes.body') }
])
</script>

<template>
  <div class="flex min-h-full w-full flex-col">
    <StaticPage
      :title="t('legal.terms.title')"
      :sections="sections"
    />
  </div>
</template>
