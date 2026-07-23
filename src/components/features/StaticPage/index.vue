<script setup lang="ts">
defineOptions({ name: 'StaticPage' })

defineProps<{
  title: string
  sections: Array<{ heading: string, body: string }>
}>()
</script>

<template>
  <div class="mx-auto flex w-full max-w-[720px] flex-1 flex-col gap-lg p-margin-mobile md:p-margin-desktop">
    <h1 class="text-headline-lg-mobile text-on-surface md:text-headline-lg">
      {{ title }}
    </h1>
    <div class="flex flex-col gap-lg">
      <section
        v-for="section in sections"
        :key="section.heading"
      >
        <h2 class="mb-xs text-headline-sm text-on-surface">
          {{ section.heading }}
        </h2>
        <p class="text-body-md text-on-surface-variant">
          {{ section.body }}
        </p>
      </section>
    </div>
  </div>
</template>
