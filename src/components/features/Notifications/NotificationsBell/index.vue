<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, reactive, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { Icon } from '@/components/ui'

defineOptions({ name: 'NotificationsBell' })

type INotification = {
  id: number
  icon: string
  titleKey: string
  bodyKey: string
  timeKey: string
}

function seedNotifications (): INotification[] {
  return [
    { id: 1, icon: 'schedule', titleKey: 'notifications.sample1Title', bodyKey: 'notifications.sample1Body', timeKey: 'notifications.time1h' },
    { id: 2, icon: 'payments', titleKey: 'notifications.sample2Title', bodyKey: 'notifications.sample2Body', timeKey: 'notifications.time3h' },
    { id: 3, icon: 'event_available', titleKey: 'notifications.sample3Title', bodyKey: 'notifications.sample3Body', timeKey: 'notifications.timeYesterday' }
  ]
}

const { t } = useI18n()

const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const open = ref(false)
const panelStyle = reactive({ top: '0px', right: '0px' })
const notifications = ref<INotification[]>(seedNotifications())

const hasUnread = computed(() => notifications.value.length > 0)

function updatePanelPosition () {
  const rect = triggerRef.value?.getBoundingClientRect()
  if (!rect) return
  panelStyle.top = `${rect.bottom + 12}px`
  panelStyle.right = `${window.innerWidth - rect.right}px`
}

function openPanel () {
  open.value = true
  nextTick(updatePanelPosition)
  window.addEventListener('scroll', updatePanelPosition, true)
  window.addEventListener('resize', updatePanelPosition)
}

function close () {
  if (!open.value) return
  open.value = false
  window.removeEventListener('scroll', updatePanelPosition, true)
  window.removeEventListener('resize', updatePanelPosition)
}

function toggle () {
  if (open.value) close()
  else openPanel()
}

function dismiss (id: number) {
  notifications.value = notifications.value.filter((item) => item.id !== id)
}

function clearAll () {
  notifications.value = []
}

onClickOutside(rootRef, close, { ignore: [panelRef] })
onBeforeUnmount(() => {
  window.removeEventListener('scroll', updatePanelPosition, true)
  window.removeEventListener('resize', updatePanelPosition)
})
</script>

<template>
  <div
    ref="rootRef"
    class="relative inline-flex"
  >
    <button
      ref="triggerRef"
      type="button"
      class="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-text transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      data-testid="app-bar-notifications"
      aria-haspopup="dialog"
      :aria-expanded="open"
      :aria-label="t('nav.notifications')"
      @click="toggle"
    >
      <Icon
        name="notifications"
        :size="22"
      />
      <span
        v-if="hasUnread"
        class="absolute right-2 top-2 h-2 w-2 rounded-full bg-error ring-2 ring-white"
        aria-hidden="true"
      />
    </button>

    <Teleport to="body">
      <Transition name="notif-pop">
        <div
          v-if="open"
          ref="panelRef"
          role="dialog"
          :aria-label="t('notifications.title')"
          class="glass-panel fixed z-[150] flex w-[22rem] max-w-[calc(100vw-2rem)] flex-col rounded-[1.5rem] border border-white/70 bg-white/95 p-sm shadow-2xl ring-1 ring-black/5 backdrop-blur-2xl"
          :style="panelStyle"
        >
          <div class="flex items-center justify-between px-sm pb-sm pt-xs">
            <h2 class="text-headline-sm text-on-surface">
              {{ t('notifications.title') }}
            </h2>
            <button
              v-if="notifications.length"
              type="button"
              class="rounded-full px-2 py-1 text-label-sm text-primary transition-colors hover:bg-primary/10"
              @click="clearAll"
            >
              {{ t('notifications.clearAll') }}
            </button>
          </div>

          <div
            v-if="notifications.length"
            class="flex max-h-[24rem] flex-col gap-1 overflow-y-auto"
          >
            <div
              v-for="item in notifications"
              :key="item.id"
              class="group flex gap-sm rounded-2xl p-sm transition-colors hover:bg-surface-container-low"
            >
              <div class="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon
                  :name="item.icon"
                  :size="18"
                />
                <span
                  class="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-error ring-2 ring-white"
                  aria-hidden="true"
                />
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-body-sm font-semibold text-on-surface">
                  {{ t(item.titleKey) }}
                </p>
                <p class="text-body-sm text-on-surface-variant">
                  {{ t(item.bodyKey) }}
                </p>
                <p class="mt-0.5 text-label-sm text-on-surface-variant">
                  {{ t(item.timeKey) }}
                </p>
              </div>
              <button
                type="button"
                class="flex h-7 w-7 shrink-0 items-center justify-center self-start rounded-full text-on-surface-variant opacity-0 transition-opacity hover:bg-surface-container-high group-hover:opacity-100"
                :aria-label="t('common.close')"
                @click="dismiss(item.id)"
              >
                <Icon
                  name="close"
                  :size="16"
                />
              </button>
            </div>
          </div>
          <div
            v-else
            class="flex flex-col items-center gap-xs px-md py-lg text-center"
          >
            <Icon
              name="notifications_off"
              :size="28"
              class="text-on-surface-variant"
            />
            <p class="text-body-md text-on-surface">
              {{ t('notifications.empty') }}
            </p>
            <p class="text-body-sm text-on-surface-variant">
              {{ t('notifications.emptyDescription') }}
            </p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.notif-pop-enter-active {
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.notif-pop-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}

.notif-pop-enter-from,
.notif-pop-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(-8px);
}

@media (prefers-reduced-motion: reduce) {
  .notif-pop-enter-active,
  .notif-pop-leave-active {
    transition: opacity 0.1s ease;
  }

  .notif-pop-enter-from,
  .notif-pop-leave-to {
    transform: none;
  }
}
</style>
