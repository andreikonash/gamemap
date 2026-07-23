<script setup lang="ts">
import { computed } from 'vue'
import { getMarkerColor, getMarkerIcon } from '@/components/features/Map/helpers/markerStyle'
import { Icon } from '@/components/ui'
import { getStatusUi } from '@/utils/ui/gameStatusUi'
import type { IGame } from '@/types/game'

defineOptions({ name: 'MarkerPin' })

const props = defineProps<{ game: IGame }>()
const emit = defineEmits<{ select: [gameId: string] }>()

const color = computed(() => getMarkerColor(props.game.status))
const icon = computed(() => getMarkerIcon(props.game.status))
const statusLabel = computed(() => getStatusUi(props.game.status).label)
const seatsLeft = computed(() => props.game.seatsTotal - props.game.seatsTaken)
</script>

<template>
  <button
    type="button"
    class="marker-pin"
    :data-status="game.status"
    :aria-label="`${game.title} — ${statusLabel}`"
    @click="emit('select', game.id)"
  >
    <div
      class="marker-pin__circle"
      :style="{ backgroundColor: color }"
    >
      <Icon
        :name="icon"
        :size="16"
        color="white"
      />
      <span class="marker-pin__seats">{{ seatsLeft }}</span>
    </div>
    <div
      class="marker-pin__tail"
      :style="{ borderTopColor: color }"
    />
  </button>
</template>

<style scoped>
.marker-pin {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.marker-pin__circle {
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  border: 2px solid var(--color-surface);
}

.marker-pin__seats {
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
}

.marker-pin__tail {
  width: 0;
  height: 0;
  border-inline: 6px solid transparent;
  border-block-start: 8px solid;
  margin-block-start: -2px;
}
</style>
