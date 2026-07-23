<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/components/ui/Icon/index.vue'

defineOptions({ name: 'UiButton' })

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
}>(), {
  variant: 'primary',
  loading: false,
  disabled: false,
  type: 'button'
})

const VARIANT_CLASSES: Record<string, string> = {
  primary: 'bg-gradient-to-r from-primary to-primary-container text-white shadow-glow border border-transparent hover:-translate-y-0.5 hover:shadow-lg',
  secondary: 'bg-secondary text-white border border-transparent hover:-translate-y-0.5 hover:bg-secondary/90',
  accent: 'bg-gradient-to-r from-tertiary to-accent text-white shadow-glow-accent border border-transparent hover:-translate-y-0.5 hover:shadow-lg',
  outline: 'bg-white text-text border border-border hover:-translate-y-0.5 hover:border-primary hover:text-primary',
  ghost: 'bg-transparent text-text border border-transparent hover:bg-border/40',
  danger: 'bg-transparent text-error border border-transparent hover:bg-error-container'
}

const classes = computed(() => VARIANT_CLASSES[props.variant])
</script>

<template>
  <button
    :type="type"
    class="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
    :class="classes"
    :disabled="disabled || loading"
  >
    <Icon
      v-if="loading"
      name="progress_activity"
      :size="18"
      class="animate-spin"
    />
    <slot />
  </button>
</template>
