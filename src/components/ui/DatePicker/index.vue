<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import { CalendarDate } from '@internationalized/date'
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
  CalendarRoot,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger
} from 'reka-ui'
import Icon from '@/components/ui/Icon/index.vue'

defineOptions({ name: 'UiDatePicker' })

const props = withDefaults(defineProps<{
  label?: string
  placeholder?: string
  error?: string
  min?: string
  locale?: string
}>(), {
  label: undefined,
  placeholder: undefined,
  error: undefined,
  min: undefined,
  locale: undefined
})

const model = defineModel<string>({ default: '' })
const emit = defineEmits<{ blur: [] }>()

const id = useId()
const open = ref(false)

watch(open, (isOpen) => {
  if (!isOpen) emit('blur')
})

function parseDateValue (value: string): CalendarDate | undefined {
  if (!value) return undefined
  const [year, month, day] = value.split('-').map(Number)
  return new CalendarDate(year, month, day)
}

function formatDateValue (value: CalendarDate): string {
  return `${value.year}-${String(value.month).padStart(2, '0')}-${String(value.day).padStart(2, '0')}`
}

const calendarValue = computed<CalendarDate | undefined>({
  get: () => parseDateValue(model.value),
  set: (value) => {
    model.value = value ? formatDateValue(value) : ''
  }
})

const minValue = computed(() => (props.min ? parseDateValue(props.min) : undefined))

const displayLabel = computed(() => {
  if (!calendarValue.value) return null
  return calendarValue.value.toDate('UTC').toLocaleDateString(props.locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  })
})
</script>

<template>
  <div class="block">
    <span
      v-if="label"
      :id="`${id}-label`"
      class="mb-2 flex items-center gap-1 text-body-md font-semibold text-on-surface"
    >{{ label }}</span>

    <PopoverRoot v-model:open="open">
      <PopoverTrigger
        :id="id"
        :aria-labelledby="label ? `${id}-label` : undefined"
        class="flex w-full items-center gap-3 rounded-2xl border bg-surface px-5 py-4 text-left text-body-md shadow-sm outline-none transition-all duration-200 focus:shadow-glow focus:ring-2 data-[state=open]:shadow-glow"
        :class="error ? 'border-error focus:ring-error/20' : 'border-outline-variant/40 focus:border-primary focus:ring-primary/20'"
      >
        <Icon
          name="calendar_today"
          :size="20"
          class="shrink-0 text-on-surface-variant"
        />
        <span :class="displayLabel ? 'text-on-surface' : 'text-on-surface-variant'">
          {{ displayLabel ?? placeholder }}
        </span>
      </PopoverTrigger>

      <PopoverPortal>
        <PopoverContent
          :side-offset="8"
          align="start"
          class="date-picker-content glass-panel z-[210] rounded-[1.5rem] border border-white/70 bg-white/95 p-md shadow-2xl ring-1 ring-black/5 backdrop-blur-2xl"
        >
          <CalendarRoot
            v-slot="{ grid, weekDays }"
            v-model="calendarValue"
            :locale="locale"
            :min-value="minValue"
          >
            <CalendarHeader class="mb-sm flex items-center justify-between">
              <CalendarPrev class="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high disabled:pointer-events-none disabled:opacity-30">
                <Icon
                  name="chevron_left"
                  :size="20"
                />
              </CalendarPrev>
              <CalendarHeading class="text-body-md font-semibold capitalize text-on-surface" />
              <CalendarNext class="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high disabled:pointer-events-none disabled:opacity-30">
                <Icon
                  name="chevron_right"
                  :size="20"
                />
              </CalendarNext>
            </CalendarHeader>

            <CalendarGrid
              v-for="month in grid"
              :key="month.value.toString()"
              class="w-full border-collapse select-none"
            >
              <CalendarGridHead>
                <CalendarGridRow class="flex w-full">
                  <CalendarHeadCell
                    v-for="day in weekDays"
                    :key="day"
                    class="w-9 text-center text-label-sm font-medium capitalize text-on-surface-variant"
                  >
                    {{ day }}
                  </CalendarHeadCell>
                </CalendarGridRow>
              </CalendarGridHead>
              <CalendarGridBody>
                <CalendarGridRow
                  v-for="(weekDates, index) in month.rows"
                  :key="`week-${index}`"
                  class="flex w-full"
                >
                  <CalendarCell
                    v-for="weekDate in weekDates"
                    :key="weekDate.toString()"
                    :date="weekDate"
                    class="p-0.5"
                  >
                    <CalendarCellTrigger
                      :day="weekDate"
                      :month="month.value"
                      class="calendar-cell flex h-9 w-9 items-center justify-center rounded-full text-body-sm text-on-surface outline-none transition-colors hover:bg-surface-container-high data-[outside-view]:text-on-surface-variant/40 data-[today]:font-bold data-[today]:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-30 data-[selected]:bg-gradient-to-r data-[selected]:from-primary data-[selected]:to-primary-container data-[selected]:text-white data-[selected]:shadow-glow"
                    />
                  </CalendarCell>
                </CalendarGridRow>
              </CalendarGridBody>
            </CalendarGrid>
          </CalendarRoot>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>

    <p
      v-if="error"
      role="alert"
      class="mt-1.5 text-label-sm text-error"
    >
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.date-picker-content {
  transform-origin: var(--reka-popover-content-transform-origin);
}

.date-picker-content[data-state='open'] {
  animation: date-picker-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.date-picker-content[data-state='closed'] {
  animation: date-picker-out 0.12s ease;
}

@keyframes date-picker-in {
  from {
    opacity: 0;
    transform: scale(0.94) translateY(-8px);
  }
}

@keyframes date-picker-out {
  to {
    opacity: 0;
    transform: scale(0.94) translateY(-8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .date-picker-content[data-state='open'],
  .date-picker-content[data-state='closed'] {
    animation-duration: 0.05s;
  }
}
</style>
