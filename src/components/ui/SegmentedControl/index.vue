<script setup lang="ts">
import { computed } from 'vue'
import { ToggleGroupItem, ToggleGroupRoot } from 'reka-ui'

defineOptions({ name: 'UiSegmentedControl' })

defineProps<{
  options: Array<{ value: string, label: string }>
}>()

const model = defineModel<string>({ required: true })

// ToggleGroup's single mode deselects (emits undefined) when clicking the active
// item again — a segmented control must always keep exactly one option selected.
const singleSelectValue = computed<string>({
  get: () => model.value,
  set: (value) => {
    if (value) model.value = value
  }
})
</script>

<template>
  <ToggleGroupRoot
    v-model="singleSelectValue"
    type="single"
    class="inline-flex rounded-full bg-surface-container-low p-1"
  >
    <ToggleGroupItem
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      class="segmented-item min-h-[36px] rounded-full px-4 text-label-md font-semibold text-on-surface-variant outline-none transition-all duration-200 hover:text-on-surface"
    >
      {{ option.label }}
    </ToggleGroupItem>
  </ToggleGroupRoot>
</template>

<style scoped>
.segmented-item[data-state='on'] {
  background-image: linear-gradient(to right, var(--color-primary), var(--color-primary-container));
  color: white;
  box-shadow: var(--shadow-glow);
}
</style>
