import { useStorage } from '@vueuse/core'
import { pickRandomAvatarPreset } from '@/utils/constants/avatarPresets'

const AVATAR_PRESET_STORAGE_KEY = 'gamemap-avatar-preset'

const avatarPresetId = useStorage<string>(AVATAR_PRESET_STORAGE_KEY, pickRandomAvatarPreset().id)

function useAvatarPreset () {
  return { avatarPresetId }
}

export { useAvatarPreset }
