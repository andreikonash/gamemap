<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@/components/ui'
import { booking } from '@/store/booking'
import { REGISTRATION_STATUS } from '@/types/booking'

defineOptions({ name: 'PaymentFollowup' })

const PLATFORM_FEE = 2

const emit = defineEmits<{ cancelled: [] }>()

const { t } = useI18n()
const bookingStore = booking()
const paymentMethod = ref<'card' | 'wallet'>('card')

const registration = computed(() => bookingStore.currentRegistration)
const isPaid = computed(() => registration.value?.status === REGISTRATION_STATUS.PAID)
const totalPrice = computed(() => (registration.value?.price ?? 0) + PLATFORM_FEE)

async function payHandle () {
  await bookingStore.payCurrent()
}

async function cancelHandle () {
  if (!registration.value) return
  await bookingStore.cancelRegistration(registration.value.id)
  emit('cancelled')
}
</script>

<template>
  <div
    v-if="registration"
    class="flex flex-col gap-lg rounded-[1.75rem] border border-outline-variant bg-surface p-lg shadow-md lg:p-2xl"
    data-testid="payment-followup"
  >
    <p
      v-if="isPaid"
      class="flex items-center gap-2 rounded-lg border border-secondary/30 bg-secondary-container p-md text-on-secondary-container"
      data-testid="payment-success"
    >
      <Icon
        name="check_circle"
        :size="18"
      />
      {{ t('booking.registeredMessage') }}
    </p>
    <template v-else>
      <div>
        <h3 class="mb-xs text-headline-md text-on-surface">
          {{ t('booking.paymentDetails') }}
        </h3>
        <p class="text-body-sm text-on-surface-variant">
          {{ t('booking.completeBooking') }}
        </p>
      </div>

      <div class="grid grid-cols-2 gap-sm">
        <button
          type="button"
          class="flex h-full flex-col items-center justify-center gap-sm rounded-lg border-2 p-md transition-all"
          :class="paymentMethod === 'card' ? 'border-primary bg-primary-fixed' : 'border-outline-variant hover:bg-surface-container'"
          @click="paymentMethod = 'card'"
        >
          <Icon
            name="credit_card"
            :size="32"
            :color="paymentMethod === 'card' ? 'var(--color-primary)' : 'var(--color-on-surface-variant)'"
          />
          <span class="text-label-md font-semibold text-on-surface">{{ t('booking.card') }}</span>
        </button>
        <button
          type="button"
          class="flex h-full flex-col items-center justify-center gap-sm rounded-lg border-2 p-md transition-all"
          :class="paymentMethod === 'wallet' ? 'border-primary bg-primary-fixed' : 'border-outline-variant hover:bg-surface-container'"
          @click="paymentMethod = 'wallet'"
        >
          <Icon
            name="account_balance_wallet"
            :size="32"
            :color="paymentMethod === 'wallet' ? 'var(--color-primary)' : 'var(--color-on-surface-variant)'"
          />
          <span class="text-label-md font-semibold text-on-surface">{{ t('booking.digitalWallet') }}</span>
        </button>
      </div>

      <form
        v-if="paymentMethod === 'card'"
        class="flex flex-col gap-md"
        @submit.prevent
      >
        <div class="flex flex-col gap-xs">
          <label
            class="text-label-sm text-on-surface-variant"
            for="cardName"
          >{{ t('booking.nameOnCard') }}</label>
          <input
            id="cardName"
            type="text"
            :placeholder="t('booking.nameOnCardPlaceholder')"
            class="rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-sm text-body-md text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary"
          >
        </div>
        <div class="flex flex-col gap-xs">
          <label
            class="text-label-sm text-on-surface-variant"
            for="cardNumber"
          >{{ t('booking.cardNumber') }}</label>
          <div class="relative">
            <input
              id="cardNumber"
              type="text"
              :placeholder="t('booking.cardNumberPlaceholder')"
              class="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-sm pl-md pr-12 text-body-md text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary"
            >
            <Icon
              name="credit_card"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-outline"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-md">
          <div class="flex flex-col gap-xs">
            <label
              class="text-label-sm text-on-surface-variant"
              for="expiry"
            >{{ t('booking.expiryDate') }}</label>
            <input
              id="expiry"
              type="text"
              :placeholder="t('booking.expiryDatePlaceholder')"
              class="rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-sm text-body-md text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary"
            >
          </div>
          <div class="flex flex-col gap-xs">
            <label
              class="text-label-sm text-on-surface-variant"
              for="cvv"
            >{{ t('booking.cvv') }}</label>
            <input
              id="cvv"
              type="text"
              :placeholder="t('booking.cvvPlaceholder')"
              class="rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-sm text-body-md text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary"
            >
          </div>
        </div>
      </form>

      <hr class="my-sm border-surface-container-highest">

      <div class="flex flex-col gap-sm">
        <h4 class="mb-xs text-headline-sm text-on-surface">
          {{ t('booking.summary') }}
        </h4>
        <div class="flex items-center justify-between text-body-md text-on-surface-variant">
          <span>{{ t('booking.matchFee') }}</span>
          <span>{{ t('common.priceValue', { price: registration.price }) }}</span>
        </div>
        <div class="flex items-center justify-between text-body-md text-on-surface-variant">
          <span>{{ t('booking.platformFee') }}</span>
          <span>{{ t('common.priceValue', { price: PLATFORM_FEE }) }}</span>
        </div>
        <div class="mt-sm flex items-center justify-between border-t border-surface-container-highest pt-sm text-headline-md text-on-surface">
          <span>{{ t('booking.total') }}</span>
          <span class="text-primary">{{ t('common.priceValue', { price: totalPrice }) }}</span>
        </div>
      </div>

      <button
        type="button"
        class="group relative mt-md flex items-center justify-center gap-sm overflow-hidden rounded-full bg-gradient-to-r from-primary to-primary-container py-4 text-label-md text-on-primary shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        data-testid="payment-pay"
        @click="payHandle"
      >
        <Icon
          name="lock"
          :size="18"
        />
        <span class="text-lg">{{ t('booking.confirmAndPay', { price: t('common.priceValue', { price: totalPrice }) }) }}</span>
      </button>
      <button
        type="button"
        class="text-center text-label-sm text-on-surface-variant underline-offset-2 transition-colors hover:text-error hover:underline"
        data-testid="payment-cancel"
        @click="cancelHandle"
      >
        {{ t('booking.cancelBooking') }}
      </button>
      <div class="mt-xs text-center">
        <p class="flex items-center justify-center gap-xs text-body-sm text-on-surface-variant">
          <Icon
            name="verified"
            :size="16"
          />
          {{ t('booking.securePaymentsNotice') }}
        </p>
      </div>
    </template>
  </div>
</template>
