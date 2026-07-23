<script setup lang="ts">
import { computed, useId } from 'vue'
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport
} from 'reka-ui'
import Icon from '@/components/ui/Icon/index.vue'

defineOptions({ name: 'UiSelect', inheritAttrs: false })

const props = withDefaults(defineProps<{
  label?: string
  options: Array<{ value: string, label: string, badge?: string }>
  disabled?: boolean
}>(), {
  label: undefined,
  disabled: false
})

const model = defineModel<string>({ default: '' })

const EMPTY_VALUE_SENTINEL = '__empty__'

function toInternalValue (value: string): string {
  return value === '' ? EMPTY_VALUE_SENTINEL : value
}

function fromInternalValue (value: string): string {
  return value === EMPTY_VALUE_SENTINEL ? '' : value
}

const internalModel = computed<string>({
  get: () => toInternalValue(model.value),
  set: (value) => { model.value = fromInternalValue(value) }
})

const id = useId()
const selectedOption = computed(() => props.options.find((option) => option.value === model.value))
</script>

<template>
  <div class="block">
    <span
      v-if="label"
      :id="`${id}-label`"
      class="mb-1.5 block text-sm font-medium text-text"
    >{{ label }}</span>

    <SelectRoot
      v-model="internalModel"
      :disabled="disabled"
    >
      <SelectTrigger
        :id="id"
        v-bind="$attrs"
        :aria-labelledby="label ? `${id}-label` : undefined"
        class="group flex w-full items-center justify-between gap-2 rounded-full border-2 border-border bg-white py-2.5 pl-4 pr-3 text-sm font-medium text-text shadow-sm outline-none transition-all duration-200 hover:border-primary/50 hover:shadow-md focus-visible:ring-4 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:bg-surface-container-low disabled:text-text-muted data-[state=open]:border-primary data-[state=open]:shadow-glow"
      >
        <SelectValue as-child>
          <span class="flex min-w-0 items-center gap-2">
            <span class="truncate font-semibold">{{ selectedOption?.label }}</span>
            <span
              v-if="selectedOption?.badge"
              class="shrink-0 rounded-full bg-gradient-to-r from-primary to-primary-container px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm"
            >{{ selectedOption.badge }}</span>
          </span>
        </SelectValue>
        <SelectIcon as-child>
          <Icon
            name="expand_more"
            :size="20"
            class="shrink-0 text-primary transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-data-[state=open]:rotate-180"
          />
        </SelectIcon>
      </SelectTrigger>

      <SelectPortal>
        <SelectContent
          position="popper"
          :side-offset="8"
          class="select-content glass-panel z-[210] max-h-72 overflow-hidden rounded-[1.25rem] border border-white/70 bg-white/95 shadow-2xl ring-1 ring-black/5 backdrop-blur-2xl"
          style="width: var(--reka-select-trigger-width)"
        >
          <SelectViewport class="flex flex-col gap-1 p-2">
            <SelectItem
              v-for="option in options"
              :key="option.value"
              :value="toInternalValue(option.value)"
              class="group flex min-h-[42px] cursor-pointer select-none items-center justify-between gap-2 truncate rounded-2xl px-3.5 py-2 text-sm text-text outline-none transition-all duration-150 data-[highlighted]:translate-x-0.5 data-[highlighted]:bg-surface-container-high data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-primary-container data-[state=checked]:font-semibold data-[state=checked]:text-white data-[state=checked]:shadow-glow"
            >
              <SelectItemText class="truncate">
                {{ option.label }}
              </SelectItemText>
              <span class="flex shrink-0 items-center gap-2">
                <span
                  v-if="option.badge"
                  class="rounded-full bg-surface-container-high px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-on-surface-variant group-data-[state=checked]:bg-white/20 group-data-[state=checked]:text-white"
                >{{ option.badge }}</span>
                <SelectItemIndicator>
                  <Icon
                    name="check"
                    :size="18"
                  />
                </SelectItemIndicator>
              </span>
            </SelectItem>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  </div>
</template>

<style scoped>
.select-content {
  transform-origin: var(--reka-select-content-transform-origin);
}

.select-content[data-state='open'] {
  animation: select-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.select-content[data-state='closed'] {
  animation: select-out 0.12s ease;
}

@keyframes select-in {
  from {
    opacity: 0;
    transform: scale(0.94) translateY(-8px);
  }
}

@keyframes select-out {
  to {
    opacity: 0;
    transform: scale(0.94) translateY(-8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .select-content[data-state='open'],
  .select-content[data-state='closed'] {
    animation-duration: 0.05s;
  }
}
</style>
