<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useStorage } from '@vueuse/core'
import AvatarPickerModal from '@/components/features/Settings/AvatarPickerModal/index.vue'
import { Avatar, Icon, Tooltip } from '@/components/ui'
import { useAvatarPreset } from '@/composables/useAvatarPreset'
import { auth } from '@/store/auth'
import { booking } from '@/store/booking'
import { getAvatarPreset } from '@/utils/constants/avatarPresets'

defineOptions({ name: 'AppNavSidebar' })

const props = withDefaults(defineProps<{
  sticky?: boolean
}>(), {
  sticky: false
})

const USER_PLAN = {
  ADMIN: 'admin',
  VIP: 'vip',
  FREE: 'free'
} as const

type IUserPlan = typeof USER_PLAN[keyof typeof USER_PLAN]

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = auth()
const bookingStore = booking()
const { avatarPresetId } = useAvatarPreset()
const avatarPreset = computed(() => getAvatarPreset(avatarPresetId.value))

const collapsed = useStorage('gamemap-sidebar-collapsed', false)
const showAvatarModal = ref(false)

const isLoggedIn = computed(() => authStore.isLoggedIn)
const displayName = computed(() =>
  authStore.user?.displayName || authStore.user?.email?.split('@')[0] || t('sidebar.player')
)
const totalGames = computed(() => bookingStore.myRegistrations.length)
const userPlan = computed<IUserPlan>(() => USER_PLAN.FREE)
const planUi = computed(() => {
  const PLAN_UI: Record<IUserPlan, { label: string, icon: string, bg: string, text: string }> = {
    [USER_PLAN.ADMIN]: { label: t('sidebar.plans.admin'), icon: 'shield_person', bg: '#ffdad6', text: '#93000a' },
    [USER_PLAN.VIP]: { label: t('sidebar.plans.vip'), icon: 'workspace_premium', bg: 'var(--color-tertiary-container)', text: 'var(--color-on-tertiary-container)' },
    [USER_PLAN.FREE]: { label: t('sidebar.plans.free'), icon: 'bolt', bg: 'var(--color-surface-container-high)', text: 'var(--color-on-surface-variant)' }
  }
  return PLAN_UI[userPlan.value]
})
const awardsCount = computed(() => 0)

const isDiscoverActive = computed(() => route.name === 'map')
const isMyGamesActive = computed(() => route.name === 'cabinet')
const isSettingsActive = computed(() => route.name === 'settings')

watch(
  () => authStore.userId,
  (userId) => {
    if (!userId) return
    bookingStore.loadMyRegistrations(userId)
  },
  { immediate: true }
)

function goSignIn () {
  router.push({ name: 'auth' })
}

function editAvatar () {
  showAvatarModal.value = true
}

function toggleCollapsed () {
  collapsed.value = !collapsed.value
}

function itemClass (active: boolean) {
  const layout = collapsed.value
    ? 'flex items-center justify-center rounded-2xl px-3 py-3 transition-all duration-200'
    : 'flex items-center gap-md rounded-2xl px-4 py-3 transition-all duration-200 hover:translate-x-0.5'
  const tone = active
    ? 'bg-gradient-to-r from-primary to-primary-container text-white shadow-glow'
    : 'text-on-surface-variant hover:bg-white/60'
  return `${layout} ${tone}`
}

function goDiscover () {
  router.push({ name: 'map' })
}
function goMyGames () {
  router.push({ name: 'cabinet' })
}
function goSettings () {
  router.push({ name: 'settings' })
}
</script>

<template>
  <aside
    class="glass-panel my-4 ml-4 hidden shrink-0 flex-col overflow-hidden rounded-[1.75rem] shadow-lg transition-[width] duration-200 lg:flex"
    :class="[
      collapsed ? 'w-20' : 'w-64',
      props.sticky ? 'sticky top-0 self-start max-h-screen overflow-y-auto' : 'self-stretch'
    ]"
  >
    <div
      class="flex shrink-0 items-center p-sm"
      :class="collapsed ? 'justify-center' : 'justify-end'"
    >
      <button
        type="button"
        class="flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-white/60"
        data-testid="sidebar-collapse-toggle"
        :aria-expanded="!collapsed"
        :aria-label="t('sidebar.toggleSidebar')"
        @click="toggleCollapsed"
      >
        <Icon
          :name="collapsed ? 'chevron_right' : 'chevron_left'"
          :size="20"
        />
      </button>
    </div>

    <div class="mb-xl flex flex-col items-center px-4 text-center">
      <template v-if="isLoggedIn">
        <div class="group relative mb-4">
          <div class="animate-gradient flex rounded-full bg-gradient-to-r from-primary via-tertiary to-accent bg-[length:300%_100%] p-[3px] shadow-glow">
            <Avatar
              :src="avatarPreset.image"
              :size="collapsed ? 40 : 80"
              class="border-[3px] border-surface"
            />
          </div>
          <span
            class="absolute rounded-full border-2 border-surface bg-secondary-fixed"
            :class="collapsed ? 'bottom-0 right-0 h-3 w-3' : 'bottom-1.5 right-1.5 h-4 w-4'"
            aria-hidden="true"
          >
            <span class="absolute inset-0 animate-ping rounded-full bg-secondary-fixed opacity-75" />
          </span>
          <button
            type="button"
            class="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
            :aria-label="t('sidebar.editAvatar')"
            data-testid="avatar-edit-button"
            @click="editAvatar"
          >
            <Icon
              name="edit"
              :size="collapsed ? 16 : 20"
            />
          </button>
        </div>
        <template v-if="!collapsed">
          <h2
            class="text-headline-sm font-bold text-on-surface"
            data-testid="sidebar-profile-name"
          >
            {{ displayName }}
          </h2>
          <p class="mb-md max-w-full truncate text-body-sm text-on-surface-variant">
            {{ authStore.user?.email }}
          </p>
          <div class="grid w-full grid-cols-2 gap-xs">
            <div class="bento-tile flex items-center gap-sm rounded-2xl bg-white/70 px-3 py-2 shadow-sm">
              <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15">
                <Icon
                  name="sports_soccer"
                  :size="16"
                  color="var(--color-primary)"
                />
              </div>
              <div class="min-w-0 flex-1 text-left">
                <p
                  class="truncate text-label-md font-bold leading-tight text-on-surface"
                  data-testid="sidebar-games-count"
                >
                  {{ totalGames }}
                </p>
                <p class="truncate text-[10px] leading-none text-on-surface-variant">
                  {{ t('sidebar.games') }}
                </p>
              </div>
            </div>
            <div class="bento-tile flex items-center gap-sm rounded-2xl bg-white/70 px-3 py-2 shadow-sm">
              <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-tertiary-fixed-dim/15">
                <Icon
                  name="military_tech"
                  :size="16"
                  color="var(--color-tertiary-fixed-dim)"
                />
              </div>
              <div class="min-w-0 flex-1 text-left">
                <p
                  class="truncate text-label-md font-bold leading-tight text-on-surface"
                  data-testid="sidebar-awards-count"
                >
                  {{ awardsCount }}
                </p>
                <p class="truncate text-[10px] leading-none text-on-surface-variant">
                  {{ t('sidebar.awards') }}
                </p>
              </div>
            </div>
          </div>
          <div
            class="bento-tile mt-xs flex w-full items-center gap-sm rounded-2xl px-3 py-2 shadow-sm"
            :style="{ backgroundColor: planUi.bg }"
            data-testid="sidebar-plan-badge"
          >
            <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/40">
              <Icon
                :name="planUi.icon"
                :size="16"
                :color="planUi.text"
              />
            </div>
            <div class="min-w-0 flex-1 text-left">
              <p
                class="truncate text-label-md font-bold leading-tight"
                :style="{ color: planUi.text }"
              >
                {{ planUi.label }}
              </p>
              <p
                class="truncate text-[10px] leading-none"
                :style="{ color: planUi.text }"
              >
                {{ t('sidebar.plan') }}
              </p>
            </div>
          </div>
        </template>
      </template>
      <template v-else>
        <Avatar
          :size="collapsed ? 40 : 80"
          color="var(--color-outline)"
          class="mb-4 border-2 border-outline-variant"
        />
        <template v-if="!collapsed">
          <h2 class="text-headline-sm font-bold text-on-surface">
            {{ t('sidebar.guestTitle') }}
          </h2>
          <p class="mb-2 text-body-sm text-on-surface-variant">
            {{ t('sidebar.guestSubtitle') }}
          </p>
          <button
            type="button"
            class="min-h-[44px] rounded-full bg-gradient-to-r from-primary to-primary-container px-4 py-1.5 text-label-sm text-on-primary shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            data-testid="nav-sidebar-signin"
            @click="goSignIn"
          >
            {{ t('common.signIn') }}
          </button>
        </template>
      </template>
    </div>

    <nav class="flex flex-1 flex-col gap-sm px-lg pb-lg text-label-md">
      <Tooltip
        :text="t('common.discover')"
        :disabled="!collapsed"
      >
        <button
          type="button"
          :class="itemClass(isDiscoverActive)"
          data-testid="nav-discover"
          @click="goDiscover"
        >
          <Icon
            name="explore"
            :size="20"
          /> <span v-if="!collapsed">{{ t('common.discover') }}</span>
        </button>
      </Tooltip>
      <Tooltip
        :text="t('nav.myGames')"
        :disabled="!collapsed"
      >
        <button
          type="button"
          :class="itemClass(isMyGamesActive)"
          data-testid="nav-my-games"
          @click="goMyGames"
        >
          <Icon
            name="sports_soccer"
            :size="20"
          /> <span v-if="!collapsed">{{ t('nav.myGames') }}</span>
        </button>
      </Tooltip>
      <Tooltip
        :text="t('common.settings')"
        :disabled="!collapsed"
      >
        <button
          type="button"
          :class="itemClass(isSettingsActive)"
          data-testid="nav-settings"
          @click="goSettings"
        >
          <Icon
            name="settings"
            :size="20"
          /> <span v-if="!collapsed">{{ t('common.settings') }}</span>
        </button>
      </Tooltip>
    </nav>

    <div
      v-if="!collapsed"
      class="p-lg pt-0"
    >
      <slot name="footer" />
    </div>

    <AvatarPickerModal v-model="showAvatarModal" />
  </aside>
</template>
