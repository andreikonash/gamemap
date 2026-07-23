<script setup lang="ts">
import { BeamsBackground } from '@/components/ui'
import SignInForm from '@/components/features/Auth/SignInForm/index.vue'

defineOptions({ name: 'AuthPage' })
</script>

<template>
  <BeamsBackground
    intensity="medium"
    class="h-full"
  >
    <div class="flex h-full w-full items-center justify-center overflow-y-auto p-margin-mobile md:p-margin-desktop">
      <SignInForm />
    </div>
  </BeamsBackground>
</template>
