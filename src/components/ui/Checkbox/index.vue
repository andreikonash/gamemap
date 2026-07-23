<script setup lang="ts">
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'
import Icon from '@/components/ui/Icon/index.vue'

defineOptions({ name: 'UiCheckbox' })

withDefaults(defineProps<{
  label?: string
  disabled?: boolean
}>(), {
  label: undefined,
  disabled: false
})

const model = defineModel<boolean>({ default: false })
</script>

<template>
  <CheckboxRoot
    v-model="model"
    :disabled="disabled"
    class="flex items-center gap-2 rounded text-body-sm text-on-surface-variant outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <span
      class="flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors duration-150"
      :class="model ? 'border-primary bg-primary' : 'border-outline-variant bg-surface'"
    >
      <CheckboxIndicator>
        <Icon
          name="check"
          :size="12"
          color="white"
        />
      </CheckboxIndicator>
    </span>
    <span v-if="label || $slots.default"><slot>{{ label }}</slot></span>
  </CheckboxRoot>
</template>
