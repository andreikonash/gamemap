<script setup lang="ts">
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

defineOptions({ name: 'UiRevealOnScroll' })

withDefaults(defineProps<{ delay?: number }>(), {
  delay: 0
})

const target = ref<HTMLElement | null>(null)
const visible = ref(false)

const { stop } = useIntersectionObserver(target, ([entry]) => {
  if (!entry?.isIntersecting) return
  visible.value = true
  stop()
}, { threshold: 0.15 })
</script>

<template>
  <div
    ref="target"
    class="reveal-on-scroll"
    :class="{ 'reveal-on-scroll--visible': visible }"
    :style="{ transitionDelay: `${delay}ms` }"
  >
    <slot />
  </div>
</template>

<style scoped>
.reveal-on-scroll {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal-on-scroll--visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .reveal-on-scroll {
    transition: none;
    opacity: 1;
    transform: none;
  }
}
</style>
