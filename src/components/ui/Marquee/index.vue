<script setup lang="ts">
defineOptions({ name: 'UiMarquee' })

withDefaults(defineProps<{
  reverse?: boolean
  pauseOnHover?: boolean
  repeat?: number
  duration?: number
  gap?: string
}>(), {
  reverse: false,
  pauseOnHover: true,
  repeat: 2,
  duration: 30,
  gap: '1rem'
})
</script>

<template>
  <div
    class="group flex overflow-hidden"
    :style="{ '--duration': `${duration}s`, '--gap': gap, gap }"
  >
    <div
      v-for="n in repeat"
      :key="n"
      class="flex shrink-0"
      :class="[
        'animate-marquee',
        { 'group-hover:[animation-play-state:paused]': pauseOnHover, '[animation-direction:reverse]': reverse }
      ]"
      :style="{ gap }"
    >
      <slot />
    </div>
  </div>
</template>
