<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button, Input, Modal, Select } from '@/components/ui'

defineOptions({ name: 'FiltersModal' })

const SPORT_KEYWORDS = [
  { value: 'football', keyword: 'football' },
  { value: 'basketball', keyword: 'basketball' },
  { value: 'volleyball', keyword: 'volleyball' },
  { value: 'tennis', keyword: 'tennis' },
  { value: 'squash', keyword: 'squash' },
  { value: 'badminton', keyword: 'badminton' },
  { value: 'running', keyword: 'run' },
  { value: 'tableTennis', keyword: 'table tennis' }
] as const

const props = defineProps<{
  sport: string | null
  maxPrice: number | null
}>()

const model = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  apply: [payload: { sport: string | null, maxPrice: number | null }]
}>()

const { t } = useI18n()

const draftSport = ref(props.sport ?? '')
const draftMaxPrice = ref(props.maxPrice != null ? String(props.maxPrice) : '')

watch(model, (isOpen) => {
  if (!isOpen) return
  draftSport.value = props.sport ?? ''
  draftMaxPrice.value = props.maxPrice != null ? String(props.maxPrice) : ''
})

const sportOptions = computed(() => [
  { value: '', label: t('map.filtersAllSports') },
  ...SPORT_KEYWORDS.map((entry) => ({ value: entry.value, label: t(`sport.${entry.value}`) }))
])

function apply () {
  const parsedPrice = draftMaxPrice.value.trim() === '' ? null : Number(draftMaxPrice.value)
  emit('apply', {
    sport: draftSport.value || null,
    maxPrice: parsedPrice !== null && !Number.isNaN(parsedPrice) ? parsedPrice : null
  })
  model.value = false
}

function clearAll () {
  emit('apply', { sport: null, maxPrice: null })
  model.value = false
}
</script>

<template>
  <Modal
    v-model="model"
    :title="t('map.filtersTitle')"
    size="sm"
  >
    <div class="flex flex-col gap-md">
      <Select
        v-model="draftSport"
        :label="t('map.filtersSport')"
        :options="sportOptions"
      />
      <Input
        v-model="draftMaxPrice"
        type="number"
        :label="t('map.filtersMaxPrice')"
        placeholder="0"
      />
    </div>

    <template #footer>
      <Button
        variant="ghost"
        @click="clearAll"
      >
        {{ t('map.filtersClear') }}
      </Button>
      <Button @click="apply">
        {{ t('map.filtersApply') }}
      </Button>
    </template>
  </Modal>
</template>
