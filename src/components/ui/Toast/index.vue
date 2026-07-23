<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  ToastClose,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastRoot,
  ToastViewport
} from 'reka-ui'
import { useToast } from '@/composables/useToast'
import Icon from '@/components/ui/Icon/index.vue'

defineOptions({ name: 'UiToast' })

const TOAST_DURATION_MS = 3000

const { t } = useI18n()
const { toasts, dismissToast } = useToast()

function openChangeHandle (isOpen: boolean, id: number) {
  if (!isOpen) dismissToast(id)
}
</script>

<template>
  <ToastProvider
    :duration="TOAST_DURATION_MS"
    disable-swipe
  >
    <ToastPortal>
      <ToastViewport class="pointer-events-none fixed inset-x-0 bottom-24 z-50 m-0 flex list-none flex-col items-center gap-2 px-4 md:bottom-8">
        <ToastRoot
          v-for="toast in toasts"
          :key="toast.id"
          class="toast-root pointer-events-auto flex items-center gap-2 rounded-full bg-inverse-surface py-3 pl-4 pr-3 text-sm font-medium text-inverse-on-surface shadow-lg"
          @update:open="(isOpen) => openChangeHandle(isOpen, toast.id)"
        >
          <Icon
            :name="toast.icon"
            :size="18"
            color="var(--color-inverse-on-surface)"
          />
          <ToastDescription class="flex-1">
            {{ toast.text }}
          </ToastDescription>
          <ToastClose
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-inverse-on-surface/70 transition-colors hover:bg-white/10 hover:text-inverse-on-surface"
            :aria-label="t('common.close')"
          >
            <Icon
              name="close"
              :size="14"
            />
          </ToastClose>
        </ToastRoot>
      </ToastViewport>
    </ToastPortal>
  </ToastProvider>
</template>

<style scoped>
.toast-root[data-state='open'] {
  animation: toast-in 0.25s ease;
}

.toast-root[data-state='closed'] {
  animation: toast-out 0.25s ease;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
}

@keyframes toast-out {
  to {
    opacity: 0;
    transform: translateY(12px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .toast-root[data-state='open'],
  .toast-root[data-state='closed'] {
    animation-duration: 0.05s;
  }
}
</style>
