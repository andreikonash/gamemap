<script setup lang="ts">
import { ref } from 'vue'
import { useIntersectionObserver, usePreferredReducedMotion } from '@vueuse/core'

defineOptions({ name: 'UiCountUp' })

const props = withDefaults(defineProps<{
  value: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
}>(), {
  duration: 1400,
  decimals: 0,
  prefix: '',
  suffix: ''
})

const target = ref<HTMLElement | null>(null)
const displayValue = ref(0)
const reducedMotion = usePreferredReducedMotion()

function easeOutQuart (t: number): number {
  return 1 - (1 - t) ** 4
}

function animate (): void {
  if (reducedMotion.value === 'reduce') {
    displayValue.value = props.value
    return
  }

  const startTime = performance.now()

  function step (now: number): void {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    displayValue.value = props.value * easeOutQuart(progress)
    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

const { stop } = useIntersectionObserver(target, ([entry]) => {
  if (!entry?.isIntersecting) return
  animate()
  stop()
}, { threshold: 0.4 })
</script>

<template>
  <span ref="target">{{ prefix }}{{ displayValue.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) }}{{ suffix }}</span>
</template>
