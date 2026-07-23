<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Button, Input, Modal } from '@/components/ui'
import { useToast } from '@/composables/useToast'
import { auth } from '@/store/auth'
import { booking } from '@/store/booking'
import { teams } from '@/store/teams'

defineOptions({ name: 'DeleteAccountModal' })

const CONFIRM_WORD = 'DELETE'

const model = defineModel<boolean>({ default: false })

const { t } = useI18n()
const router = useRouter()
const authStore = auth()
const bookingStore = booking()
const teamsStore = teams()
const { showToast } = useToast()

const confirmText = ref('')
const loading = ref(false)
const errorMessage = ref('')

const canSubmit = computed(() => confirmText.value === CONFIRM_WORD)

async function submit () {
  if (!canSubmit.value) return
  const userId = authStore.userId
  loading.value = true
  errorMessage.value = ''
  try {
    if (userId) {
      await Promise.all([
        bookingStore.deleteMyRegistrations(userId),
        teamsStore.leaveAllTeams(userId)
      ])
    }
    await authStore.deleteAccount()
    model.value = false
    showToast(t('modals.deleteAccount.success'), 'delete')
    router.push({ name: 'map' })
  } catch {
    errorMessage.value = t('modals.deleteAccount.error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Modal
    v-model="model"
    :title="t('modals.deleteAccount.title')"
    size="sm"
    variant="alert"
  >
    <p class="text-body-md text-on-surface-variant">
      {{ t('modals.deleteAccount.description') }}
    </p>
    <Input
      v-model="confirmText"
      class="mt-md"
      :label="t('modals.deleteAccount.confirmLabel')"
      :placeholder="t('modals.deleteAccount.confirmPlaceholder')"
      :error="errorMessage || undefined"
    />

    <template #footer>
      <Button
        variant="ghost"
        @click="model = false"
      >
        {{ t('common.cancel') }}
      </Button>
      <Button
        variant="danger"
        :disabled="!canSubmit"
        :loading="loading"
        @click="submit"
      >
        {{ t('modals.deleteAccount.submit') }}
      </Button>
    </template>
  </Modal>
</template>
