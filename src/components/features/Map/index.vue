<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { IS_MOCK_MAP } from '@/utils/constants/env'

defineOptions({ name: 'GameMap' })

const MapView = IS_MOCK_MAP
  ? defineAsyncComponent(() => import('@/components/features/Map/MockMap/index.vue'))
  : defineAsyncComponent(() => import('@/components/features/Map/GoogleMapView/index.vue'))
</script>

<template>
  <component :is="MapView" />
</template>
