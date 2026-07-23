<script setup lang="ts">
defineOptions({ name: 'UiEmptyState' })

withDefaults(defineProps<{
  icon?: string
  title: string
  description?: string
}>(), {
  icon: 'search_off',
  description: undefined
})
</script>

<template>
  <div class="flex flex-col items-center gap-sm px-md py-2xl text-center">
    <div class="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-fixed/60 to-accent-container">
      <span
        class="material-symbols-outlined text-primary"
        style="font-size: 32px"
      >{{ icon }}</span>
    </div>
    <h3 class="text-headline-sm text-on-surface">
      {{ title }}
    </h3>
    <p
      v-if="description"
      class="max-w-[280px] text-body-sm text-on-surface-variant"
    >
      {{ description }}
    </p>
    <slot />
  </div>
</template>
