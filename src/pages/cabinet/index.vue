<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import AppNavSidebar from '@/components/features/AppNavSidebar/index.vue'
import GameRoster from '@/components/features/Booking/GameRoster/index.vue'
import GamesList from '@/components/features/Cabinet/GamesList/index.vue'
import TeamsList from '@/components/features/Cabinet/TeamsList/index.vue'
import { EmptyState, Icon } from '@/components/ui'
import { useToast } from '@/composables/useToast'
import { auth } from '@/store/auth'
import { booking } from '@/store/booking'
import { organizer } from '@/store/organizer'
import { teams } from '@/store/teams'
import { REGISTRATION_STATUS } from '@/types/booking'
import { getSportIcon, getSportLabel } from '@/utils/helpers/sportIcon'

const GAME_TABS = ['upcoming', 'past'] as const

defineOptions({ name: 'CabinetPage' })

const { t } = useI18n()
const router = useRouter()
const authStore = auth()
const bookingStore = booking()
const teamsStore = teams()
const organizerStore = organizer()
const { showToast } = useToast()
const activeTab = ref<'upcoming' | 'past' | 'teams' | 'hosting'>('upcoming')

if (authStore.userId) teamsStore.loadTeams(authStore.userId)
if (authStore.userId) organizerStore.loadHostedGames(authStore.userId)

const totalGames = computed(() => bookingStore.myRegistrations.length)
const paidCount = computed(() =>
  bookingStore.myRegistrations.filter((r) => r.status === REGISTRATION_STATUS.PAID).length
)
const waitingCount = computed(() =>
  bookingStore.myRegistrations.filter((r) => r.status === REGISTRATION_STATUS.PENDING_PAYMENT).length
)
const totalSpent = computed(() =>
  bookingStore.myRegistrations
    .filter((r) => r.status === REGISTRATION_STATUS.PAID)
    .reduce((sum, r) => sum + r.price, 0)
)

const upcomingRegistrations = computed(() =>
  bookingStore.myRegistrations.filter((r) => new Date(r.gameStartsAt).getTime() >= Date.now())
)
const pastRegistrations = computed(() =>
  bookingStore.myRegistrations.filter((r) => new Date(r.gameStartsAt).getTime() < Date.now())
)
const displayedRegistrations = computed(() =>
  activeTab.value === 'upcoming' ? upcomingRegistrations.value : pastRegistrations.value
)
const emptyMessage = computed(() =>
  activeTab.value === 'upcoming'
    ? t('cabinet.emptyUpcoming')
    : t('cabinet.emptyPast')
)

function openGame (gameId: string) {
  router.push({ name: 'game', params: { id: gameId } })
}

async function cancelRegistrationHandle (registrationId: string) {
  await bookingStore.cancelRegistration(registrationId)
  showToast(t('gamesList.cancelledToast'), 'undo')
}

function fullAnalyticsHandle () {
  showToast(t('cabinet.analyticsComingSoon'), 'monitoring')
}

</script>

<template>
  <div class="flex min-h-full w-full flex-col">
    <div class="mx-auto flex w-full max-w-[1920px] flex-1">
      <AppNavSidebar sticky />

      <main class="flex-1 bg-background p-margin-mobile md:p-margin-desktop">
        <div class="mb-lg md:mb-xl">
          <h1 class="text-headline-lg-mobile text-on-surface md:text-headline-lg">
            {{ t('cabinet.title') }}
          </h1>
          <p class="text-body-md text-on-surface-variant">
            {{ t('cabinet.subtitle') }}
          </p>
        </div>

        <TabsRoot v-model="activeTab">
          <TabsList class="no-scrollbar mb-lg inline-flex max-w-full gap-sm overflow-x-auto rounded-full border border-surface-container-highest bg-surface p-2 shadow-sm">
            <TabsTrigger
              value="upcoming"
              class="cabinet-tab whitespace-nowrap rounded-full px-6 py-2 text-label-md text-on-surface-variant outline-none transition-all hover:bg-surface-container"
              data-testid="cabinet-tab-upcoming"
            >
              {{ t('cabinet.upcomingGames') }}
            </TabsTrigger>
            <TabsTrigger
              value="past"
              class="cabinet-tab whitespace-nowrap rounded-full px-6 py-2 text-label-md text-on-surface-variant outline-none transition-all hover:bg-surface-container"
              data-testid="cabinet-tab-past"
            >
              {{ t('cabinet.pastGames') }}
            </TabsTrigger>
            <TabsTrigger
              value="teams"
              class="cabinet-tab whitespace-nowrap rounded-full px-6 py-2 text-label-md text-on-surface-variant outline-none transition-all hover:bg-surface-container"
              data-testid="cabinet-tab-teams"
            >
              {{ t('cabinet.myTeams') }}
            </TabsTrigger>
            <TabsTrigger
              value="hosting"
              class="cabinet-tab whitespace-nowrap rounded-full px-6 py-2 text-label-md text-on-surface-variant outline-none transition-all hover:bg-surface-container"
              data-testid="cabinet-tab-hosting"
            >
              {{ t('cabinet.hosting') }}
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="hosting"
            class="flex flex-col gap-md"
          >
            <EmptyState
              v-if="!organizerStore.loadingHostedGames && organizerStore.hostedGames.length === 0"
              icon="sports_soccer"
              :title="t('organizer.hostedGamesTitle')"
              :description="t('organizer.hostedGamesEmpty')"
              data-testid="hosting-empty"
            />
            <article
              v-for="hostedGame in organizerStore.hostedGames"
              :key="hostedGame.id"
              class="bento-tile flex flex-col gap-md rounded-[1.75rem] border border-surface-container-low bg-surface p-md shadow-sm md:p-lg"
              data-testid="hosted-game"
            >
              <div class="flex items-center justify-between gap-md">
                <div class="flex items-center gap-2">
                  <Icon
                    :name="getSportIcon(hostedGame.title)"
                    :size="18"
                  />
                  <h3 class="text-headline-sm text-on-surface">
                    {{ hostedGame.title }}
                  </h3>
                </div>
                <span class="whitespace-nowrap rounded-md bg-surface-container-high px-2 py-1 text-label-sm text-on-surface-variant">
                  {{ getSportLabel(hostedGame.title) }}
                </span>
              </div>
              <p class="text-body-sm text-on-surface-variant">
                {{ hostedGame.seatsTaken }}/{{ hostedGame.seatsTotal }} · {{ hostedGame.address }}
              </p>
              <GameRoster :game-id="hostedGame.id" />
            </article>
          </TabsContent>

          <TabsContent
            value="teams"
            class="grid grid-cols-1 gap-lg xl:grid-cols-3"
          >
            <div class="xl:col-span-2">
              <TeamsList />
            </div>

            <div class="flex flex-col gap-md">
              <div class="bento-tile flex items-center justify-between rounded-[1.75rem] border border-outline-variant bg-surface p-md shadow-sm">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high text-tertiary-fixed-dim">
                    <Icon
                      name="partly_cloudy_day"
                      :size="20"
                    />
                  </div>
                  <div>
                    <div class="text-label-md text-on-surface">
                      {{ t('common.city') }}
                    </div>
                    <div class="text-body-sm text-on-surface-variant">
                      {{ t('cabinet.weatherMock') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            v-for="tabValue in GAME_TABS"
            :key="tabValue"
            :value="tabValue"
            class="grid grid-cols-1 gap-lg xl:grid-cols-3"
          >
            <div class="xl:col-span-2">
              <GamesList
                :registrations="displayedRegistrations"
                :loading="bookingStore.loadingRegistrations"
                :empty-message="emptyMessage"
                @select="openGame"
                @cancel="cancelRegistrationHandle"
              />
            </div>

            <div class="flex flex-col gap-md">
              <div class="grid grid-cols-2 gap-md">
                <div class="bento-tile relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-primary to-primary-container p-lg text-white shadow-lg">
                  <div class="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                  <Icon
                    name="sports_soccer"
                    :size="22"
                  />
                  <div class="mt-sm text-headline-lg">
                    {{ totalGames }}
                  </div>
                  <div class="text-body-sm text-white/80">
                    {{ t('cabinet.gamesJoined') }}
                  </div>
                </div>
                <div class="bento-tile rounded-[1.75rem] border border-outline-variant bg-surface p-lg shadow-sm">
                  <Icon
                    name="check_circle"
                    :size="22"
                    color="var(--color-secondary)"
                  />
                  <div class="mt-sm text-headline-lg text-on-surface">
                    {{ paidCount }}
                  </div>
                  <div class="text-body-sm text-on-surface-variant">
                    {{ t('cabinet.paid') }}
                  </div>
                </div>
                <div class="bento-tile rounded-[1.75rem] border border-outline-variant bg-surface p-lg shadow-sm">
                  <Icon
                    name="hourglass_top"
                    :size="22"
                    color="var(--color-tertiary-fixed-dim)"
                  />
                  <div class="mt-sm text-headline-lg text-on-surface">
                    {{ waitingCount }}
                  </div>
                  <div class="text-body-sm text-on-surface-variant">
                    {{ t('cabinet.waitingForPayment') }}
                  </div>
                </div>
                <div class="bento-tile rounded-[1.75rem] border border-outline-variant bg-surface p-lg shadow-sm">
                  <Icon
                    name="payments"
                    :size="22"
                    color="var(--color-primary)"
                  />
                  <div class="mt-sm text-headline-lg text-on-surface">
                    {{ t('common.priceValue', { price: totalSpent }) }}
                  </div>
                  <div class="text-body-sm text-on-surface-variant">
                    {{ t('cabinet.totalSpent') }}
                  </div>
                </div>
              </div>

              <button
                type="button"
                class="w-full rounded-[1.75rem] border border-outline-variant bg-surface py-3 text-center text-label-md text-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                @click="fullAnalyticsHandle"
              >
                {{ t('cabinet.viewFullAnalytics') }}
              </button>

              <div class="bento-tile flex items-center justify-between rounded-[1.75rem] border border-outline-variant bg-surface p-md shadow-sm">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high text-tertiary-fixed-dim">
                    <Icon
                      name="partly_cloudy_day"
                      :size="20"
                    />
                  </div>
                  <div>
                    <div class="text-label-md text-on-surface">
                      {{ t('common.city') }}
                    </div>
                    <div class="text-body-sm text-on-surface-variant">
                      {{ t('cabinet.weatherMock') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </TabsRoot>
      </main>
    </div>
  </div>
</template>

<style scoped>
.cabinet-tab[data-state='active'] {
  background-image: linear-gradient(to right, var(--color-primary), var(--color-primary-container));
  color: white;
  box-shadow: var(--shadow-glow);
}
</style>
