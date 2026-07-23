<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import AppFooter from '@/components/features/AppFooter/index.vue'
import NotificationsBell from '@/components/features/Notifications/NotificationsBell/index.vue'
import { Icon, IconButton, Toast } from '@/components/ui'
import { useMobile } from '@/composables/useMobile'
import { auth } from '@/store/auth'
import { games } from '@/store/games'

defineOptions({ name: 'AppRoot' })

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const authStore = auth()
const gamesStore = games()
const mobile = useMobile()

const isLoggedIn = computed(() => authStore.isLoggedIn)
const isMapRoute = computed(() => route.name === 'map')
const isCommunitiesRoute = computed(() => route.name === 'communities')
const showChrome = computed(() => !route.meta.hideChrome)
const isAuthRoute = computed(() => route.name === 'auth')

const headerClass = computed(() => isAuthRoute.value
  ? 'fixed inset-x-0 top-0 z-40 hidden px-margin-desktop pt-4 md:block'
  : 'hidden shrink-0 px-margin-desktop pt-4 md:block')
const mainClass = computed(() => isAuthRoute.value
  ? 'absolute inset-0 h-full w-full overflow-y-auto'
  : 'min-h-0 flex-1 overflow-y-auto')
const bottomNavClass = computed(() => isAuthRoute.value
  ? 'pointer-events-none fixed inset-x-0 bottom-0 z-40 px-md pb-4'
  : 'shrink-0 px-md pb-4')
const footerClass = computed(() => isAuthRoute.value
  ? 'fixed inset-x-0 bottom-0 z-40 hidden md:block'
  : 'hidden shrink-0 md:block')

const SIGN_IN_CTA_HIDDEN_ROUTES = ['auth', 'map']
const showSignInCta = computed(() => typeof route.name === 'string' && !SIGN_IN_CTA_HIDDEN_ROUTES.includes(route.name))

const GUEST_NAV_KEYS = ['map', 'communities', 'signin']
const AUTHED_NAV_KEYS = ['map', 'communities', 'cabinet', 'history', 'settings']

const visibleNavKeys = computed(() => (isLoggedIn.value ? AUTHED_NAV_KEYS : GUEST_NAV_KEYS))
const activeNavKey = computed(() => {
  if (route.name === 'cabinet') return route.query.tab === 'past' ? 'history' : 'cabinet'
  if (route.name === 'auth') return 'signin'
  return typeof route.name === 'string' ? route.name : null
})
const navGlowStyle = computed(() => {
  const index = visibleNavKeys.value.indexOf(activeNavKey.value ?? '')
  if (index === -1) return { opacity: '0' }
  const percent = ((index + 0.5) / visibleNavKeys.value.length) * 100
  return { left: `${percent}%`, opacity: '1' }
})

const searchQuery = computed({
  get: () => gamesStore.searchQuery,
  set: (value: string) => gamesStore.setSearchQuery(value)
})

authStore.listenToSession()

async function signOutHandle () {
  await authStore.signOut()
  router.push({ name: 'map' })
}

function goTo (name: string) {
  router.push({ name })
}

function createGameHandle () {
  router.push({ name: 'create-game' })
}
</script>

<template>
  <div class="relative flex h-screen w-full flex-col overflow-hidden bg-background">
    <header
      v-if="showChrome"
      :class="headerClass"
    >
      <div class="glass-panel mx-auto flex h-16 w-full max-w-[1920px] items-center justify-between rounded-full px-lg shadow-lg">
        <div class="flex items-center gap-lg">
          <router-link
            :to="{ name: 'landing' }"
            class="flex items-center gap-sm no-underline"
          >
            <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-container shadow-glow">
              <Icon
                name="explore"
                :size="20"
                color="white"
              />
            </span>
            <span class="text-headline-sm font-bold text-primary">{{ t('common.brand') }}</span>
          </router-link>
          <nav
            v-if="isLoggedIn"
            class="hidden items-center gap-xs rounded-full bg-surface-container-low p-1 md:flex"
          >
            <router-link
              :to="{ name: 'map' }"
              class="rounded-full px-4 py-1.5 text-body-sm font-medium no-underline transition-colors"
              :class="isMapRoute ? 'bg-surface text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'"
            >
              {{ t('common.discover') }}
            </router-link>
            <router-link
              :to="{ name: 'communities' }"
              class="rounded-full px-4 py-1.5 text-body-sm font-medium no-underline transition-colors"
              :class="isCommunitiesRoute ? 'bg-surface text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'"
            >
              {{ t('common.communities') }}
            </router-link>
          </nav>
        </div>
        <div
          v-if="isMapRoute"
          class="mx-lg hidden max-w-[28rem] flex-1 lg:block"
        >
          <div class="relative flex h-10 w-full items-center rounded-full border border-outline-variant/50 bg-surface-container-low transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
            <div class="grid h-full w-12 place-items-center text-on-surface-variant">
              <span class="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('nav.searchPlaceholder')"
              class="h-full w-full border-none bg-transparent px-0 text-body-md text-on-surface outline-none focus:ring-0"
              data-testid="top-nav-search"
            >
          </div>
        </div>
        <div class="flex items-center gap-md">
          <button
            v-if="isLoggedIn"
            class="hidden items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary-container px-4 py-2 text-label-md text-on-primary shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg md:flex"
            @click="createGameHandle"
          >
            {{ t('nav.createGame') }}
          </button>
          <NotificationsBell v-if="isLoggedIn" />
          <IconButton
            v-if="isLoggedIn"
            icon="account_circle"
            variant="ghost"
            data-testid="app-bar-cabinet"
            :aria-label="t('nav.cabinet')"
            @click="goTo('cabinet')"
          />
          <div
            v-if="isLoggedIn"
            class="ml-xs h-8 w-px bg-outline-variant/60"
            aria-hidden="true"
          />
          <IconButton
            v-if="isLoggedIn"
            icon="logout"
            variant="danger"
            data-testid="app-bar-signout"
            :aria-label="t('common.signOut')"
            @click="signOutHandle"
          />
          <button
            v-else-if="showSignInCta"
            class="rounded-full border border-outline-variant px-4 py-2 text-label-md text-on-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
            data-testid="app-bar-signin"
            @click="goTo('auth')"
          >
            {{ t('common.signIn') }}
          </button>
        </div>
      </div>
    </header>
    <main :class="mainClass">
      <router-view v-slot="{ Component }">
        <Transition
          name="page-fade"
          mode="out-in"
        >
          <component :is="Component" />
        </Transition>
      </router-view>
    </main>
    <nav
      v-if="mobile && showChrome"
      :class="bottomNavClass"
      data-testid="bottom-nav"
    >
      <div class="glass-panel pointer-events-auto relative mx-auto flex h-16 w-full max-w-[420px] items-center justify-around overflow-hidden rounded-full px-2 shadow-lg">
        <div
          class="pointer-events-none absolute top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary to-accent opacity-25 blur-xl transition-all duration-300"
          :style="navGlowStyle"
        />
        <button
          type="button"
          class="relative z-10 flex flex-col items-center justify-center gap-0.5 text-label-sm transition-transform active:scale-90"
          :class="route.name === 'map' ? 'text-primary' : 'text-on-surface-variant'"
          data-testid="bottom-nav-map"
          @click="goTo('map')"
        >
          <Icon
            name="map"
            :size="22"
          />
          {{ t('nav.map') }}
        </button>
        <button
          type="button"
          class="relative z-10 flex flex-col items-center justify-center gap-0.5 text-label-sm transition-transform active:scale-90"
          :class="route.name === 'communities' ? 'text-primary' : 'text-on-surface-variant'"
          data-testid="bottom-nav-communities"
          @click="goTo('communities')"
        >
          <Icon
            name="group"
            :size="22"
          />
          {{ t('common.communities') }}
        </button>
        <template v-if="isLoggedIn">
          <button
            type="button"
            class="relative z-10 flex flex-col items-center justify-center gap-0.5 text-label-sm transition-transform active:scale-90"
            :class="route.name === 'cabinet' ? 'text-primary' : 'text-on-surface-variant'"
            data-testid="bottom-nav-cabinet"
            @click="goTo('cabinet')"
          >
            <Icon
              name="sports_handball"
              :size="22"
            />
            {{ t('nav.myGames') }}
          </button>
          <button
            type="button"
            class="relative z-10 flex flex-col items-center justify-center gap-0.5 text-label-sm transition-transform active:scale-90"
            :class="route.name === 'settings' ? 'text-primary' : 'text-on-surface-variant'"
            data-testid="bottom-nav-settings"
            @click="goTo('settings')"
          >
            <Icon
              name="person"
              :size="22"
            />
            {{ t('common.settings') }}
          </button>
        </template>
        <button
          v-else
          type="button"
          class="relative z-10 flex flex-col items-center justify-center gap-0.5 text-label-sm transition-transform active:scale-90"
          :class="route.name === 'auth' ? 'text-primary' : 'text-on-surface-variant'"
          data-testid="bottom-nav-signin"
          @click="goTo('auth')"
        >
          <Icon
            name="login"
            :size="22"
          />
          {{ t('common.signIn') }}
        </button>
      </div>
    </nav>
    <AppFooter
      v-if="showChrome"
      :class="footerClass"
    />
    <Toast />
  </div>
</template>
