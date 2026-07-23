<script setup lang="ts">
import { CustomMarker } from 'vue3-google-map'
import MarkerPin from '@/components/features/Map/MarkerPin/index.vue'
import type { IGame } from '@/types/game'

defineOptions({ name: 'GameMarker' })

defineProps<{ game: IGame }>()
const emit = defineEmits<{ select: [gameId: string] }>()
</script>

<template>
  <CustomMarker :options="{ position: game.location, anchorPoint: 'BOTTOM_CENTER' }">
    <MarkerPin
      :game="game"
      @select="emit('select', $event)"
    />
  </CustomMarker>
</template>
