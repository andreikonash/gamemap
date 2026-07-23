<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon, PhotoPlaceholder, RevealOnScroll } from '@/components/ui'
import { useAppLocale } from '@/i18n'
import { LOCALE_META } from '@/i18n/localeMeta'
import { createGame } from '@/store/createGame'

defineOptions({ name: 'CreateGameStepReview' })

const { t } = useI18n()
const store = createGame()
const appLocale = useAppLocale()

const bcp47Tag = computed(() => LOCALE_META[appLocale.value].bcp47Tag)
const formattedDate = computed(() => {
  if (!store.date) return t('common.notSet')
  return new Date(`${store.date}T00:00:00`).toLocaleDateString(bcp47Tag.value, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
})
const playersUpTo = computed(() => `${t('createGame.review.upTo', { count: store.maxPlayers })} ${t('common.playersWord', store.maxPlayers)}`)

const CONFIRM_ITEMS = computed(() => [
  { icon: 'calendar_month', label: t('createGame.review.dateTime'), value: `${formattedDate.value}, ${store.startTime}–${store.endTime}` },
  { icon: 'location_on', label: t('common.location'), value: store.address || t('common.notSet') },
  { icon: 'groups', label: t('common.players'), value: t('createGame.review.upTo', { count: store.maxPlayers }) },
  { icon: 'payments', label: t('createGame.review.price'), value: store.price > 0 ? t('createGame.review.pricePerPlayer', { price: store.price }) : t('common.free') }
])
</script>

<template>
  <div class="grid grid-cols-1 gap-2xl lg:grid-cols-3">
    <div class="flex flex-col gap-2xl lg:col-span-2">
      <div>
        <h1 class="text-headline-lg-mobile text-on-surface md:text-headline-lg">
          {{ t('createGame.review.heading') }}
        </h1>
        <p class="mt-1 text-body-lg text-on-surface-variant">
          {{ t('createGame.review.subheading') }}
        </p>
      </div>

      <section>
        <h2 class="mb-md text-headline-sm text-on-surface">
          {{ t('createGame.review.confirmDetails') }}
        </h2>
        <div class="grid grid-cols-1 gap-md sm:grid-cols-2">
          <div
            v-for="item in CONFIRM_ITEMS"
            :key="item.label"
            class="bento-tile flex items-start gap-md rounded-[1.75rem] bg-surface p-lg shadow-sm"
          >
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-fixed/50 to-accent-container/70">
              <Icon
                :name="item.icon"
                :size="22"
                color="var(--color-primary)"
              />
            </div>
            <div class="min-w-0">
              <p class="text-body-sm text-on-surface-variant">
                {{ item.label }}
              </p>
              <p class="truncate text-body-md font-semibold text-on-surface">
                {{ item.value }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 class="mb-md text-body-md font-semibold text-on-surface">
          {{ t('common.description') }}
        </h2>
        <p
          v-if="store.description"
          class="text-body-md text-on-surface-variant"
        >
          {{ store.description }}
        </p>
        <p
          v-else
          class="text-body-sm italic text-on-surface-variant/60"
        >
          {{ t('createGame.review.noDescriptionAdded') }}
        </p>
      </section>
    </div>

    <div class="flex flex-col gap-lg">
      <RevealOnScroll>
        <div>
          <h2 class="mb-md text-label-md text-on-surface-variant">
            {{ t('createGame.review.howPlayersSeeIt') }}
          </h2>
          <div class="bento-tile flex flex-col overflow-hidden rounded-[1.75rem] bg-surface shadow-lg">
            <div class="relative h-36 w-full overflow-hidden">
              <PhotoPlaceholder :icon="store.sportOption.icon" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <span
                class="glass-panel-dark absolute right-sm top-sm flex items-center gap-xs rounded-full px-2 py-1 text-label-sm text-white"
              >
                <span class="h-2 w-2 rounded-full bg-secondary" />
                {{ store.isPublic ? t('createGame.review.public') : t('createGame.review.inviteOnly') }}
              </span>
              <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-xs p-md">
                <h3 class="text-headline-sm text-white">
                  {{ store.title || t('createGame.review.untitledGame') }}
                </h3>
                <span class="whitespace-nowrap text-label-md font-semibold text-white">{{ store.price > 0 ? t('common.priceValue', { price: store.price }) : t('common.free') }}</span>
              </div>
            </div>
            <div class="flex flex-col gap-xs p-md">
              <div class="flex items-center gap-xs text-body-sm text-on-surface-variant">
                <Icon
                  name="schedule"
                  :size="16"
                />
                {{ formattedDate }} · {{ store.startTime }}
              </div>
              <div
                v-if="store.address"
                class="flex items-center gap-xs text-body-sm text-on-surface-variant"
              >
                <Icon
                  name="location_on"
                  :size="16"
                />
                <span class="truncate">{{ store.address }}</span>
              </div>
              <div class="flex items-center gap-xs text-body-sm text-on-surface-variant">
                <Icon
                  name="group"
                  :size="16"
                />
                {{ playersUpTo }}
              </div>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  </div>
</template>
