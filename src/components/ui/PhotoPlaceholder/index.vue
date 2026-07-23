<script setup lang="ts">
withDefaults(defineProps<{
  icon?: string
  gradientClass?: string
  iconColorClass?: string
}>(), {
  icon: 'sports_soccer',
  gradientClass: 'bg-gradient-to-br from-primary-fixed/40 to-accent-container/60',
  iconColorClass: 'text-primary/60'
})
</script>

<template>
  <div
    class="flex h-full w-full items-center justify-center"
    :class="gradientClass"
  >
    <span
      class="material-symbols-outlined"
      :class="iconColorClass"
      style="font-size: 40px"
    >{{ icon }}</span>
  </div>
</template>
