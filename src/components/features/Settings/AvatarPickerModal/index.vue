<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { RadioGroupItem, RadioGroupRoot } from 'reka-ui'
import { Button, Modal } from '@/components/ui'
import { useAvatarPreset } from '@/composables/useAvatarPreset'
import { useToast } from '@/composables/useToast'
import { AVATAR_PRESETS } from '@/utils/constants/avatarPresets'

defineOptions({ name: 'AvatarPickerModal' })

const model = defineModel<boolean>({ default: false })

const { t } = useI18n()
const { showToast } = useToast()
const { avatarPresetId } = useAvatarPreset()

const selectedPresetId = ref(avatarPresetId.value)

watch(model, (isOpen) => {
  if (isOpen) selectedPresetId.value = avatarPresetId.value
})

function submit () {
  avatarPresetId.value = selectedPresetId.value
  model.value = false
  showToast(t('modals.avatar.success'), 'palette')
}
</script>

<template>
  <Modal
    v-model="model"
    :title="t('modals.avatar.title')"
  >
    <p class="mb-md text-body-md text-on-surface-variant">
      {{ t('modals.avatar.description') }}
    </p>
    <RadioGroupRoot
      v-model="selectedPresetId"
      class="grid grid-cols-5 gap-md"
    >
      <RadioGroupItem
        v-for="preset in AVATAR_PRESETS"
        :key="preset.id"
        :value="preset.id"
        class="flex aspect-square items-center justify-center overflow-hidden rounded-full shadow-sm outline-none transition-all duration-200"
        :class="selectedPresetId === preset.id ? 'ring-2 ring-offset-2 ring-primary' : 'hover:-translate-y-0.5 hover:shadow-md'"
      >
        <img
          :src="preset.image"
          :alt="preset.id"
          class="h-full w-full object-cover"
        >
      </RadioGroupItem>
    </RadioGroupRoot>

    <template #footer>
      <Button
        variant="ghost"
        @click="model = false"
      >
        {{ t('common.cancel') }}
      </Button>
      <Button @click="submit">
        {{ t('modals.avatar.submit') }}
      </Button>
    </template>
  </Modal>
</template>
