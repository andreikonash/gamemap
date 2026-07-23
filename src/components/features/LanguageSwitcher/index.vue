<script setup lang="ts">
import { computed } from 'vue'
import { Select } from '@/components/ui'
import { isSupportedLocale, LOCALE_META } from '@/i18n/localeMeta'
import { SUPPORTED_LOCALES, useAppLocale } from '@/i18n'

defineOptions({ name: 'LanguageSwitcher' })

const locale = useAppLocale()

const options = SUPPORTED_LOCALES.map((code) => ({ value: code, label: LOCALE_META[code].label, badge: code.toUpperCase() }))

const model = computed({
  get: () => locale.value,
  set: (value) => {
    if (isSupportedLocale(value)) locale.value = value
  }
})
</script>

<template>
  <Select
    v-model="model"
    :options="options"
    aria-label="Language"
    class="min-w-[10.5rem]"
  />
</template>
