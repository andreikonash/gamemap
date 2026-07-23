<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/components/ui/Icon/index.vue'

defineOptions({ name: 'UiChip' })

const props = withDefaults(defineProps<{
  color?: string
  bg?: string
  text?: string
  icon?: string
  selected?: boolean
}>(), {
  color: undefined,
  bg: undefined,
  text: undefined,
  icon: undefined,
  selected: true
})

const style = computed(() => {
  if (props.bg) {
    return { backgroundColor: props.bg, color: props.text ?? props.bg, borderColor: 'transparent' }
  }
  if (!props.color) return {}
  return props.selected
    ? { backgroundColor: props.color, color: '#FFFFFF', borderColor: props.color }
    : { color: props.color, borderColor: props.color }
})
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-label-sm font-semibold transition-all duration-200"
    :style="style"
  >
    <Icon
      v-if="icon"
      :name="icon"
      :size="14"
    />
    <slot />
  </span>
</template>
