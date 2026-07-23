<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button, Input, Modal } from '@/components/ui'
import { useToast } from '@/composables/useToast'

defineOptions({ name: 'ChangePasswordModal' })

const model = defineModel<boolean>({ default: false })

const { t } = useI18n()
const { showToast } = useToast()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')

const canSubmit = computed(() => currentPassword.value !== '' && newPassword.value !== '' && confirmPassword.value !== '')

function resetForm () {
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  errorMessage.value = ''
}

function submit () {
  if (!canSubmit.value) return
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = t('modals.changePassword.mismatch')
    return
  }
  model.value = false
  resetForm()
  showToast(t('modals.changePassword.success'), 'lock_reset')
}
</script>

<template>
  <Modal
    v-model="model"
    :title="t('modals.changePassword.title')"
    size="sm"
  >
    <div class="flex flex-col gap-md">
      <Input
        v-model="currentPassword"
        type="password"
        autocomplete="current-password"
        :label="t('modals.changePassword.currentPassword')"
      />
      <Input
        v-model="newPassword"
        type="password"
        autocomplete="new-password"
        :label="t('modals.changePassword.newPassword')"
      />
      <Input
        v-model="confirmPassword"
        type="password"
        autocomplete="new-password"
        :label="t('modals.changePassword.confirmPassword')"
        :error="errorMessage || undefined"
      />
    </div>

    <template #footer>
      <Button
        variant="ghost"
        @click="model = false"
      >
        {{ t('common.cancel') }}
      </Button>
      <Button
        :disabled="!canSubmit"
        @click="submit"
      >
        {{ t('modals.changePassword.submit') }}
      </Button>
    </template>
  </Modal>
</template>
