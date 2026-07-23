<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RadioGroupItem, RadioGroupRoot } from 'reka-ui'
import { DatePicker, Icon, RevealOnScroll, Switch } from '@/components/ui'
import { useAppLocale } from '@/i18n'
import { LOCALE_META } from '@/i18n/localeMeta'
import { createGame, SKILL_LEVEL } from '@/store/createGame'
import type { ISkillLevel } from '@/store/createGame'

defineOptions({ name: 'CreateGameStepLogistics' })

const { t } = useI18n()
const store = createGame()
const appLocale = useAppLocale()
const dateTouched = ref(false)

const SKILL_LEVEL_OPTIONS = computed<Array<{ value: ISkillLevel, label: string, description: string, icon: string }>>(() => [
  { value: SKILL_LEVEL.BEGINNER, label: t('createGame.logistics.skillLevels.beginner.label'), description: t('createGame.logistics.skillLevels.beginner.description'), icon: 'sentiment_satisfied' },
  { value: SKILL_LEVEL.INTERMEDIATE, label: t('createGame.logistics.skillLevels.intermediate.label'), description: t('createGame.logistics.skillLevels.intermediate.description'), icon: 'sports' },
  { value: SKILL_LEVEL.ADVANCED, label: t('createGame.logistics.skillLevels.advanced.label'), description: t('createGame.logistics.skillLevels.advanced.description'), icon: 'military_tech' }
])

const bcp47Tag = computed(() => LOCALE_META[appLocale.value].bcp47Tag)
const formattedDate = computed(() => {
  if (!store.date) return null
  return new Date(`${store.date}T00:00:00`).toLocaleDateString(bcp47Tag.value, {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
})
const dateError = computed(() => {
  if (!dateTouched.value || store.date) return null
  return t('createGame.logistics.dateError')
})
const timeOrderWarning = computed(() => {
  if (!store.startTime || !store.endTime || store.endTime > store.startTime) return null
  return t('createGame.logistics.timeOrderWarning')
})

const inputClass = 'w-full rounded-2xl border bg-surface px-5 py-4 text-body-md text-on-surface shadow-sm outline-none transition-all duration-200 focus:shadow-glow focus:ring-2'
const normalInputClass = 'border-outline-variant/40 focus:border-primary focus:ring-primary/20'
const errorInputClass = 'border-error focus:ring-error/20'
const labelClass = 'mb-2 flex items-center gap-1 text-body-md font-semibold text-on-surface'

function clampMaxPlayers () {
  store.maxPlayers = Math.min(Math.max(store.maxPlayers || 2, 2), 50)
}

function clampPrice () {
  store.price = Math.max(store.price || 0, 0)
}
</script>

<template>
  <div class="grid grid-cols-1 gap-2xl lg:grid-cols-3">
    <div class="flex flex-col gap-2xl lg:col-span-2">
      <div>
        <h1 class="text-headline-lg-mobile text-on-surface md:text-headline-lg">
          {{ t('createGame.logistics.heading') }}
        </h1>
        <p class="mt-1 text-body-lg text-on-surface-variant">
          {{ t('createGame.logistics.subheading') }}
        </p>
      </div>

      <section class="flex flex-col gap-lg">
        <DatePicker
          v-model="store.date"
          :label="`${t('common.date')} *`"
          :placeholder="t('createGame.logistics.datePlaceholder')"
          :error="dateError ?? undefined"
          :locale="bcp47Tag"
          @blur="dateTouched = true"
        />
        <div>
          <div class="grid grid-cols-2 gap-md">
            <label class="block">
              <span :class="labelClass">{{ t('createGame.logistics.startTime') }}</span>
              <input
                v-model="store.startTime"
                type="time"
                :class="[inputClass, normalInputClass]"
              >
            </label>
            <label class="block">
              <span :class="labelClass">{{ t('createGame.logistics.endTime') }}</span>
              <input
                v-model="store.endTime"
                type="time"
                :class="[inputClass, timeOrderWarning ? errorInputClass : normalInputClass]"
              >
            </label>
          </div>
          <p
            v-if="timeOrderWarning"
            role="alert"
            class="mt-1.5 text-label-sm text-error"
          >
            {{ timeOrderWarning }}
          </p>
        </div>
      </section>

      <section class="flex flex-col gap-lg">
        <div class="grid grid-cols-2 gap-md">
          <label class="block">
            <span :class="labelClass">{{ t('createGame.logistics.maxPlayers') }}</span>
            <input
              v-model.number="store.maxPlayers"
              type="number"
              inputmode="numeric"
              min="2"
              max="50"
              :class="[inputClass, normalInputClass]"
              @blur="clampMaxPlayers"
            >
          </label>
          <label class="block">
            <span :class="labelClass">{{ t('createGame.logistics.pricePerPlayer') }}</span>
            <input
              v-model.number="store.price"
              type="number"
              inputmode="numeric"
              min="0"
              step="5"
              :class="[inputClass, normalInputClass]"
              @blur="clampPrice"
            >
          </label>
        </div>

        <div class="flex items-center justify-between rounded-[1.75rem] bg-surface p-lg shadow-sm">
          <div>
            <p class="text-body-md font-semibold text-on-surface">
              {{ t('createGame.logistics.publicGame') }}
            </p>
            <p class="text-body-sm text-on-surface-variant">
              {{ t('createGame.logistics.publicGameDescription') }}
            </p>
          </div>
          <Switch v-model="store.isPublic" />
        </div>
      </section>

      <section>
        <h2 class="mb-md text-headline-sm text-on-surface">
          {{ t('createGame.logistics.skillLevel') }}
        </h2>
        <RadioGroupRoot
          v-model="store.skillLevel"
          class="grid grid-cols-1 gap-md sm:grid-cols-3"
        >
          <RadioGroupItem
            v-for="option in SKILL_LEVEL_OPTIONS"
            :key="option.value"
            :value="option.value"
            class="bento-tile flex flex-col items-start gap-sm rounded-[1.75rem] p-lg text-left transition-all duration-200"
            :class="store.skillLevel === option.value
              ? 'bg-gradient-to-br from-primary to-primary-container text-white shadow-glow'
              : 'bg-surface text-on-surface shadow-sm hover:shadow-md'"
          >
            <div
              class="flex h-11 w-11 items-center justify-center rounded-full"
              :class="store.skillLevel === option.value ? 'bg-white/20' : 'bg-surface-container-high'"
            >
              <Icon
                :name="option.icon"
                :size="22"
                :color="store.skillLevel === option.value ? 'white' : 'var(--color-on-surface-variant)'"
              />
            </div>
            <span class="text-body-md font-semibold">{{ option.label }}</span>
            <span
              class="text-body-sm"
              :class="store.skillLevel === option.value ? 'text-white/80' : 'text-on-surface-variant'"
            >{{ option.description }}</span>
          </RadioGroupItem>
        </RadioGroupRoot>
      </section>
    </div>

    <div class="flex flex-col gap-lg">
      <RevealOnScroll>
        <div class="flex flex-col gap-md rounded-[1.75rem] bg-surface p-lg shadow-sm">
          <h2 class="text-body-lg font-semibold text-on-surface">
            {{ t('createGame.logistics.summary') }}
          </h2>
          <div class="flex flex-col gap-sm text-body-sm">
            <div class="flex items-center justify-between">
              <span class="text-on-surface-variant">{{ t('common.date') }}</span>
              <span class="font-medium text-on-surface">{{ formattedDate ?? t('common.notSet') }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-on-surface-variant">{{ t('common.time') }}</span>
              <span class="font-medium text-on-surface">{{ store.startTime }} – {{ store.endTime }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-on-surface-variant">{{ t('common.players') }}</span>
              <span class="font-medium text-on-surface">{{ t('createGame.logistics.maxSuffix', { count: store.maxPlayers }) }}</span>
            </div>
          </div>
          <div class="bento-tile relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-secondary to-secondary-fixed p-lg text-white">
            <div class="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/15 blur-2xl" />
            <p class="relative text-body-sm text-white/80">
              {{ t('createGame.logistics.potentialPool') }}
            </p>
            <p class="relative text-headline-md font-bold">
              {{ t('common.priceValue', { price: store.totalPoolEstimate }) }}
            </p>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  </div>
</template>
