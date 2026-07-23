<script setup lang="ts">
defineOptions({ name: 'UiInput' })

withDefaults(defineProps<{
  label?: string
  type?: string
  placeholder?: string
  icon?: string
  error?: string
  autocomplete?: string
  disabled?: boolean
}>(), {
  label: undefined,
  type: 'text',
  placeholder: undefined,
  icon: undefined,
  error: undefined,
  autocomplete: undefined,
  disabled: false
})

const model = defineModel<string>({ default: '' })
</script>

<template>
  <label class="block">
    <span
      v-if="label"
      class="mb-1 block text-sm font-medium text-text"
    >{{ label }}</span>
    <span class="relative flex items-center">
      <span
        v-if="icon"
        class="material-symbols-outlined pointer-events-none absolute left-3 text-text-muted"
        style="font-size: 18px"
      >{{ icon }}</span>
      <input
        v-model="model"
        :type="type"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :disabled="disabled"
        class="w-full rounded-lg border border-border bg-white py-2.5 text-sm text-text shadow-sm outline-none transition-all duration-200 placeholder:text-text-muted focus:border-primary focus:shadow-glow focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-surface-container-low disabled:text-text-muted"
        :class="icon ? 'pl-10 pr-3' : 'px-3'"
      >
    </span>
    <span
      v-if="error"
      class="mt-1 block text-sm text-red-600"
    >{{ error }}</span>
  </label>
</template>
