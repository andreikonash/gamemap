<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/components/ui/Icon/index.vue'

defineOptions({ name: 'UiIconButton' })

const props = withDefaults(defineProps<{
  icon: string
  variant?: 'solid' | 'outline' | 'ghost' | 'danger'
  size?: number
}>(), {
  variant: 'outline',
  size: 44
})

const VARIANT_CLASSES: Record<string, string> = {
  solid: 'bg-secondary text-white border-transparent shadow-sm hover:shadow-md hover:-translate-y-0.5',
  outline: 'bg-white text-text border-border hover:-translate-y-0.5 hover:border-primary hover:text-primary',
  ghost: 'bg-transparent text-text border-transparent hover:bg-bg',
  danger: 'bg-transparent text-error border-transparent hover:bg-error-container hover:text-on-error-container'
}

const classes = computed(() => VARIANT_CLASSES[props.variant])

const style = computed(() => ({ width: `${props.size}px`, height: `${props.size}px` }))
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center justify-center rounded-full border transition-all duration-200 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    :class="classes"
    :style="style"
  >
    <Icon
      :name="icon"
      :size="Math.round(size * 0.5)"
    />
  </button>
</template>
