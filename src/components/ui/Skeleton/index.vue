<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'UiSkeleton' })

const props = withDefaults(defineProps<{
  width?: string
  height?: string
}>(), {
  width: '100%',
  height: '16px'
})

const style = computed(() => ({ width: props.width, height: props.height }))
</script>

<template>
  <div
    class="ui-skeleton rounded-sm"
    :style="style"
  />
</template>

<style scoped>
.ui-skeleton {
  background: linear-gradient(90deg, var(--color-border) 25%, var(--color-surface-container-high) 50%, var(--color-border) 75%);
  background-size: 200% 100%;
  animation: ui-skeleton-shimmer 1.4s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .ui-skeleton {
    animation: none;
    background: var(--color-border);
  }
}

@keyframes ui-skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
