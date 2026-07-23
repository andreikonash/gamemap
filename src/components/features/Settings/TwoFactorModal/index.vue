<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button, Modal, PhotoPlaceholder } from '@/components/ui'
import { useToast } from '@/composables/useToast'

defineOptions({ name: 'TwoFactorModal' })

const CODE_LENGTH = 6

const model = defineModel<boolean>({ default: false })

const { t } = useI18n()
const { showToast } = useToast()

const code = ref('')

const canSubmit = computed(() => code.value.length === CODE_LENGTH)

function submit () {
  if (!canSubmit.value) return
  model.value = false
  code.value = ''
  showToast(t('modals.twoFactor.success'), 'verified_user')
}
</script>

<template>
  <Modal
    v-model="model"
    :title="t('modals.twoFactor.title')"
    size="sm"
  >
    <p class="mb-md text-body-md text-on-surface-variant">
      {{ t('modals.twoFactor.description') }}
    </p>
    <div class="mb-md h-40 w-40 overflow-hidden rounded-xl border border-outline-variant">
      <PhotoPlaceholder icon="qr_code_2" />
    </div>
    <label class="block">
      <span class="mb-1 block text-sm font-medium text-text">{{ t('modals.twoFactor.codeLabel') }}</span>
      <input
        v-model="code"
        type="text"
        inputmode="numeric"
        :maxlength="CODE_LENGTH"
        :placeholder="t('modals.twoFactor.codePlaceholder')"
        class="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-center text-lg tracking-[0.5em] text-text shadow-sm outline-none transition-all duration-200 placeholder:tracking-normal placeholder:text-text-muted focus:border-primary focus:shadow-glow focus:ring-2 focus:ring-primary/15"
      >
    </label>

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
        {{ t('modals.twoFactor.submit') }}
      </Button>
    </template>
  </Modal>
</template>
