import { describe, it, expect } from 'vitest'
import { AVATAR_PRESETS, getAvatarPreset, pickRandomAvatarPreset } from '@/utils/constants/avatarPresets'

describe('getAvatarPreset', () => {
  it('returns the matching preset for a known id', () => {
    expect(getAvatarPreset('blob-star')).toEqual(AVATAR_PRESETS.find((preset) => preset.id === 'blob-star'))
  })

  it('falls back to the first preset for an unknown id', () => {
    expect(getAvatarPreset('not-a-real-id')).toEqual(AVATAR_PRESETS[0])
  })
})

describe('pickRandomAvatarPreset', () => {
  it('always returns one of the known presets', () => {
    for (let i = 0; i < 20; i++) {
      expect(AVATAR_PRESETS).toContainEqual(pickRandomAvatarPreset())
    }
  })
})
