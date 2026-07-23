<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/components/ui/Icon/index.vue'

defineOptions({ name: 'UiAvatar' })

const props = withDefaults(defineProps<{
  label?: string
  icon?: string
  size?: number
  color?: string
  src?: string
}>(), {
  label: undefined,
  icon: 'person',
  size: 40,
  color: undefined,
  src: undefined
})

const initials = computed(() => {
  if (!props.label) return ''
  return props.label
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
})

const style = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  backgroundColor: props.color ?? 'var(--color-primary)'
}))
</script>

<template>
  <div
    class="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-white shadow-sm ring-2 ring-white"
    :style="style"
  >
    <img
      v-if="src"
      :src="src"
      :alt="label"
      class="h-full w-full object-cover"
    >
    <span
      v-else-if="initials"
      :style="{ fontSize: `${size * 0.4}px` }"
    >{{ initials }}</span>
    <Icon
      v-else
      :name="icon"
      :size="Math.round(size * 0.55)"
      color="white"
    />
  </div>
</template>
