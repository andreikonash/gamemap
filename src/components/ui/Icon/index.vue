<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'UiIcon' })

const props = withDefaults(defineProps<{
  name: string
  size?: number
  color?: string
}>(), {
  size: 20,
  color: undefined
})

const style = computed(() => ({
  fontSize: `${props.size}px`,
  color: props.color
}))
</script>

<template>
  <span
    class="material-symbols-outlined"
    :style="style"
  >{{ name }}</span>
</template>
