<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RadioGroupItem, RadioGroupRoot } from 'reka-ui'
import { Icon, PhotoPlaceholder, RevealOnScroll } from '@/components/ui'
import { createGame, SPORT_OPTIONS } from '@/store/createGame'
import { VOLLEYBALL_COURT_ART, VOLLEYBALL_COURT_TYPE } from '@/utils/helpers/sportIcon'
import type { IVolleyballCourtType } from '@/utils/helpers/sportIcon'

defineOptions({ name: 'CreateGameStepDetails' })

const { t } = useI18n()
const store = createGame()

const titleTouched = ref(false)
const titleError = computed(() => {
  if (!titleTouched.value || store.title.trim()) return null
  return t('createGame.details.titleError')
})

const COURT_TYPE_OPTIONS = computed<Array<{ value: IVolleyballCourtType, label: string, description: string, icon: string }>>(() => [
  { value: VOLLEYBALL_COURT_TYPE.INDOOR, label: t('createGame.details.courtTypes.indoor.label'), description: t('createGame.details.courtTypes.indoor.description'), icon: VOLLEYBALL_COURT_ART.indoor.icon },
  { value: VOLLEYBALL_COURT_TYPE.SAND, label: t('createGame.details.courtTypes.sand.label'), description: t('createGame.details.courtTypes.sand.description'), icon: VOLLEYBALL_COURT_ART.sand.icon },
  { value: VOLLEYBALL_COURT_TYPE.OUTDOOR, label: t('createGame.details.courtTypes.outdoor.label'), description: t('createGame.details.courtTypes.outdoor.description'), icon: VOLLEYBALL_COURT_ART.outdoor.icon }
])

const previewArt = computed(() => {
  if (store.sport === 'volleyball' && store.courtType) return VOLLEYBALL_COURT_ART[store.courtType]
  return { icon: store.sportOption.icon }
})

function selectSport (value: string) {
  store.sport = value
  if (value !== 'volleyball') store.courtType = null
}

const sportValue = computed<string>({
  get: () => store.sport,
  set: (value) => selectSport(value)
})

const courtTypeValue = computed<IVolleyballCourtType | undefined>({
  get: () => store.courtType ?? undefined,
  set: (value) => { store.courtType = value ?? null }
})
</script>

<template>
  <div class="grid grid-cols-1 gap-2xl lg:grid-cols-3">
    <div class="flex flex-col gap-2xl lg:col-span-2">
      <div>
        <h1 class="text-headline-lg-mobile text-on-surface md:text-headline-lg">
          {{ t('createGame.details.heading') }}
        </h1>
        <p class="mt-1 text-body-lg text-on-surface-variant">
          {{ t('createGame.details.subheading') }}
        </p>
      </div>

      <section>
        <h2 class="mb-md text-headline-sm text-on-surface">
          {{ t('createGame.details.sport') }}
        </h2>
        <RadioGroupRoot
          v-model="sportValue"
          class="grid grid-cols-3 gap-md sm:grid-cols-6"
        >
          <RadioGroupItem
            v-for="option in SPORT_OPTIONS"
            :key="option.value"
            :value="option.value"
            class="bento-tile flex flex-col items-center justify-center gap-sm rounded-[1.75rem] py-lg transition-all duration-200"
            :class="store.sport === option.value
              ? 'bg-gradient-to-br from-primary to-primary-container text-white shadow-glow'
              : 'bg-surface text-on-surface-variant shadow-sm hover:shadow-md'"
          >
            <Icon
              :name="option.icon"
              :size="28"
              :color="store.sport === option.value ? 'white' : 'var(--color-on-surface-variant)'"
            />
            <span
              class="text-label-sm"
              :class="store.sport === option.value ? 'font-semibold text-white' : ''"
            >{{ t(option.labelKey) }}</span>
          </RadioGroupItem>
        </RadioGroupRoot>
      </section>

      <section v-if="store.sport === 'volleyball'">
        <h2 class="mb-md text-headline-sm text-on-surface">
          {{ t('createGame.details.courtType') }}
        </h2>
        <RadioGroupRoot
          v-model="courtTypeValue"
          class="grid grid-cols-1 gap-md sm:grid-cols-3"
        >
          <RadioGroupItem
            v-for="option in COURT_TYPE_OPTIONS"
            :key="option.value"
            :value="option.value"
            class="bento-tile flex flex-col items-start gap-sm rounded-[1.75rem] p-lg text-left transition-all duration-200"
            :class="store.courtType === option.value
              ? 'bg-gradient-to-br from-primary to-primary-container text-white shadow-glow'
              : 'bg-surface shadow-sm hover:shadow-md'"
          >
            <div
              class="flex h-11 w-11 items-center justify-center rounded-full"
              :class="store.courtType === option.value ? 'bg-white/20' : 'bg-surface-container-high'"
            >
              <Icon
                :name="option.icon"
                :size="22"
                :color="store.courtType === option.value ? 'white' : 'var(--color-on-surface-variant)'"
              />
            </div>
            <span
              class="text-body-md font-semibold"
              :class="store.courtType === option.value ? 'text-white' : 'text-on-surface'"
            >{{ option.label }}</span>
            <span
              class="text-body-sm"
              :class="store.courtType === option.value ? 'text-white/80' : 'text-on-surface-variant'"
            >{{ option.description }}</span>
          </RadioGroupItem>
        </RadioGroupRoot>
      </section>

      <section class="flex flex-col gap-lg">
        <label class="block">
          <span class="mb-2 flex items-center gap-1 text-body-md font-semibold text-on-surface">
            {{ t('createGame.details.gameTitle') }}
            <span
              class="text-error"
              aria-hidden="true"
            >*</span>
          </span>
          <input
            v-model="store.title"
            type="text"
            :placeholder="t('createGame.details.titlePlaceholder')"
            class="w-full rounded-2xl border bg-surface px-5 py-4 text-body-lg text-on-surface shadow-sm outline-none transition-all duration-200 placeholder:text-on-surface-variant/60 focus:shadow-glow focus:ring-2"
            :class="titleError ? 'border-error focus:ring-error/20' : 'border-outline-variant/40 focus:border-primary focus:ring-primary/20'"
            @blur="titleTouched = true"
          >
          <p
            v-if="titleError"
            role="alert"
            class="mt-1.5 text-label-sm text-error"
          >
            {{ titleError }}
          </p>
        </label>
        <label class="block">
          <span class="mb-2 block text-body-md font-semibold text-on-surface">{{ t('common.description') }}</span>
          <textarea
            v-model="store.description"
            rows="4"
            :placeholder="t('createGame.details.descriptionPlaceholder')"
            class="w-full rounded-2xl border border-outline-variant/40 bg-surface px-5 py-4 text-body-md text-on-surface shadow-sm outline-none transition-all duration-200 placeholder:text-on-surface-variant/60 focus:border-primary focus:shadow-glow focus:ring-2 focus:ring-primary/20"
          />
        </label>
      </section>
    </div>

    <div class="flex flex-col gap-lg">
      <RevealOnScroll>
        <div class="bento-tile relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-tertiary to-accent p-lg text-white shadow-glow-accent">
          <div class="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
          <div class="relative flex items-center gap-2">
            <Icon
              name="lightbulb"
              :size="22"
            />
            <h2 class="text-body-lg font-semibold">
              {{ t('createGame.details.hostingTip') }}
            </h2>
          </div>
          <p class="relative mt-sm text-body-sm text-white/90">
            {{ t('createGame.details.hostingTipText') }}
          </p>
        </div>
      </RevealOnScroll>

      <RevealOnScroll :delay="80">
        <div>
          <h2 class="mb-md text-body-md font-semibold text-on-surface">
            {{ t('createGame.details.livePreview') }}
          </h2>
          <div class="bento-tile flex flex-col overflow-hidden rounded-[1.75rem] bg-surface shadow-lg">
            <div class="relative h-36 w-full overflow-hidden">
              <PhotoPlaceholder
                :icon="previewArt.icon"
                :gradient-class="previewArt.gradientClass"
                :icon-color-class="previewArt.iconColorClass"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div class="glass-panel-dark absolute right-sm top-sm flex items-center gap-xs rounded-full px-2 py-1 text-label-sm text-white">
                <span class="h-2 w-2 rounded-full bg-secondary" />
                {{ t('createGame.details.draftBadge') }}
              </div>
              <div class="absolute inset-x-0 bottom-0 p-md">
                <h3 class="text-headline-sm text-white">
                  {{ store.title || t('createGame.details.previewTitleFallback') }}
                </h3>
              </div>
            </div>
            <div class="flex flex-col gap-xs p-md">
              <div class="flex items-center gap-xs text-body-sm text-on-surface-variant">
                <Icon
                  :name="store.sportOption.icon"
                  :size="16"
                />
                {{ t(store.sportOption.labelKey) }}
                <span class="mx-1">·</span>
                <Icon
                  name="schedule"
                  :size="16"
                />
                {{ store.startTime }}
              </div>
              <p
                v-if="store.description"
                class="line-clamp-2 text-body-sm text-on-surface-variant"
              >
                {{ store.description }}
              </p>
              <p
                v-else
                class="text-body-sm italic text-on-surface-variant/60"
              >
                {{ t('createGame.details.previewDescriptionFallback') }}
              </p>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  </div>
</template>
