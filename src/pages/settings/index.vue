<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppNavSidebar from '@/components/features/AppNavSidebar/index.vue'
import AvatarPickerModal from '@/components/features/Settings/AvatarPickerModal/index.vue'
import ChangePasswordModal from '@/components/features/Settings/ChangePasswordModal/index.vue'
import DeleteAccountModal from '@/components/features/Settings/DeleteAccountModal/index.vue'
import TwoFactorModal from '@/components/features/Settings/TwoFactorModal/index.vue'
import { Avatar, Button, Card, Checkbox, Icon, Input, SegmentedControl, Select, Switch } from '@/components/ui'
import { useAvatarPreset } from '@/composables/useAvatarPreset'
import { useToast } from '@/composables/useToast'
import { isSupportedLocale, LOCALE_META } from '@/i18n/localeMeta'
import { SUPPORTED_LOCALES, useAppLocale } from '@/i18n'
import { auth } from '@/store/auth'
import { getAvatarPreset } from '@/utils/constants/avatarPresets'

defineOptions({ name: 'SettingsPage' })

const { t } = useI18n()
const router = useRouter()
const authStore = auth()
const { showToast } = useToast()
const { avatarPresetId } = useAvatarPreset()
const avatarPreset = computed(() => getAvatarPreset(avatarPresetId.value))

const appLocale = useAppLocale()

const showAvatarModal = ref(false)
const showChangePasswordModal = ref(false)
const showTwoFactorModal = ref(false)
const showDeleteAccountModal = ref(false)

const LANGUAGE_OPTIONS = SUPPORTED_LOCALES.map((code) => ({ value: code, label: LOCALE_META[code].label, badge: code.toUpperCase() }))

const UNIT_OPTIONS = computed(() => [
  { value: 'metric', label: t('settings.preferences.unitsMetric') },
  { value: 'imperial', label: t('settings.preferences.unitsImperial') }
])

const displayName = ref(authStore.user?.displayName ?? '')
const bio = ref('')
const email = computed(() => authStore.user?.email ?? '')

const language = computed({
  get: () => appLocale.value,
  set: (value) => {
    if (isSupportedLocale(value)) appLocale.value = value
  }
})
const units = ref('metric')
const darkMode = ref(false)

const gameReminders = ref(true)
const gameRemindersEmail = ref(true)
const gameRemindersPush = ref(true)
const newMessages = ref(true)
const marketingEmails = ref(false)

function saveChanges () {
  showToast(t('settings.toast.settingsSaved'), 'check_circle')
}

function cancelChanges () {
  showToast(t('settings.toast.changesDiscarded'), 'undo')
}

async function signOutHandle () {
  await authStore.signOut()
  router.push({ name: 'map' })
}

function deleteAccountHandle () {
  showDeleteAccountModal.value = true
}

function changePasswordHandle () {
  showChangePasswordModal.value = true
}

function enable2faHandle () {
  showTwoFactorModal.value = true
}

function darkModeHandle () {
  showToast(t('settings.toast.darkModeComingSoon'), 'dark_mode')
}
</script>

<template>
  <div class="flex min-h-full w-full flex-col">
    <div class="mx-auto flex w-full max-w-[1920px] flex-1">
      <AppNavSidebar sticky />

      <main class="flex-1 bg-background p-margin-mobile md:p-margin-desktop">
        <div class="mx-auto flex max-w-[640px] flex-col gap-lg">
          <div>
            <h1 class="text-headline-lg-mobile text-on-surface md:text-headline-lg">
              {{ t('common.settings') }}
            </h1>
            <p class="text-body-md text-on-surface-variant">
              {{ t('settings.subtitle') }}
            </p>
          </div>

          <section>
            <Card class="p-lg">
              <h2 class="mb-md text-headline-sm text-on-surface">
                {{ t('settings.profile.title') }}
              </h2>
              <div class="mb-lg flex items-center gap-md">
                <button
                  type="button"
                  class="rounded-full transition-transform hover:-translate-y-0.5"
                  :aria-label="t('modals.avatar.title')"
                  @click="showAvatarModal = true"
                >
                  <Avatar
                    :src="avatarPreset.image"
                    :size="64"
                  />
                </button>
                <div>
                  <p class="text-body-md font-semibold text-on-surface">
                    {{ displayName || t('settings.profile.fallbackName') }}
                  </p>
                  <p class="text-body-sm text-on-surface-variant">
                    {{ email }}
                  </p>
                </div>
              </div>
              <div class="flex flex-col gap-md">
                <Input
                  v-model="displayName"
                  :label="t('settings.profile.displayName')"
                />
                <Input
                  :model-value="email"
                  :label="t('settings.profile.email')"
                  disabled
                />
                <label class="block">
                  <span class="mb-1 block text-sm font-medium text-text">{{ t('settings.profile.bio') }}</span>
                  <textarea
                    v-model="bio"
                    rows="3"
                    :placeholder="t('settings.profile.bioPlaceholder')"
                    class="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text shadow-sm outline-none transition-all duration-200 placeholder:text-text-muted focus:border-primary focus:shadow-glow focus:ring-2 focus:ring-primary/15"
                  />
                </label>
              </div>
            </Card>
          </section>

          <section>
            <Card class="p-lg">
              <h2 class="mb-md text-headline-sm text-on-surface">
                {{ t('settings.preferences.title') }}
              </h2>
              <div class="flex flex-col gap-lg">
                <div class="flex flex-col gap-md sm:flex-row sm:items-end sm:justify-between">
                  <Select
                    v-model="language"
                    :label="t('settings.preferences.language')"
                    :options="LANGUAGE_OPTIONS"
                    class="sm:max-w-[200px]"
                  />
                  <div>
                    <span class="mb-1 block text-sm font-medium text-text">{{ t('settings.preferences.units') }}</span>
                    <SegmentedControl
                      v-model="units"
                      :options="UNIT_OPTIONS"
                    />
                  </div>
                </div>
                <div class="flex items-center justify-between rounded-2xl bg-surface-container-low p-md">
                  <div>
                    <p class="text-body-md text-on-surface">
                      {{ t('settings.preferences.darkMode') }}
                    </p>
                    <p class="text-body-sm text-on-surface-variant">
                      {{ t('settings.preferences.darkModeDescription') }}
                    </p>
                  </div>
                  <Switch
                    v-model="darkMode"
                    @update:model-value="darkModeHandle"
                  />
                </div>
              </div>
            </Card>
          </section>

          <section>
            <Card class="p-lg">
              <h2 class="mb-md text-headline-sm text-on-surface">
                {{ t('settings.notifications.title') }}
              </h2>
              <div class="flex flex-col divide-y divide-border">
                <div class="py-md first:pt-0 last:pb-0">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-body-md text-on-surface">
                        {{ t('settings.notifications.gameReminders') }}
                      </p>
                      <p class="text-body-sm text-on-surface-variant">
                        {{ t('settings.notifications.gameRemindersDescription') }}
                      </p>
                    </div>
                    <Switch v-model="gameReminders" />
                  </div>
                  <div
                    v-if="gameReminders"
                    class="mt-sm flex items-center gap-lg pl-md"
                  >
                    <Checkbox
                      v-model="gameRemindersEmail"
                      :label="t('settings.notifications.email')"
                    />
                    <Checkbox
                      v-model="gameRemindersPush"
                      :label="t('settings.notifications.push')"
                    />
                  </div>
                </div>
                <div class="flex items-center justify-between py-md first:pt-0 last:pb-0">
                  <div>
                    <p class="text-body-md text-on-surface">
                      {{ t('settings.notifications.newMessages') }}
                    </p>
                    <p class="text-body-sm text-on-surface-variant">
                      {{ t('settings.notifications.newMessagesDescription') }}
                    </p>
                  </div>
                  <Switch v-model="newMessages" />
                </div>
                <div class="flex items-center justify-between py-md first:pt-0 last:pb-0">
                  <div>
                    <p class="text-body-md text-on-surface">
                      {{ t('settings.notifications.marketingEmails') }}
                    </p>
                    <p class="text-body-sm text-on-surface-variant">
                      {{ t('settings.notifications.marketingEmailsDescription') }}
                    </p>
                  </div>
                  <Switch v-model="marketingEmails" />
                </div>
              </div>
            </Card>
          </section>

          <section>
            <Card
              accent-color="var(--color-error)"
              class="p-lg"
            >
              <h2 class="mb-md text-headline-sm text-on-surface">
                {{ t('settings.security.title') }}
              </h2>
              <div class="flex flex-col divide-y divide-border">
                <div class="flex items-center justify-between py-md first:pt-0">
                  <div>
                    <p class="text-body-md text-on-surface">
                      {{ t('settings.security.password') }}
                    </p>
                    <p class="text-body-sm text-on-surface-variant">
                      {{ t('settings.security.passwordLastChanged') }}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    @click="changePasswordHandle"
                  >
                    {{ t('settings.security.changePassword') }}
                  </Button>
                </div>
                <div class="flex items-center justify-between py-md">
                  <div>
                    <p class="text-body-md text-on-surface">
                      {{ t('settings.security.twoFactor') }}
                    </p>
                    <p class="text-body-sm text-on-surface-variant">
                      {{ t('settings.security.twoFactorDescription') }}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    @click="enable2faHandle"
                  >
                    {{ t('settings.security.enable2fa') }}
                  </Button>
                </div>
              </div>

              <div class="mt-lg rounded-2xl border border-error/30 bg-error-container p-md">
                <p class="mb-xs flex items-center gap-2 text-body-md font-semibold text-on-error-container">
                  <span class="material-symbols-outlined text-[20px]">warning</span>
                  {{ t('settings.security.dangerZone') }}
                </p>
                <p class="mb-md text-body-sm text-on-error-container">
                  {{ t('settings.security.dangerZoneDescription') }}
                </p>
                <Button
                  variant="danger"
                  @click="deleteAccountHandle"
                >
                  {{ t('settings.security.deleteAccount') }}
                </Button>
              </div>
            </Card>
          </section>

          <div class="mt-xl flex flex-col items-center gap-sm border-t border-dashed border-error/30 pt-xl text-center">
            <p class="text-body-sm text-on-surface-variant">
              {{ t('settings.security.signOutDescription') }}
            </p>
            <Button
              variant="danger"
              @click="signOutHandle"
            >
              <Icon
                name="logout"
                :size="18"
              />
              {{ t('common.signOut') }}
            </Button>
          </div>

          <div class="flex items-center justify-end gap-sm border-t border-outline-variant pt-lg">
            <Button
              variant="ghost"
              @click="cancelChanges"
            >
              {{ t('common.cancel') }}
            </Button>
            <Button @click="saveChanges">
              {{ t('settings.save') }}
            </Button>
          </div>
        </div>
      </main>
    </div>

    <AvatarPickerModal v-model="showAvatarModal" />
    <ChangePasswordModal v-model="showChangePasswordModal" />
    <TwoFactorModal v-model="showTwoFactorModal" />
    <DeleteAccountModal v-model="showDeleteAccountModal" />
  </div>
</template>
