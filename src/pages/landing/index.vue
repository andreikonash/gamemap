<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppFooter from '@/components/features/AppFooter/index.vue'
import { Avatar, BeamsBackground, CountUp, Icon, Marquee, PhotoPlaceholder, RevealOnScroll, ScrollProgress } from '@/components/ui'
import { useMobile } from '@/composables/useMobile'
import { auth } from '@/store/auth'

defineOptions({ name: 'LandingPage' })

function unsplashPhoto (id: string, width: number, height: number): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&h=${height}&q=70`
}

const PHOTOS = {
  football: unsplashPhoto('1543351611-58f69d7c1781', 300, 300),
  basketballHoop: unsplashPhoto('1546519638-68e109498ffc', 300, 300),
  basketballCourt: unsplashPhoto('1519861531473-9200262188bf', 700, 700),
  volleyball: unsplashPhoto('1592656094267-764a45160876', 500, 500),
  tennis: unsplashPhoto('1599586120429-48281b6f0ece', 500, 500),
  running: unsplashPhoto('1461896836934-ffe607ba8211', 500, 500),
  tableTennis: unsplashPhoto('1534158914592-062992fbe900', 500, 500),
  stadium: unsplashPhoto('1487466365202-1afdb86c764e', 1600, 500),
  map: unsplashPhoto('1569336415962-a4bd9f69cd83', 900, 700),
  phone: unsplashPhoto('1512941937669-90a1b58e7e9c', 700, 400),
  payment: unsplashPhoto('1556742049-0cfed4f6a45d', 500, 500),
  analytics: unsplashPhoto('1551288049-bebda4e38f71', 500, 500)
}

const { t } = useI18n()
const router = useRouter()
const authStore = auth()
const mobile = useMobile()

const STATS = computed(() => [
  { value: 500, suffix: '+', decimals: 0, label: t('landing.stats.gamesHosted') },
  { value: 2300, suffix: '+', decimals: 0, label: t('landing.stats.players') },
  { value: 12, suffix: '', decimals: 0, label: t('landing.stats.sports') },
  { value: 4.8, suffix: '★', decimals: 1, label: t('landing.stats.averageRating') }
])

const FEATURES = computed(() => [
  {
    icon: 'explore',
    title: t('landing.features.findNearby.title'),
    description: t('landing.features.findNearby.description'),
    photo: PHOTOS.map,
    span: 'md:col-span-2 md:row-span-2'
  },
  {
    icon: 'bolt',
    title: t('landing.features.joinInstantly.title'),
    description: t('landing.features.joinInstantly.description'),
    photo: PHOTOS.phone,
    span: 'md:col-span-2'
  },
  {
    icon: 'lock',
    title: t('landing.features.paySecurely.title'),
    description: t('landing.features.paySecurely.description'),
    photo: PHOTOS.payment,
    span: ''
  },
  {
    icon: 'monitoring',
    title: t('landing.features.trackStats.title'),
    description: t('landing.features.trackStats.description'),
    photo: PHOTOS.analytics,
    span: ''
  }
])

const LIVE_STATUS_STYLE: Record<string, { bg: string, text: string, pulse: boolean }> = {
  live: { bg: '#6cf8bb', text: '#00714d', pulse: true },
  soon: { bg: '#ffedd5', text: '#7c2d12', pulse: false },
  urgent: { bg: '#ffdad6', text: '#93000a', pulse: false }
}

const LIVE_GAMES = computed(() => [
  {
    icon: 'sports_volleyball',
    gradientClass: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    title: t('landing.liveGames.volleyball.title'),
    location: t('landing.liveGames.volleyball.location'),
    status: 'soon',
    statusLabel: t('landing.liveGames.status.startingIn', { n: 20 }),
    seatsTaken: 5,
    seatsTotal: 8
  },
  {
    icon: 'sports_soccer',
    gradientClass: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    title: t('landing.liveGames.football.title'),
    location: t('landing.liveGames.football.location'),
    status: 'urgent',
    statusLabel: t('landing.liveGames.status.spotsLeft', { n: 2 }),
    seatsTaken: 10,
    seatsTotal: 12
  },
  {
    icon: 'sports_basketball',
    gradientClass: 'bg-gradient-to-br from-amber-400 to-orange-500',
    title: t('landing.liveGames.basketball.title'),
    location: t('landing.liveGames.basketball.location'),
    status: 'live',
    statusLabel: t('landing.liveGames.status.liveNow'),
    seatsTaken: 6,
    seatsTotal: 6
  }
])

const CTA_PARTICLES = [
  { id: 1, left: '8%', top: '20%', delay: '0s', duration: '5s' },
  { id: 2, left: '18%', top: '70%', delay: '0.8s', duration: '6s' },
  { id: 3, left: '32%', top: '35%', delay: '1.4s', duration: '4.5s' },
  { id: 4, left: '58%', top: '15%', delay: '0.4s', duration: '5.5s' },
  { id: 5, left: '74%', top: '65%', delay: '1.1s', duration: '6.5s' },
  { id: 6, left: '88%', top: '30%', delay: '0.2s', duration: '5s' },
  { id: 7, left: '48%', top: '80%', delay: '1.6s', duration: '4.8s' }
]

const TESTIMONIALS = computed(() => [0, 1, 2, 3, 4].map((index) => ({
  name: t(`landing.testimonials.items.${index}.name`),
  role: t(`landing.testimonials.items.${index}.role`),
  quote: t(`landing.testimonials.items.${index}.quote`)
})))

const STEPS = computed(() => [
  {
    icon: 'travel_explore',
    title: t('landing.steps.discover.title'),
    description: t('landing.steps.discover.description')
  },
  {
    icon: 'event_available',
    title: t('landing.steps.reserve.title'),
    description: t('landing.steps.reserve.description')
  },
  {
    icon: 'sports_soccer',
    title: t('landing.steps.showUp.title'),
    description: t('landing.steps.showUp.description')
  }
])

const SPORTS = computed(() => [
  { icon: 'sports_soccer', label: t('sport.football'), photo: PHOTOS.football, span: 'sm:col-span-2' },
  { icon: 'sports_basketball', label: t('sport.basketball'), photo: PHOTOS.basketballCourt, span: '' },
  { icon: 'sports_volleyball', label: t('sport.volleyball'), photo: PHOTOS.volleyball, span: '' },
  { icon: 'sports_tennis', label: t('sport.tennis'), photo: PHOTOS.tennis, span: '' },
  { icon: 'directions_run', label: t('sport.running'), photo: PHOTOS.running, span: '' },
  { icon: 'table_bar', label: t('sport.tableTennis'), photo: PHOTOS.tableTennis, span: '' }
])

const isLoggedIn = computed(() => authStore.isLoggedIn)
const primaryCtaLabel = computed(() => (isLoggedIn.value ? t('landing.goToDashboard') : t('landing.signUpFree')))
const navOpen = ref(false)

function goBrowse () {
  router.push({ name: 'map' })
}

function goPrimaryCta () {
  router.push({ name: isLoggedIn.value ? 'cabinet' : 'auth' })
}

function goSignIn () {
  router.push({ name: 'auth' })
}
</script>

<template>
  <div class="landing-page bg-background">
    <ScrollProgress :label="t('landing.scrollProgressLabel')" />
    <header class="sticky top-0 z-50 w-full px-margin-mobile pt-4 md:px-margin-desktop">
      <div class="glass-panel mx-auto flex h-16 w-full max-w-[1920px] items-center justify-between rounded-full px-lg shadow-lg">
        <span class="text-headline-md font-bold text-primary">{{ t('common.brand') }}</span>
        <nav class="hidden items-center gap-lg md:flex">
          <a
            href="#live-games"
            class="text-body-md text-on-surface-variant transition-colors hover:text-primary"
          >{{ t('landing.nav.liveGames') }}</a>
          <a
            href="#features"
            class="text-body-md text-on-surface-variant transition-colors hover:text-primary"
          >{{ t('landing.nav.features') }}</a>
          <a
            href="#how-it-works"
            class="text-body-md text-on-surface-variant transition-colors hover:text-primary"
          >{{ t('landing.nav.howItWorks') }}</a>
          <a
            href="#sports"
            class="text-body-md text-on-surface-variant transition-colors hover:text-primary"
          >{{ t('landing.nav.sports') }}</a>
        </nav>
        <div class="flex items-center gap-sm md:gap-md">
          <button
            v-if="!isLoggedIn"
            type="button"
            class="hidden min-h-[44px] rounded-full px-4 py-2 text-label-md text-on-surface-variant transition-colors hover:bg-white/60 md:block"
            @click="goSignIn"
          >
            {{ t('common.signIn') }}
          </button>
          <button
            type="button"
            class="min-h-[44px] rounded-full bg-gradient-to-r from-primary to-primary-container px-4 py-2 text-label-md text-on-primary shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            @click="goPrimaryCta"
          >
            {{ primaryCtaLabel }}
          </button>
          <button
            type="button"
            class="flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-white/60 md:hidden"
            :aria-expanded="navOpen"
            :aria-label="t('landing.toggleNavigation')"
            @click="navOpen = !navOpen"
          >
            <Icon :name="navOpen ? 'close' : 'menu'" />
          </button>
        </div>
      </div>
      <Transition name="mobile-nav">
        <nav
          v-if="navOpen && mobile"
          class="glass-panel mx-auto mt-2 flex max-w-[1920px] flex-col gap-xs rounded-2xl p-md shadow-lg md:hidden"
        >
          <a
            href="#live-games"
            class="rounded-lg px-3 py-2 text-body-md text-on-surface-variant hover:bg-white/60"
            @click="navOpen = false"
          >{{ t('landing.nav.liveGames') }}</a>
          <a
            href="#features"
            class="rounded-lg px-3 py-2 text-body-md text-on-surface-variant hover:bg-white/60"
            @click="navOpen = false"
          >{{ t('landing.nav.features') }}</a>
          <a
            href="#how-it-works"
            class="rounded-lg px-3 py-2 text-body-md text-on-surface-variant hover:bg-white/60"
            @click="navOpen = false"
          >{{ t('landing.nav.howItWorks') }}</a>
          <a
            href="#sports"
            class="rounded-lg px-3 py-2 text-body-md text-on-surface-variant hover:bg-white/60"
            @click="navOpen = false"
          >{{ t('landing.nav.sports') }}</a>
          <button
            v-if="!isLoggedIn"
            type="button"
            class="rounded-lg px-3 py-2 text-start text-body-md text-on-surface-variant hover:bg-white/60"
            @click="goSignIn"
          >
            {{ t('common.signIn') }}
          </button>
        </nav>
      </Transition>
    </header>

    <main>
      <section class="relative overflow-hidden px-margin-mobile pb-2xl pt-2xl md:px-margin-desktop">
        <BeamsBackground
          intensity="strong"
          class="rounded-[2.5rem]"
        >
          <div class="relative mx-auto flex w-full max-w-[1920px] flex-col items-center gap-2xl px-margin-mobile py-3xl lg:flex-row lg:px-3xl">
            <RevealOnScroll class="flex-1 text-center lg:text-start">
              <span class="animate-float mb-md inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-label-sm text-white/80">
                <Icon
                  name="location_on"
                  :size="16"
                  color="white"
                />
                {{ t('landing.badge') }}
              </span>
              <h1 class="mb-md text-headline-lg-mobile leading-[0.95] text-white md:text-display">
                {{ t('landing.heroTitlePart1') }}
                <span class="animate-gradient inline bg-gradient-to-r from-primary-fixed via-accent to-primary-fixed bg-[length:300%_100%] bg-clip-text text-transparent">{{ t('landing.heroTitlePart2') }}</span>
                {{ t('landing.heroTitlePart3') }}
              </h1>
              <p class="mb-lg max-w-[36rem] text-body-lg text-white/70">
                {{ t('landing.heroDescription') }}
              </p>
              <div class="flex flex-col items-center gap-sm sm:flex-row lg:justify-start">
                <button
                  type="button"
                  class="w-full rounded-full bg-gradient-to-r from-tertiary to-accent px-6 py-3 text-label-md text-white shadow-glow-accent transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
                  @click="goBrowse"
                >
                  {{ t('common.browseGames') }}
                </button>
                <button
                  type="button"
                  class="w-full rounded-full border border-white/30 px-6 py-3 text-label-md text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10 sm:w-auto"
                  @click="goPrimaryCta"
                >
                  {{ primaryCtaLabel }}
                </button>
              </div>
            </RevealOnScroll>

            <RevealOnScroll
              :delay="150"
              class="w-full flex-1"
            >
              <div class="glass-panel-dark relative rounded-[1.75rem] p-lg shadow-lg">
                <div class="mb-md flex items-center justify-between">
                  <span class="text-label-sm text-white/70">{{ t('landing.mockCard.nearbyGames') }}</span>
                  <span
                    class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-label-sm"
                    style="background-color: #6cf8bb; color: #00714d"
                  >
                    <span class="relative flex h-1.5 w-1.5">
                      <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
                      <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                    </span>
                    {{ t('landing.mockCard.open') }}
                  </span>
                </div>
                <div class="mb-md flex items-center gap-md rounded-xl border border-white/10 bg-white/5 p-md">
                  <div class="h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                    <img
                      :src="PHOTOS.football"
                      :alt="t('landing.mockCard.footballAlt')"
                      class="h-full w-full object-cover"
                    >
                  </div>
                  <div>
                    <p class="text-body-md font-semibold text-white">
                      {{ t('landing.mockCard.footballTitle') }}
                    </p>
                    <p class="text-body-sm text-white/60">
                      {{ t('landing.mockCard.footballTime') }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-md rounded-xl border border-white/10 bg-white/5 p-md">
                  <div class="h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                    <img
                      :src="PHOTOS.basketballHoop"
                      :alt="t('landing.mockCard.basketballAlt')"
                      class="h-full w-full object-cover"
                    >
                  </div>
                  <div>
                    <p class="text-body-md font-semibold text-white">
                      {{ t('landing.mockCard.basketballTitle') }}
                    </p>
                    <p class="text-body-sm text-white/60">
                      {{ t('landing.mockCard.basketballTime') }}
                    </p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </BeamsBackground>

        <RevealOnScroll
          :delay="250"
          class="relative z-10 mx-auto -mt-8 w-full max-w-[1100px] px-margin-mobile"
        >
          <div class="glass-panel grid grid-cols-2 gap-md rounded-[1.75rem] p-lg shadow-lg md:grid-cols-4">
            <div
              v-for="stat in STATS"
              :key="stat.label"
              class="text-center"
            >
              <div class="bg-gradient-to-r from-primary to-tertiary bg-clip-text text-headline-md text-transparent">
                <CountUp
                  :value="stat.value"
                  :suffix="stat.suffix"
                  :decimals="stat.decimals"
                />
              </div>
              <div class="text-body-sm text-on-surface-variant">
                {{ stat.label }}
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <section
        id="live-games"
        class="mx-auto max-w-[1920px] px-margin-mobile py-2xl md:px-margin-desktop"
      >
        <RevealOnScroll class="mx-auto mb-xl max-w-[42rem] text-center">
          <h2 class="mb-sm text-headline-lg-mobile text-on-surface md:text-headline-lg">
            {{ t('landing.liveGames.title') }}
          </h2>
          <p class="text-body-lg text-on-surface-variant">
            {{ t('landing.liveGames.subtitle') }}
          </p>
        </RevealOnScroll>
        <div class="grid grid-cols-1 gap-md md:grid-cols-3">
          <RevealOnScroll
            v-for="(game, index) in LIVE_GAMES"
            :key="game.title"
            :delay="index * 100"
          >
            <div class="bento-tile group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-outline-variant bg-surface shadow-sm">
              <div class="relative h-40 w-full overflow-hidden">
                <div class="h-full w-full transition-transform duration-500 group-hover:scale-105">
                  <PhotoPlaceholder
                    :icon="game.icon"
                    :gradient-class="game.gradientClass"
                    icon-color-class="text-white"
                  />
                </div>
                <span
                  class="glass-panel-dark absolute right-sm top-sm inline-flex items-center gap-1 rounded-full px-2 py-1 text-label-sm"
                  :style="{ backgroundColor: LIVE_STATUS_STYLE[game.status].bg, color: LIVE_STATUS_STYLE[game.status].text }"
                >
                  <span
                    v-if="LIVE_STATUS_STYLE[game.status].pulse"
                    class="relative flex h-1.5 w-1.5"
                  >
                    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
                    <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                  </span>
                  <span
                    v-else
                    class="h-1.5 w-1.5 rounded-full bg-current"
                  />
                  {{ game.statusLabel }}
                </span>
              </div>
              <div class="flex flex-1 flex-col gap-xs p-lg">
                <h3 class="text-headline-sm text-on-surface">
                  {{ game.title }}
                </h3>
                <div class="flex items-center gap-xs text-body-sm text-on-surface-variant">
                  <Icon
                    name="location_on"
                    :size="16"
                  />
                  {{ game.location }}
                </div>
                <div class="mt-auto flex items-center gap-xs pt-sm">
                  <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-variant">
                    <div
                      class="h-full rounded-full bg-gradient-to-r from-primary to-tertiary"
                      :style="{ width: `${(game.seatsTaken / game.seatsTotal) * 100}%` }"
                    />
                  </div>
                  <span class="text-label-sm text-on-surface-variant">{{ game.seatsTaken }}/{{ game.seatsTotal }}</span>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section class="mx-auto max-w-[1920px] px-margin-mobile md:px-margin-desktop">
        <RevealOnScroll class="flex flex-col items-center justify-center gap-md rounded-[1.75rem] border border-outline-variant bg-surface p-lg text-center shadow-sm sm:flex-row sm:justify-between sm:text-start">
          <div class="flex -space-x-3">
            <Avatar
              v-for="n in 5"
              :key="n"
              :size="44"
              class="ring-4 ring-surface"
            />
          </div>
          <p class="text-body-md text-on-surface-variant">
            {{ t('landing.lovedByPrefix') }} <CountUp
              :value="2300"
              suffix="+"
              class="font-semibold text-on-surface"
            /> {{ t('landing.lovedBySuffix') }}
          </p>
          <div class="flex items-center gap-1 text-tertiary-fixed-dim">
            <Icon
              v-for="n in 5"
              :key="n"
              name="star"
              :size="20"
              color="var(--color-tertiary-fixed-dim)"
            />
            <span class="ml-1 font-semibold text-on-surface">{{ t('landing.rating') }}</span>
          </div>
        </RevealOnScroll>
      </section>

      <section
        id="features"
        class="mx-auto max-w-[1920px] px-margin-mobile py-2xl md:px-margin-desktop"
      >
        <RevealOnScroll class="mx-auto mb-xl max-w-[42rem] text-center">
          <h2 class="mb-sm text-headline-lg-mobile text-on-surface md:text-headline-lg">
            {{ t('landing.featuresTitle') }}
          </h2>
          <p class="text-body-lg text-on-surface-variant">
            {{ t('landing.featuresSubtitle') }}
          </p>
        </RevealOnScroll>
        <div class="grid grid-cols-1 gap-md md:grid-cols-4 md:auto-rows-[190px]">
          <RevealOnScroll
            v-for="(feature, index) in FEATURES"
            :key="feature.title"
            :delay="index * 80"
            :class="feature.span"
          >
            <div class="bento-tile group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-outline-variant bg-surface shadow-sm">
              <div class="relative w-full flex-1 overflow-hidden">
                <img
                  :src="feature.photo"
                  :alt="feature.title"
                  class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div class="absolute inset-x-0 bottom-0 flex items-center gap-3 p-lg">
                  <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-glow">
                    <Icon
                      :name="feature.icon"
                      :size="22"
                    />
                  </div>
                  <div>
                    <h3 class="text-headline-sm text-white">
                      {{ feature.title }}
                    </h3>
                    <p class="text-body-sm text-white/80">
                      {{ feature.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section class="relative h-[400px] overflow-hidden">
        <img
          :src="PHOTOS.stadium"
          :alt="t('landing.nightSection.imgAlt')"
          class="h-full w-full object-cover"
          loading="lazy"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
        <RevealOnScroll class="absolute inset-0 flex flex-col items-center justify-center px-margin-mobile text-center">
          <h2 class="mb-sm text-headline-lg-mobile text-white md:text-display">
            {{ t('landing.nightSection.title') }}
          </h2>
          <p class="max-w-[42rem] text-body-lg text-white/80">
            {{ t('landing.nightSection.description') }}
          </p>
        </RevealOnScroll>
      </section>

      <section
        id="how-it-works"
        class="px-margin-mobile py-2xl md:px-margin-desktop"
      >
        <div class="mx-auto max-w-[1920px]">
          <RevealOnScroll class="mx-auto mb-xl max-w-[42rem] text-center">
            <h2 class="mb-sm text-headline-lg-mobile text-on-surface md:text-headline-lg">
              {{ t('landing.howItWorksTitle') }}
            </h2>
            <p class="text-body-lg text-on-surface-variant">
              {{ t('landing.howItWorksSubtitle') }}
            </p>
          </RevealOnScroll>
          <div class="relative grid grid-cols-1 gap-lg md:grid-cols-3">
            <div class="pointer-events-none absolute inset-x-[16.5%] top-8 hidden h-0.5 bg-gradient-to-r from-primary via-tertiary to-accent md:block" />
            <RevealOnScroll
              v-for="(step, index) in STEPS"
              :key="step.title"
              :delay="index * 100"
              class="relative text-center"
            >
              <div class="relative z-10 mx-auto mb-md flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-glow ring-8 ring-background">
                <Icon
                  :name="step.icon"
                  :size="28"
                />
              </div>
              <h3 class="mb-xs text-headline-sm text-on-surface">
                {{ t('landing.stepNumber', { n: index + 1, title: step.title }) }}
              </h3>
              <p class="text-body-sm text-on-surface-variant">
                {{ step.description }}
              </p>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section
        id="sports"
        class="mx-auto max-w-[1920px] px-margin-mobile py-2xl md:px-margin-desktop"
      >
        <RevealOnScroll class="mx-auto mb-xl max-w-[42rem] text-center">
          <h2 class="mb-sm text-headline-lg-mobile text-on-surface md:text-headline-lg">
            {{ t('landing.sportsTitle') }}
          </h2>
          <p class="text-body-lg text-on-surface-variant">
            {{ t('landing.sportsSubtitle') }}
          </p>
        </RevealOnScroll>
        <div class="grid grid-cols-2 gap-md sm:grid-cols-3 lg:grid-cols-4">
          <RevealOnScroll
            v-for="(sport, index) in SPORTS"
            :key="sport.label"
            :delay="index * 60"
            :class="sport.span"
          >
            <div class="bento-tile group relative h-56 overflow-hidden rounded-[1.75rem] shadow-sm sm:h-64">
              <img
                :src="sport.photo"
                :alt="sport.label"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div class="absolute inset-x-0 bottom-0 flex items-center gap-2 p-md">
                <Icon
                  :name="sport.icon"
                  :size="18"
                  color="white"
                />
                <span class="text-label-md font-semibold text-white">{{ sport.label }}</span>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section class="py-2xl">
        <RevealOnScroll class="mx-auto mb-xl max-w-[42rem] px-margin-mobile text-center">
          <h2 class="mb-sm text-headline-lg-mobile text-on-surface md:text-headline-lg">
            {{ t('landing.testimonials.title') }}
          </h2>
          <p class="text-body-lg text-on-surface-variant">
            {{ t('landing.testimonials.subtitle') }}
          </p>
        </RevealOnScroll>
        <div class="relative mx-auto max-w-[1920px] overflow-hidden">
          <Marquee
            :duration="36"
            gap="1.5rem"
          >
            <div
              v-for="(testimonial, index) in TESTIMONIALS"
              :key="index"
              class="flex w-72 shrink-0 flex-col gap-sm rounded-2xl border border-outline-variant bg-surface p-lg shadow-sm"
            >
              <div class="flex items-center gap-1 text-tertiary-fixed-dim">
                <Icon
                  v-for="n in 5"
                  :key="n"
                  name="star"
                  :size="14"
                  color="var(--color-tertiary-fixed-dim)"
                />
              </div>
              <p class="text-body-sm text-on-surface-variant">
                “{{ testimonial.quote }}”
              </p>
              <div class="mt-auto flex items-center gap-sm">
                <Avatar
                  :size="36"
                  :label="testimonial.name"
                />
                <div>
                  <p class="text-body-sm font-semibold text-on-surface">
                    {{ testimonial.name }}
                  </p>
                  <p class="text-label-sm text-on-surface-variant">
                    {{ testimonial.role }}
                  </p>
                </div>
              </div>
            </div>
          </Marquee>
          <div class="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent md:w-40" />
          <div class="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent md:w-40" />
        </div>
      </section>

      <section class="px-margin-mobile py-2xl md:px-margin-desktop">
        <RevealOnScroll class="relative mx-auto max-w-[1920px] overflow-hidden rounded-[2.5rem] px-lg py-3xl text-center text-on-primary shadow-lg">
          <img
            :src="PHOTOS.stadium"
            alt=""
            class="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          >
          <div class="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-tertiary/70" />
          <div class="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div class="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-secondary-container/20 blur-2xl" />
          <div
            v-for="particle in CTA_PARTICLES"
            :key="particle.id"
            class="animate-float pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-white/50"
            :style="{ left: particle.left, top: particle.top, animationDelay: particle.delay, animationDuration: particle.duration }"
          />
          <div class="relative z-10">
            <h2 class="mb-sm text-headline-lg-mobile md:text-headline-lg">
              {{ t('common.readyToPlay') }}
            </h2>
            <p class="mb-lg text-body-lg text-primary-fixed">
              {{ t('landing.finalCtaSubtitle') }}
            </p>
            <button
              type="button"
              class="rounded-full bg-white px-6 py-3 text-label-md text-primary shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              @click="goPrimaryCta"
            >
              {{ primaryCtaLabel }}
            </button>
          </div>
        </RevealOnScroll>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.landing-page {
  min-height: 100%;
}

.mobile-nav-enter-active,
.mobile-nav-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.mobile-nav-enter-from,
.mobile-nav-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
