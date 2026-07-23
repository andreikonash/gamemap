<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useEventListener } from '@vueuse/core'

defineOptions({ name: 'UiScrollProgress' })

defineProps<{ label: string }>()

const barRef = ref<HTMLElement | null>(null)
const progress = ref(0)
let scrollTarget: HTMLElement | Window = window

function findScrollParent (element: HTMLElement | null): HTMLElement | Window {
  let node = element
  while (node) {
    const overflowY = getComputedStyle(node).overflowY
    if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight) return node
    node = node.parentElement
  }
  return window
}

function updateProgress (): void {
  if (scrollTarget instanceof Window) {
    const max = document.documentElement.scrollHeight - window.innerHeight
    progress.value = max > 0 ? Math.min(window.scrollY / max, 1) * 100 : 0
    return
  }
  const max = scrollTarget.scrollHeight - scrollTarget.clientHeight
  progress.value = max > 0 ? Math.min(scrollTarget.scrollTop / max, 1) * 100 : 0
}

onMounted(() => {
  scrollTarget = findScrollParent(barRef.value?.parentElement ?? null)
  useEventListener(scrollTarget, 'scroll', updateProgress, { passive: true })
  useEventListener(window, 'resize', updateProgress)
  updateProgress()
})
</script>

<template>
  <div
    ref="barRef"
    class="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
    role="progressbar"
    :aria-valuenow="Math.round(progress)"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="label"
  >
    <div
      class="h-full bg-gradient-to-r from-primary via-tertiary to-accent transition-[width] duration-150 ease-out"
      :style="{ width: `${progress}%` }"
    />
  </div>
</template>
