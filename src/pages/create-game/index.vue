<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import StepDetails from '@/components/features/CreateGame/StepDetails/index.vue'
import StepLocation from '@/components/features/CreateGame/StepLocation/index.vue'
import StepLogistics from '@/components/features/CreateGame/StepLogistics/index.vue'
import StepReview from '@/components/features/CreateGame/StepReview/index.vue'
import { Button, Icon } from '@/components/ui'
import { useToast } from '@/composables/useToast'
import { createGame, TOTAL_STEPS } from '@/store/createGame'

defineOptions({ name: 'CreateGamePage' })

const STEP_COMPONENTS = [StepDetails, StepLocation, StepLogistics, StepReview]

const { t } = useI18n()
const router = useRouter()
const store = createGame()
const { showToast } = useToast()

const isPublishing = ref(false)

const STEP_TABS = computed(() => [
  { step: 1, label: t('createGame.steps.details') },
  { step: 2, label: t('createGame.steps.location') },
  { step: 3, label: t('createGame.steps.logistics') },
  { step: 4, label: t('createGame.steps.review') }
])

const currentStepComponent = computed(() => STEP_COMPONENTS[store.step - 1])
const canContinue = computed(() => {
  if (store.step === 1) return store.canContinueFromDetails
  if (store.step === 2) return store.canContinueFromLocation
  if (store.step === 3) return store.canContinueFromLogistics
  return true
})
const continueHint = computed(() => {
  if (canContinue.value) return null
  if (store.step === 1) return t('createGame.hints.title')
  if (store.step === 2) return t('createGame.hints.address')
  if (!store.date) return t('createGame.hints.date')
  return t('createGame.hints.timeOrder')
})
const nextStepLabel = computed(() => {
  if (store.step === TOTAL_STEPS) return t('createGame.publishGame')
  return t('createGame.continueTo', { step: STEP_TABS.value[store.step].label })
})

function exitBuilder () {
  router.push({ name: 'map' })
}

function saveDraftHandle () {
  showToast(t('createGame.draftSavedToast'), 'check_circle')
}

async function continueHandle () {
  if (store.step === TOTAL_STEPS) {
    isPublishing.value = true
    try {
      await store.publish()
    } catch {
      showToast(t('createGame.publishError'), 'error')
    } finally {
      isPublishing.value = false
    }
    return
  }
  store.nextStep()
}

function publishAnotherHandle () {
  store.$reset()
}
</script>

<template>
  <div class="flex min-h-full w-full flex-col bg-background">
    <header class="glass-panel sticky top-0 z-20 px-margin-mobile py-lg shadow-sm md:px-margin-desktop">
      <div class="mx-auto grid w-full max-w-[1180px] grid-cols-[1fr_auto_1fr] items-center gap-md">
        <button
          type="button"
          class="flex items-center gap-xs justify-self-start text-body-md text-on-surface-variant transition-colors hover:text-primary"
          :aria-label="t('createGame.exitBuilder')"
          @click="exitBuilder"
        >
          <Icon
            name="close"
            :size="20"
          />
          <span class="hidden sm:inline">{{ t('createGame.exitBuilder') }}</span>
        </button>
        <span class="justify-self-center text-headline-sm font-bold text-primary">{{ t('common.brand') }}</span>
        <span
          v-if="!store.published"
          class="justify-self-end text-label-sm text-on-surface-variant"
        >{{ t('createGame.stepOf', { step: store.step, total: TOTAL_STEPS }) }}</span>
      </div>

      <div
        v-if="!store.published"
        class="mx-auto mt-lg flex w-full max-w-[1180px] gap-md"
      >
        <button
          v-for="tab in STEP_TABS"
          :key="tab.step"
          type="button"
          class="group flex flex-1 flex-col items-start gap-sm text-left outline-none transition-opacity duration-200"
          :class="tab.step < store.step ? 'cursor-pointer hover:opacity-70' : 'cursor-default'"
          :aria-current="tab.step === store.step ? 'step' : undefined"
          @click="tab.step < store.step && store.goToStep(tab.step)"
        >
          <span class="relative h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
            <span
              class="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              :style="{ width: tab.step <= store.step ? '100%' : '0%' }"
            />
          </span>
          <span
            class="flex items-center gap-xs text-label-md transition-colors duration-200"
            :class="tab.step <= store.step ? 'font-semibold text-on-surface' : 'text-on-surface-variant'"
          >
            <Icon
              v-if="tab.step < store.step"
              name="check_circle"
              :size="15"
              color="var(--color-secondary)"
            />
            <span
              v-else
              class="text-on-surface-variant"
            >{{ String(tab.step).padStart(2, '0') }}</span>
            <span class="hidden sm:inline">{{ tab.label }}</span>
          </span>
        </button>
      </div>
    </header>

    <main class="mx-auto w-full max-w-[1180px] flex-1 px-margin-mobile py-2xl md:px-margin-desktop">
      <Transition
        name="step-fade"
        mode="out-in"
      >
        <div
          v-if="store.published"
          key="success"
          class="flex flex-col items-center gap-md py-3xl text-center"
        >
          <div class="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-secondary-fixed shadow-glow">
            <Icon
              name="check_circle"
              :size="40"
              color="white"
            />
          </div>
          <h1 class="text-headline-lg-mobile text-on-surface md:text-headline-lg">
            {{ t('createGame.success.title') }}
          </h1>
          <p class="max-w-[28rem] text-body-md text-on-surface-variant">
            {{ t('createGame.success.description', { title: store.title || t('createGame.success.defaultTitle') }) }}
          </p>
          <div class="mt-md flex flex-col gap-sm sm:flex-row">
            <button
              type="button"
              class="min-h-[44px] rounded-full border border-outline-variant px-6 py-2.5 text-label-md text-on-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              @click="publishAnotherHandle"
            >
              {{ t('createGame.success.createAnother') }}
            </button>
            <router-link
              :to="{ name: 'map' }"
              class="flex min-h-[44px] items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary-container px-6 py-2.5 text-label-md text-on-primary shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              {{ t('createGame.success.viewOnMap') }}
            </router-link>
          </div>
        </div>
        <component
          :is="currentStepComponent"
          v-else
          :key="store.step"
        />
      </Transition>
    </main>

    <footer
      v-if="!store.published"
      class="glass-panel sticky bottom-0 z-20 border-t border-white/60 px-margin-mobile py-md md:px-margin-desktop"
    >
      <div class="mx-auto flex w-full max-w-[1180px] flex-col gap-sm">
        <p
          v-if="continueHint"
          aria-live="polite"
          class="flex items-center gap-xs text-label-sm text-on-surface-variant"
        >
          <Icon
            name="info"
            :size="15"
          />
          {{ continueHint }}
        </p>
        <div class="flex items-center justify-between gap-sm">
          <Button
            variant="outline"
            :disabled="store.step === 1"
            @click="store.previousStep"
          >
            {{ t('createGame.back') }}
          </Button>
          <div class="flex items-center gap-sm">
            <Button
              variant="ghost"
              @click="saveDraftHandle"
            >
              {{ t('createGame.saveDraft') }}
            </Button>
            <Button
              :loading="isPublishing"
              :disabled="!canContinue || isPublishing"
              @click="continueHandle"
            >
              {{ nextStepLabel }}
            </Button>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.step-fade-enter-active,
.step-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.step-fade-enter-from {
  opacity: 0;
  transform: translateX(12px);
}

.step-fade-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}

@media (prefers-reduced-motion: reduce) {
  .step-fade-enter-active,
  .step-fade-leave-active {
    transition: opacity 0.15s ease;
  }

  .step-fade-enter-from,
  .step-fade-leave-to {
    transform: none;
  }
}
</style>
