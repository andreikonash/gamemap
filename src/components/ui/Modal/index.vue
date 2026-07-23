<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle
} from 'reka-ui'
import Icon from '@/components/ui/Icon/index.vue'

defineOptions({ name: 'UiModal' })

const { t } = useI18n()

const MODAL_SIZE_CLASS = {
  sm: 'max-w-[24rem]',
  md: 'max-w-[32rem]',
  lg: 'max-w-[40rem]'
} as const

const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  size?: keyof typeof MODAL_SIZE_CLASS
  variant?: 'dialog' | 'alert'
}>(), {
  title: undefined,
  size: 'md',
  variant: 'dialog'
})

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const panelSizeClass = computed(() => MODAL_SIZE_CLASS[props.size])
const isAlert = computed(() => props.variant === 'alert')

function preventAccidentalDismiss (event: Event) {
  if (isAlert.value) event.preventDefault()
}

watch(() => props.modelValue, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <DialogRoot
    :open="modelValue"
    @update:open="emit('update:modelValue', $event)"
  >
    <DialogPortal>
      <DialogOverlay class="modal-overlay fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm" />
      <DialogContent
        :role="isAlert ? 'alertdialog' : 'dialog'"
        class="modal-panel glass-panel fixed left-1/2 top-1/2 z-[200] w-[calc(100%-2rem)] max-h-[85vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[1.75rem] border border-white/70 bg-white/95 p-lg shadow-2xl ring-1 ring-black/5 backdrop-blur-2xl"
        :class="panelSizeClass"
        @escape-key-down="preventAccidentalDismiss"
        @pointer-down-outside="preventAccidentalDismiss"
        @interact-outside="preventAccidentalDismiss"
      >
        <div class="mb-md flex items-start justify-between gap-md">
          <DialogTitle
            v-if="title"
            class="text-headline-sm text-on-surface"
          >
            {{ title }}
          </DialogTitle>
          <DialogClose
            class="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high"
            :aria-label="t('common.close')"
          >
            <Icon
              name="close"
              :size="20"
            />
          </DialogClose>
        </div>

        <div>
          <slot />
        </div>

        <div
          v-if="$slots.footer"
          class="mt-lg flex flex-col-reverse gap-sm border-t border-outline-variant pt-lg sm:flex-row sm:justify-end"
        >
          <slot name="footer" />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.modal-overlay[data-state='open'] {
  animation: modal-fade-in 0.2s ease;
}

.modal-overlay[data-state='closed'] {
  animation: modal-fade-out 0.2s ease;
}

.modal-panel[data-state='open'] {
  animation: modal-pop-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-panel[data-state='closed'] {
  animation: modal-pop-out 0.15s ease;
}

@keyframes modal-fade-in {
  from {
    opacity: 0;
  }
}

@keyframes modal-fade-out {
  to {
    opacity: 0;
  }
}

@keyframes modal-pop-in {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95) translateY(8px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes modal-pop-out {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95) translateY(8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .modal-overlay[data-state='open'],
  .modal-overlay[data-state='closed'],
  .modal-panel[data-state='open'],
  .modal-panel[data-state='closed'] {
    animation-duration: 0.05s;
  }
}
</style>
