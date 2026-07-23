<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui'
import { auth } from '@/store/auth'
import { booking } from '@/store/booking'
import { isGameJoinable } from '@/utils/helpers/gameStatus'
import type { IGame } from '@/types/game'

defineOptions({ name: 'JoinButton' })

const props = defineProps<{ game: IGame }>()
const emit = defineEmits<{ joined: [] }>()

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = auth()
const bookingStore = booking()

const joinable = computed(() => isGameJoinable(props.game))

async function joinHandle () {
  if (!authStore.isLoggedIn || !authStore.userId) {
    authStore.setRedirect(route.fullPath)
    router.push({ name: 'auth' })
    return
  }
  const registration = await bookingStore.joinGame(props.game, authStore.userId)
  if (registration) emit('joined')
}
</script>

<template>
  <Button
    v-if="joinable"
    variant="primary"
    :loading="bookingStore.joining"
    :disabled="bookingStore.joining"
    data-testid="join-button"
    @click="joinHandle"
  >
    {{ t('booking.joinThisGame') }}
  </Button>
</template>
