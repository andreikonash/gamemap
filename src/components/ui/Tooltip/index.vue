<script setup lang="ts">
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger
} from 'reka-ui'

defineOptions({ name: 'UiTooltip' })

withDefaults(defineProps<{
  text: string
  disabled?: boolean
}>(), {
  disabled: false
})
</script>

<template>
  <TooltipProvider :delay-duration="300">
    <TooltipRoot :disabled="disabled">
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          class="tooltip-content z-[220] rounded-lg bg-surface-container-highest px-3 py-1.5 text-label-sm text-on-surface shadow-lg"
          :side-offset="8"
        >
          {{ text }}
          <TooltipArrow class="fill-surface-container-highest" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>

<style scoped>
.tooltip-content[data-state='delayed-open'],
.tooltip-content[data-state='instant-open'] {
  animation: tooltip-fade-in 0.15s ease;
}

.tooltip-content[data-state='closed'] {
  animation: tooltip-fade-out 0.1s ease;
}

@keyframes tooltip-fade-in {
  from {
    opacity: 0;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes tooltip-fade-out {
  to {
    opacity: 0;
  }
}
</style>
