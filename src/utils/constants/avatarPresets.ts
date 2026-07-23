type IAvatarPreset = {
  id: string
  image: string
}

const AVATAR_PRESETS: IAvatarPreset[] = [
  { id: 'blob-cap', image: '/avatars/blob-cap.svg' },
  { id: 'blob-headband', image: '/avatars/blob-headband.svg' },
  { id: 'blob-glasses', image: '/avatars/blob-glasses.svg' },
  { id: 'blob-antennae', image: '/avatars/blob-antennae.svg' },
  { id: 'blob-wink', image: '/avatars/blob-wink.svg' },
  { id: 'blob-star', image: '/avatars/blob-star.svg' },
  { id: 'blob-bow', image: '/avatars/blob-bow.svg' },
  { id: 'blob-mustache', image: '/avatars/blob-mustache.svg' },
  { id: 'blob-freckles', image: '/avatars/blob-freckles.svg' },
  { id: 'blob-mohawk', image: '/avatars/blob-mohawk.svg' },
  { id: 'blob-monocle', image: '/avatars/blob-monocle.svg' },
  { id: 'blob-hearts', image: '/avatars/blob-hearts.svg' },
  { id: 'blob-visor', image: '/avatars/blob-visor.svg' },
  { id: 'blob-leaf', image: '/avatars/blob-leaf.svg' },
  { id: 'blob-bandana', image: '/avatars/blob-bandana.svg' }
]

function getAvatarPreset (id: string): IAvatarPreset {
  return AVATAR_PRESETS.find((preset) => preset.id === id) ?? AVATAR_PRESETS[0]
}

function pickRandomAvatarPreset (): IAvatarPreset {
  return AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)]
}

export { AVATAR_PRESETS, getAvatarPreset, pickRandomAvatarPreset }
export type { IAvatarPreset }
