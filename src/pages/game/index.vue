<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import GameRoster from '@/components/features/Booking/GameRoster/index.vue'
import JoinButton from '@/components/features/Booking/JoinButton/index.vue'
import PaymentFollowup from '@/components/features/Booking/PaymentFollowup/index.vue'
import { Avatar, Chip, Icon, PhotoPlaceholder, Skeleton } from '@/components/ui'
import { useAppLocale } from '@/i18n'
import { LOCALE_META } from '@/i18n/localeMeta'
import { auth } from '@/store/auth'
import { games } from '@/store/games'
import { getGameCardArt, getSportLabel } from '@/utils/helpers/sportIcon'
import { getStatusUi } from '@/utils/ui/gameStatusUi'
import type { IGame } from '@/types/game'

defineOptions({ name: 'GamePage' })

const { t } = useI18n()
const route = useRoute()
const gamesStore = games()
const authStore = auth()
const appLocale = useAppLocale()

const game = ref<IGame | null>(null)
const loading = ref(true)
const showPayment = ref(false)

const canManageRoster = computed(() =>
  Boolean(game.value && authStore.userId && (game.value.organizerId === authStore.userId || authStore.isSuperAdmin))
)

const bcp47Tag = computed(() => LOCALE_META[appLocale.value].bcp47Tag)
const statusUi = computed(() => (game.value ? getStatusUi(game.value.status) : null))
const seatsLeft = computed(() =>
  game.value ? game.value.seatsTotal - game.value.seatsTaken : 0
)
const cardArt = computed(() => getGameCardArt(game.value?.title ?? ''))
const sportLabel = computed(() => (game.value ? getSportLabel(game.value.title) : ''))
const formatLabel = computed(() =>
  game.value ? `${Math.floor(game.value.seatsTotal / 2)}v${Math.floor(game.value.seatsTotal / 2)}` : ''
)
const dateLabel = computed(() =>
  game.value ? new Date(game.value.startsAt).toLocaleDateString(bcp47Tag.value, { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }) : ''
)
const startTimeLabel = computed(() =>
  game.value ? new Date(game.value.startsAt).toLocaleTimeString(bcp47Tag.value, { hour: '2-digit', minute: '2-digit' }) : ''
)
const endTimeLabel = computed(() => {
  if (!game.value) return ''
  const end = new Date(game.value.startsAt).getTime() + game.value.durationMinutes * 60000
  return new Date(end).toLocaleTimeString(bcp47Tag.value, { hour: '2-digit', minute: '2-digit' })
})
const priceLabel = computed(() => (game.value?.price === 0 ? t('common.free') : t('common.priceValue', { price: game.value?.price })))
const seatsFreeLabel = computed(() =>
  game.value ? t('game.seatsFree', { left: seatsLeft.value, total: game.value.seatsTotal, price: priceLabel.value }) : ''
)

gamesStore.loadGame(String(route.params.id)).then((result) => {
  game.value = result
  loading.value = false
})

</script>

<template>
  <div class="flex min-h-full w-full flex-col">
    <div class="mx-auto w-full max-w-max-width flex-1 p-margin-mobile md:p-margin-desktop">
      <div
        v-if="loading"
        class="space-y-3"
        data-testid="game-loading"
      >
        <Skeleton
          width="60%"
          height="32px"
        />
        <Skeleton height="16px" />
        <Skeleton height="16px" />
        <Skeleton height="16px" />
        <Skeleton
          width="140px"
          height="44px"
        />
      </div>
      <div
        v-else-if="!game"
        class="flex flex-col items-start gap-md rounded-lg border border-error/30 bg-error-container p-md text-on-error-container"
        data-testid="game-not-found"
      >
        <p>{{ t('game.notFoundDescription') }}</p>
        <router-link
          :to="{ name: 'map' }"
          class="rounded-full bg-primary px-4 py-2 text-label-md text-on-primary shadow-sm transition-colors hover:bg-primary/90"
        >
          {{ t('common.browseGames') }}
        </router-link>
      </div>
      <div
        v-else
        class="grid grid-cols-1 items-start gap-lg lg:grid-cols-12"
      >
        <section class="flex flex-col gap-md lg:col-span-5">
          <article class="bento-tile overflow-hidden rounded-[1.75rem] border border-outline-variant bg-surface shadow-sm">
            <div class="relative h-48 w-full overflow-hidden">
              <PhotoPlaceholder
                :icon="cardArt.icon"
                :gradient-class="cardArt.gradientClass"
                :icon-color-class="cardArt.iconColorClass"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div class="absolute inset-x-4 bottom-4 flex items-center gap-xs text-white">
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-glow">
                  <Icon
                    name="location_on"
                    :size="14"
                  />
                </span>
                <address class="text-label-sm font-semibold not-italic uppercase tracking-wider">
                  {{ game.address }}
                </address>
              </div>
            </div>
            <div class="flex flex-col gap-md p-lg">
              <div>
                <div class="mb-xs flex flex-wrap items-center gap-sm">
                  <span class="rounded bg-secondary-container px-2 py-0.5 text-label-sm text-on-secondary-container">{{ sportLabel }}</span>
                  <span class="rounded bg-surface-variant px-2 py-0.5 text-label-sm text-on-surface-variant">{{ formatLabel }}</span>
                  <Chip
                    v-if="statusUi"
                    :bg="statusUi.badgeBg"
                    :text="statusUi.badgeText"
                    data-testid="game-status"
                  >
                    {{ statusUi.label }}
                  </Chip>
                </div>
                <h2 class="text-headline-lg-mobile text-on-surface md:text-headline-lg">
                  {{ game.title }}
                </h2>
              </div>
              <div class="flex flex-col gap-sm">
                <div class="flex items-center gap-md border-b border-surface-container-highest py-sm">
                  <Icon
                    name="calendar_today"
                    color="var(--color-on-surface-variant)"
                  />
                  <div class="flex flex-col">
                    <span class="text-body-sm text-on-surface-variant">{{ t('common.date') }}</span>
                    <time
                      class="text-body-md font-semibold text-on-surface"
                      :datetime="game.startsAt"
                    >{{ dateLabel }}</time>
                  </div>
                </div>
                <div class="flex items-center gap-md border-b border-surface-container-highest py-sm">
                  <Icon
                    name="schedule"
                    color="var(--color-on-surface-variant)"
                  />
                  <div class="flex flex-col">
                    <span class="text-body-sm text-on-surface-variant">{{ t('common.time') }}</span>
                    <time
                      class="text-body-md font-semibold text-on-surface"
                      :datetime="game.startsAt"
                    >{{ startTimeLabel }} - {{ endTimeLabel }}</time>
                  </div>
                </div>
                <div class="flex items-center gap-md py-sm">
                  <Avatar
                    label="Alex Mercer"
                    :size="40"
                  />
                  <div class="flex flex-col">
                    <span class="text-body-sm text-on-surface-variant">{{ t('game.organizedBy') }}</span>
                    <span class="text-body-md font-semibold text-on-surface">Alex Mercer</span>
                  </div>
                </div>
                <div class="flex items-center gap-md py-sm">
                  <Icon
                    name="group"
                    color="var(--color-on-surface-variant)"
                  />
                  <div class="flex flex-col">
                    <span class="text-body-sm text-on-surface-variant">{{ t('game.seats') }}</span>
                    <span class="text-body-md font-semibold text-on-surface">{{ seatsFreeLabel }}</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
          <div class="flex items-start gap-sm rounded-[1.75rem] bg-surface-container-low p-md text-on-surface-variant">
            <Icon
              name="info"
              color="var(--color-primary)"
            />
            <div>
              <h4 class="mb-xs text-label-md text-on-surface">
                {{ t('game.cancellationPolicy') }}
              </h4>
              <p class="text-body-sm">
                {{ t('game.cancellationPolicyText') }}
              </p>
            </div>
          </div>
        </section>

        <section class="flex flex-col gap-lg lg:col-span-7">
          <PaymentFollowup
            v-if="showPayment"
            @cancelled="showPayment = false"
          />
          <div
            v-else
            class="flex flex-col gap-md rounded-[1.75rem] border border-outline-variant bg-surface p-lg shadow-md"
          >
            <div>
              <h3 class="text-headline-md text-on-surface">
                {{ t('common.readyToPlay') }}
              </h3>
              <p class="text-body-sm text-on-surface-variant">
                {{ seatsFreeLabel }}
              </p>
            </div>
            <JoinButton
              :game="game"
              @joined="showPayment = true"
            />
          </div>

          <div
            v-if="canManageRoster"
            class="rounded-[1.75rem] border border-outline-variant bg-surface p-lg shadow-sm"
            data-testid="organizer-roster-card"
          >
            <GameRoster :game-id="game.id" />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>