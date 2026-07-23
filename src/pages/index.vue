<script setup lang="ts">
import { ref } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppNavSidebar from '@/components/features/AppNavSidebar/index.vue'
import GameMap from '@/components/features/Map/index.vue'
import GamesSidebar from '@/components/features/GamesSidebar/index.vue'
import { Button, Icon } from '@/components/ui'
import { useMobile } from '@/composables/useMobile'

defineOptions({ name: 'MapPage' })

const { t } = useI18n()
const mobile = useMobile()
const sheetOpen = ref(false)
const router = useRouter()

onKeyStroke('Escape', () => {
  sheetOpen.value = false
})

function createMatchHandle () {
  router.push({ name: 'create-game' })
}
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="map-page h-full">
      <AppNavSidebar>
        <template #footer>
          <button
            class="mt-auto flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary-container px-4 py-3 text-label-md text-on-primary shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            @click="createMatchHandle"
          >
            {{ t('map.createMatch') }}
          </button>
        </template>
      </AppNavSidebar>
      <div
        v-if="!mobile"
        class="map-page__sidebar"
      >
        <GamesSidebar class="h-full rounded-[1.75rem] shadow-lg" />
      </div>
      <div class="map-page__map">
        <GameMap />
      </div>
      <template v-if="mobile">
        <Button
          class="map-page__sheet-toggle"
          data-testid="open-games-sheet"
          @click="sheetOpen = true"
        >
          <Icon
            name="format_list_bulleted"
            :size="18"
          />
          {{ t('map.gamesHere') }}
        </Button>
        <Transition name="sheet-fade">
          <div
            v-if="sheetOpen"
            class="map-page__backdrop"
            @click="sheetOpen = false"
          />
        </Transition>
        <Transition name="sheet-slide">
          <div
            v-if="sheetOpen"
            class="map-page__sheet"
          >
            <GamesSidebar />
          </div>
        </Transition>
      </template>
    </div>
  </div>
</template>

<style scoped>
.map-page {
  display: flex;
  width: 100%;
  max-width: 1920px;
  margin-inline: auto;
}

.map-page__sidebar {
  width: 420px;
  flex-shrink: 0;
  padding: 16px 0 16px 16px;
}

.map-page__map {
  flex-grow: 1;
  position: relative;
}

.map-page__sheet-toggle {
  position: fixed;
  inset-block-end: calc(64px + 16px);
  inset-inline-start: 50%;
  transform: translateX(-50%);
  z-index: 5;
}

.map-page__backdrop {
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 40%);
  z-index: 10;
}

.map-page__sheet {
  position: fixed;
  inset-inline: 0;
  inset-block-end: 64px;
  height: 60vh;
  background-color: var(--color-bg);
  border-start-start-radius: var(--radius-lg);
  border-start-end-radius: var(--radius-lg);
  overflow-y: auto;
  z-index: 11;
}

.sheet-fade-enter-active,
.sheet-fade-leave-active {
  transition: opacity 0.2s ease;
}

.sheet-fade-enter-from,
.sheet-fade-leave-to {
  opacity: 0;
}

.sheet-slide-enter-active,
.sheet-slide-leave-active {
  transition: transform 0.25s ease;
}

.sheet-slide-enter-from,
.sheet-slide-leave-to {
  transform: translateY(100%);
}
</style>
