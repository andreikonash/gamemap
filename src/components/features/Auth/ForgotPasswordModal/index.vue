<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button, Input, Modal } from '@/components/ui'
import { useToast } from '@/composables/useToast'
import { auth } from '@/store/auth'

defineOptions({ name: 'ForgotPasswordModal' })

const model = defineModel<boolean>({ default: false })

const { t } = useI18n()
const authStore = auth()
const { showToast } = useToast()

const email = ref('')
const loading = ref(false)
const errorMessage = ref('')

const canSubmit = computed(() => email.value !== '')

async function submit () {
  if (!canSubmit.value) return
  loading.value = true
  errorMessage.value = ''
  try {
    await authStore.resetPassword(email.value)
    model.value = false
    email.value = ''
    showToast(t('modals.forgotPassword.success'), 'mark_email_read')
  } catch {
    errorMessage.value = t('modals.forgotPassword.error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Modal
    v-model="model"
    :title="t('modals.forgotPassword.title')"
    size="sm"
  >
    <p class="mb-md text-body-md text-on-surface-variant">
      {{ t('modals.forgotPassword.description') }}
    </p>
    <Input
      v-model="email"
      type="email"
      autocomplete="email"
      :label="t('auth.email')"
      :placeholder="t('auth.emailPlaceholder')"
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
        :disabled="!canSubmit"
        :loading="loading"
        @click="submit"
      >
        {{ t('modals.forgotPassword.submit') }}
      </Button>
    </template>
  </Modal>
</template>
