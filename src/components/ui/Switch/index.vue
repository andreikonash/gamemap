<script setup lang="ts">
defineOptions({ name: 'UiSwitch' })

withDefaults(defineProps<{
  disabled?: boolean
}>(), {
  disabled: false
})

const model = defineModel<boolean>({ default: false })

function toggle () {
  if (model.value === undefined) return
  model.value = !model.value
}
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="model"
    :disabled="disabled"
    class="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    :class="model ? 'bg-gradient-to-r from-primary to-primary-container shadow-glow' : 'bg-border'"
    @click="toggle"
  >
    <span
      class="inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200"
      :class="model ? 'translate-x-6' : 'translate-x-1'"
    />
  </button>
</template>
