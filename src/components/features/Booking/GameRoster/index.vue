<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Skeleton } from '@/components/ui'
import { useToast } from '@/composables/useToast'
import { organizer } from '@/store/organizer'
import { REGISTRATION_STATUS, type IRegistration } from '@/types/booking'

defineOptions({ name: 'GameRoster' })

const props = defineProps<{ gameId: string }>()

const { t } = useI18n()
const { showToast } = useToast()
const organizerStore = organizer()

const roster = computed(() => organizerStore.rosterByGameId[props.gameId] ?? [])
const loading = computed(() => organizerStore.loadingRosterGameId === props.gameId)

onMounted(() => {
  organizerStore.loadRoster(props.gameId)
})

async function removeHandle (registration: IRegistration) {
  await organizerStore.removeParticipant(registration)
  showToast(t('organizer.removedToast'), 'person_remove')
}
</script>

<template>
  <div
    class="flex flex-col gap-sm"
    data-testid="game-roster"
  >
    <h3 class="text-label-md font-semibold text-on-surface">
      {{ t('organizer.rosterTitle') }}
    </h3>
    <div
      v-if="loading"
      class="flex flex-col gap-xs"
    >
      <Skeleton
        v-for="n in 2"
        :key="n"
        height="40px"
      />
    </div>
    <p
      v-else-if="roster.length === 0"
      class="text-body-sm text-on-surface-variant"
    >
      {{ t('organizer.rosterEmpty') }}
    </p>
    <template v-else>
      <div
        v-for="registration in roster"
        :key="registration.id"
        class="flex items-center justify-between gap-sm rounded-xl border border-surface-container-low bg-surface-container-lowest px-3 py-2"
        data-testid="roster-item"
      >
        <div class="min-w-0">
          <p class="truncate text-body-sm text-on-surface">
            {{ registration.userId }}
          </p>
          <p
            class="text-label-sm"
            :class="registration.status === REGISTRATION_STATUS.PAID ? 'text-secondary' : 'text-tertiary'"
          >
            {{ registration.status === REGISTRATION_STATUS.PAID ? t('bookingStatus.confirmed') : t('bookingStatus.paymentDue') }}
          </p>
        </div>
        <button
          v-if="registration.status === REGISTRATION_STATUS.PENDING_PAYMENT"
          type="button"
          class="shrink-0 rounded-lg border border-error/30 px-3 py-1 text-label-sm text-error transition-colors hover:bg-error-container"
          data-testid="roster-remove"
          @click="removeHandle(registration)"
        >
          {{ t('organizer.remove') }}
        </button>
      </div>
    </template>
  </div>
</template>
