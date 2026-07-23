<script setup lang="ts">
import { computed, ref } from 'vue'
import confetti from 'canvas-confetti'
import { useI18n } from 'vue-i18n'
import { Button, Card, Icon, Input, RevealOnScroll } from '@/components/ui'

defineOptions({ name: 'CommunitiesPage' })

const { t } = useI18n()

const PREVIEW_FEATURES = computed(() => [
  { icon: 'groups', title: t('communities.features.localClubs.title'), description: t('communities.features.localClubs.description') },
  { icon: 'forum', title: t('communities.features.teamChat.title'), description: t('communities.features.teamChat.description') },
  { icon: 'event', title: t('communities.features.communityEvents.title'), description: t('communities.features.communityEvents.description') }
])

const email = ref('')
const submitted = ref(false)

function joinWaitlist () {
  if (!email.value) return
  submitted.value = true
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#2563eb', '#3b82f6', '#fb923c', '#ea580c']
  })
}
</script>

<template>
  <div class="flex min-h-full w-full flex-col">
    <div class="mx-auto flex w-full max-w-[720px] flex-1 flex-col items-center gap-lg p-margin-mobile text-center md:p-margin-desktop">
      <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-tertiary to-accent shadow-glow-accent">
        <span
          class="material-symbols-outlined text-white"
          style="font-size: 32px"
        >group</span>
      </div>
      <div>
        <h1 class="text-headline-lg-mobile text-on-surface md:text-headline-lg">
          {{ t('common.communities') }}
        </h1>
        <p class="text-body-md text-on-surface-variant">
          {{ t('communities.subtitle') }}
        </p>
      </div>

      <div class="grid w-full grid-cols-1 gap-md sm:grid-cols-3">
        <RevealOnScroll
          v-for="(feature, index) in PREVIEW_FEATURES"
          :key="feature.title"
          :delay="index * 80"
        >
          <Card class="flex h-full flex-col items-center gap-xs p-lg text-center">
            <Icon
              :name="feature.icon"
              :size="28"
              color="var(--color-primary)"
            />
            <p class="text-body-md font-semibold text-on-surface">
              {{ feature.title }}
            </p>
            <p class="text-body-sm text-on-surface-variant">
              {{ feature.description }}
            </p>
          </Card>
        </RevealOnScroll>
      </div>

      <Card class="w-full max-w-[440px] p-lg">
        <Transition
          name="fade"
          mode="out-in"
        >
          <form
            v-if="!submitted"
            class="flex flex-col gap-sm"
            @submit.prevent="joinWaitlist"
          >
            <p class="text-body-md font-semibold text-on-surface">
              {{ t('communities.getNotified') }}
            </p>
            <div class="flex flex-col gap-sm sm:flex-row">
              <Input
                v-model="email"
                type="email"
                :placeholder="t('communities.emailPlaceholder')"
                class="flex-1"
              />
              <Button type="submit">
                {{ t('communities.notifyMe') }}
              </Button>
            </div>
          </form>
          <div
            v-else
            class="flex flex-col items-center gap-xs py-sm"
          >
            <Icon
              name="check_circle"
              :size="28"
              color="var(--color-secondary)"
            />
            <p class="text-body-md font-semibold text-on-surface">
              {{ t('communities.subscribedTitle') }}
            </p>
            <p class="text-body-sm text-on-surface-variant">
              {{ t('communities.subscribedDescription') }}
            </p>
          </div>
        </Transition>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}
</style>
