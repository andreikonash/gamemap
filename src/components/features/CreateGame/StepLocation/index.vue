<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon, RevealOnScroll } from '@/components/ui'
import { createGame, RECENT_VENUES } from '@/store/createGame'
import type { IVenue } from '@/store/createGame'

defineOptions({ name: 'CreateGameStepLocation' })

const { t } = useI18n()
const store = createGame()
const search = ref('')
const addressTouched = ref(false)

const filteredVenues = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return RECENT_VENUES
  return RECENT_VENUES.filter((venue) =>
    venue.label.toLowerCase().includes(query) || venue.address.toLowerCase().includes(query)
  )
})
const addressError = computed(() => {
  if (!addressTouched.value || store.address.trim()) return null
  return t('createGame.location.addressError')
})

function pickVenue (venue: IVenue) {
  store.address = venue.address
}
</script>

<template>
  <div class="grid grid-cols-1 gap-2xl lg:grid-cols-3">
    <div class="flex flex-col gap-2xl lg:col-span-2">
      <div>
        <h1 class="text-headline-lg-mobile text-on-surface md:text-headline-lg">
          {{ t('createGame.location.heading') }}
        </h1>
        <p class="mt-1 text-body-lg text-on-surface-variant">
          {{ t('createGame.location.subheading') }}
        </p>
      </div>

      <section class="flex flex-col gap-md">
        <span class="relative flex items-center">
          <Icon
            name="search"
            :size="20"
            class="pointer-events-none absolute left-5 text-on-surface-variant"
          />
          <input
            v-model="search"
            type="text"
            :placeholder="t('createGame.location.searchPlaceholder')"
            class="w-full rounded-2xl border border-outline-variant/40 bg-surface py-4 pl-12 pr-5 text-body-md text-on-surface shadow-sm outline-none transition-all duration-200 placeholder:text-on-surface-variant/60 focus:border-primary focus:shadow-glow focus:ring-2 focus:ring-primary/20"
          >
        </span>

        <p
          v-if="filteredVenues.length === 0"
          class="text-body-sm text-on-surface-variant"
        >
          {{ t('createGame.location.noVenuesMatch', { query: search }) }}
        </p>
        <div
          v-else
          class="flex flex-col gap-sm"
        >
          <button
            v-for="venue in filteredVenues"
            :key="venue.label"
            type="button"
            class="bento-tile flex items-center gap-md rounded-[1.75rem] bg-surface p-md text-left shadow-sm transition-all duration-200 hover:shadow-md"
            :class="store.address === venue.address ? 'ring-2 ring-primary' : ''"
            @click="pickVenue(venue)"
          >
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-fixed/50 to-accent-container/70 text-primary">
              <Icon
                :name="venue.icon"
                :size="22"
              />
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-body-md font-semibold text-on-surface">
                {{ venue.label }}
              </p>
              <p class="truncate text-body-sm text-on-surface-variant">
                {{ venue.address }}
              </p>
            </div>
            <Icon
              v-if="store.address === venue.address"
              name="check_circle"
              :size="22"
              color="var(--color-primary)"
            />
          </button>
        </div>

        <label class="block">
          <span class="mb-2 flex items-center gap-1 text-body-md font-semibold text-on-surface">
            {{ t('createGame.location.fullAddress') }}
            <span
              class="text-error"
              aria-hidden="true"
            >*</span>
          </span>
          <input
            v-model="store.address"
            type="text"
            :placeholder="t('createGame.location.addressPlaceholder')"
            class="w-full rounded-2xl border bg-surface px-5 py-4 text-body-md text-on-surface shadow-sm outline-none transition-all duration-200 placeholder:text-on-surface-variant/60 focus:shadow-glow focus:ring-2"
            :class="addressError ? 'border-error focus:ring-error/20' : 'border-outline-variant/40 focus:border-primary focus:ring-primary/20'"
            @blur="addressTouched = true"
          >
          <p
            v-if="addressError"
            role="alert"
            class="mt-1.5 text-label-sm text-error"
          >
            {{ addressError }}
          </p>
        </label>
      </section>

      <div class="location-preview bento-tile relative h-72 overflow-hidden rounded-[1.75rem] shadow-lg">
        <div class="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div
          v-if="store.address"
          class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center"
        >
          <div class="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-container text-white shadow-glow">
            <Icon
              :name="store.sportOption.icon"
              :size="24"
            />
          </div>
          <div class="-mt-1.5 h-4 w-4 rotate-45 bg-primary-container" />
        </div>
        <p
          v-else
          class="absolute inset-0 flex items-center justify-center px-lg text-center text-body-md text-on-surface-variant"
        >
          {{ t('createGame.location.pickPin') }}
        </p>
      </div>
    </div>

    <div class="flex flex-col gap-lg">
      <RevealOnScroll>
        <div class="bento-tile relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-primary to-primary-container p-lg text-white shadow-glow">
          <div class="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
          <div class="relative flex items-center gap-2">
            <Icon
              name="location_on"
              :size="22"
            />
            <h2 class="text-body-lg font-semibold">
              {{ t('createGame.location.selectedLocation') }}
            </h2>
          </div>
          <address
            v-if="store.address"
            class="relative mt-sm text-body-sm not-italic text-white/90"
          >
            {{ store.address }}
          </address>
          <p
            v-else
            class="relative mt-sm text-body-sm text-white/70"
          >
            {{ t('createGame.location.noLocationSelected') }}
          </p>
        </div>
      </RevealOnScroll>
    </div>
  </div>
</template>

<style scoped>
.location-preview {
  background-color: color-mix(in srgb, var(--color-text) 6%, var(--color-bg));
  background-image:
    linear-gradient(color-mix(in srgb, var(--color-text) 8%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--color-text) 8%, transparent) 1px, transparent 1px);
  background-size: 32px 32px;
}
</style>
