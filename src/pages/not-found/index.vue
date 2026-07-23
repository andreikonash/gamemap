<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Icon } from '@/components/ui'

defineOptions({ name: 'NotFoundPage' })

const { t } = useI18n()
</script>

<template>
  <div class="flex min-h-full w-full flex-col">
    <div class="flex flex-1 flex-col items-center justify-center gap-md p-margin-mobile text-center md:p-margin-desktop">
      <div class="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-container shadow-glow">
        <Icon
          name="explore_off"
          :size="36"
          color="white"
        />
      </div>
      <p class="text-headline-md font-bold text-primary">
        404
      </p>
      <h1 class="text-headline-lg-mobile text-on-surface md:text-headline-lg">
        {{ t('notFound.title') }}
      </h1>
      <p class="max-w-[28rem] text-body-md text-on-surface-variant">
        {{ t('notFound.description') }}
      </p>
      <router-link
        :to="{ name: 'map' }"
        class="mt-md flex min-h-[44px] items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary-container px-6 py-2.5 text-label-md text-on-primary shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      >
        {{ t('common.browseGames') }}
      </router-link>
    </div>
  </div>
</template>
