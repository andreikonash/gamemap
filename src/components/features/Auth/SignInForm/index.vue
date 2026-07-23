<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import ForgotPasswordModal from '@/components/features/Auth/ForgotPasswordModal/index.vue'
import { useToast } from '@/composables/useToast'
import { auth } from '@/store/auth'

defineOptions({ name: 'SignInForm' })

const { t } = useI18n()
const router = useRouter()
const authStore = auth()
const { showToast } = useToast()

const email = ref('')
const password = ref('')
const isSignUp = ref(false)
const errorMessage = ref('')
const loading = ref(false)
const showForgotPasswordModal = ref(false)

async function finishSignIn () {
  router.push(authStore.takeRedirect())
}

async function submitEmail () {
  errorMessage.value = ''
  loading.value = true
  try {
    if (isSignUp.value) {
      await authStore.signUpWithEmail(email.value, password.value)
    } else {
      await authStore.signInWithEmail(email.value, password.value)
    }
    await finishSignIn()
  } catch {
    errorMessage.value = isSignUp.value
      ? t('auth.errors.signUpFailed')
      : t('auth.errors.wrongCredentials')
  } finally {
    loading.value = false
  }
}

function submitApple () {
  showToast(t('auth.toast.appleComingSoon'), 'apps')
}

function forgotPasswordHandle () {
  showForgotPasswordModal.value = true
}

async function submitGoogle () {
  errorMessage.value = ''
  loading.value = true
  try {
    await authStore.signInWithGoogle()
    await finishSignIn()
  } catch {
    errorMessage.value = t('auth.errors.googleFailed')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="z-10 flex w-full max-w-[440px] flex-col gap-lg rounded-[1.75rem] border border-white/60 bg-white/90 p-xl shadow-xl backdrop-blur-2xl">
    <div class="flex flex-col items-center gap-md pt-sm text-center">
      <div class="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-container shadow-glow">
        <span
          class="material-symbols-outlined text-white"
          style="font-size: 32px"
        >explore</span>
      </div>
      <div>
        <h1 class="mb-xs text-headline-md font-bold tracking-tight text-on-surface">
          {{ isSignUp ? t('auth.createAccount') : t('auth.welcomeBack') }}
        </h1>
        <p class="text-body-md text-on-surface-variant">
          {{ t('auth.tagline') }}
        </p>
      </div>
    </div>

    <div class="mt-2 flex w-full flex-col gap-sm">
      <button
        type="button"
        class="flex w-full items-center justify-center gap-sm rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-container hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="loading"
        data-testid="signin-google"
        @click="submitGoogle"
      >
        <span
          class="material-symbols-outlined text-[20px] text-on-surface"
          style="font-variation-settings: 'FILL' 1"
        >account_circle</span>
        <span class="text-label-md text-on-surface">{{ t('auth.continueWithGoogle') }}</span>
      </button>
      <button
        type="button"
        class="flex w-full items-center justify-center gap-sm rounded-xl bg-on-surface px-4 py-3 text-on-primary shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-on-surface-variant"
        @click="submitApple"
      >
        <span
          class="material-symbols-outlined text-[20px]"
          style="font-variation-settings: 'FILL' 1"
        >apps</span>
        <span class="text-label-md">{{ t('auth.continueWithApple') }}</span>
      </button>
    </div>

    <div class="my-2 flex w-full items-center gap-4">
      <div class="h-px flex-1 bg-outline-variant/50" />
      <span class="text-label-sm uppercase tracking-wider text-on-surface-variant">{{ t('auth.or') }}</span>
      <div class="h-px flex-1 bg-outline-variant/50" />
    </div>

    <form
      class="flex w-full flex-col gap-4"
      @submit.prevent="submitEmail"
    >
      <div class="flex flex-col gap-xs">
        <label
          for="email"
          class="text-label-sm text-on-surface-variant"
        >{{ t('auth.email') }}</label>
        <div
          class="relative"
          data-testid="signin-email"
        >
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-outline">mail</span>
          <input
            id="email"
            v-model="email"
            type="email"
            :placeholder="t('auth.emailPlaceholder')"
            autocomplete="email"
            class="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-3 pl-10 pr-4 text-body-md text-on-surface shadow-sm transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary"
          >
        </div>
      </div>
      <div class="flex flex-col gap-xs">
        <div class="flex items-center justify-between">
          <label
            for="password"
            class="text-label-sm text-on-surface-variant"
          >{{ t('auth.password') }}</label>
          <a
            href="#"
            class="text-label-sm text-primary transition-colors hover:text-primary-container"
            @click.prevent="forgotPasswordHandle"
          >{{ t('auth.forgotPassword') }}</a>
        </div>
        <div
          class="relative"
          data-testid="signin-password"
        >
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-outline">lock</span>
          <input
            id="password"
            v-model="password"
            type="password"
            :placeholder="t('auth.passwordPlaceholder')"
            :autocomplete="isSignUp ? 'new-password' : 'current-password'"
            class="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-3 pl-10 pr-4 text-body-md text-on-surface shadow-sm transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary"
          >
        </div>
      </div>
      <p
        v-if="errorMessage"
        class="rounded-lg bg-error-container p-3 text-body-sm text-on-error-container"
        data-testid="signin-error"
      >
        {{ errorMessage }}
      </p>
      <button
        type="submit"
        class="mt-2 w-full rounded-xl bg-gradient-to-r from-primary to-primary-container px-4 py-3 text-label-md text-on-primary shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="loading"
        data-testid="signin-submit"
      >
        {{ isSignUp ? t('auth.signUp') : t('auth.signInSubmit') }}
      </button>
    </form>

    <div class="mt-2 text-center">
      <p class="text-body-sm text-on-surface-variant">
        {{ isSignUp ? t('auth.alreadyHaveAccount') : t('auth.dontHaveAccount') }}
        <button
          type="button"
          class="text-label-md text-primary hover:underline"
          data-testid="signin-toggle"
          @click="isSignUp = !isSignUp"
        >
          {{ isSignUp ? t('common.signIn') : t('auth.signUp') }}
        </button>
      </p>
    </div>

    <ForgotPasswordModal v-model="showForgotPasswordModal" />
  </main>
</template>
