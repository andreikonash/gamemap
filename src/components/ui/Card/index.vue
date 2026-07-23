<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'UiCard' })

const props = withDefaults(defineProps<{
  accentColor?: string
  tint?: boolean
  clickable?: boolean
}>(), {
  accentColor: undefined,
  tint: false,
  clickable: false
})

const style = computed(() => {
  if (!props.accentColor) return {}
  return {
    borderInlineStart: `6px solid ${props.accentColor}`,
    backgroundColor: props.tint
      ? `color-mix(in srgb, ${props.accentColor} 8%, white)`
      : undefined
  }
})
</script>

<template>
  <div
    class="rounded-lg border border-border bg-white shadow-sm"
    :class="clickable ? 'cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg' : ''"
    :style="style"
  >
    <slot />
  </div>
</template>
