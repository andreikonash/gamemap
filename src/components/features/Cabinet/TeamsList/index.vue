<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Button, EmptyState, Icon, Skeleton } from '@/components/ui'
import { auth } from '@/store/auth'
import { teams } from '@/store/teams'
import { getSportIcon, getSportLabel } from '@/utils/helpers/sportIcon'

defineOptions({ name: 'CabinetTeamsList' })

const { t } = useI18n()
const authStore = auth()
const teamsStore = teams()

function joinHandle (teamId: string) {
  if (!authStore.userId) return
  teamsStore.join(teamId, authStore.userId)
}

function leaveHandle (teamId: string) {
  if (!authStore.userId) return
  teamsStore.leave(teamId, authStore.userId)
}
</script>

<template>
  <div class="flex flex-col gap-lg">
    <div
      v-if="teamsStore.loading"
      class="flex flex-col gap-md"
      data-testid="cabinet-teams-loading"
    >
      <div
        v-for="n in 2"
        :key="n"
        class="space-y-2 rounded-xl border border-surface-container-low bg-surface p-md shadow-sm"
      >
        <Skeleton
          width="60%"
          height="20px"
        />
        <Skeleton
          width="40%"
          height="14px"
        />
      </div>
    </div>

    <template v-else>
      <EmptyState
        v-if="teamsStore.myTeams.length === 0"
        icon="groups"
        :title="t('cabinet.teamsEmptyTitle')"
        :description="t('cabinet.teamsEmptyDescription')"
        data-testid="cabinet-teams-empty"
      />
      <div
        v-else
        class="flex flex-col gap-md"
      >
        <article
          v-for="team in teamsStore.myTeams"
          :key="team.id"
          class="bento-tile flex items-center justify-between gap-md rounded-[1.75rem] border border-surface-container-low bg-surface p-md shadow-sm"
          data-testid="cabinet-team"
        >
          <div class="flex items-center gap-md">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon
                :name="getSportIcon(team.sport)"
                :size="22"
              />
            </div>
            <div>
              <h3 class="text-headline-sm text-on-surface">
                {{ team.name }}
              </h3>
              <p class="text-body-sm text-on-surface-variant">
                {{ getSportLabel(team.sport) }} · {{ t('cabinet.membersCount', { count: team.members.length }) }}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            @click="leaveHandle(team.id)"
          >
            {{ t('cabinet.leaveTeam') }}
          </Button>
        </article>
      </div>

      <div v-if="teamsStore.discoverableTeams.length">
        <h2 class="mb-md text-headline-sm text-on-surface">
          {{ t('cabinet.discoverTeams') }}
        </h2>
        <div class="flex flex-col gap-md">
          <article
            v-for="team in teamsStore.discoverableTeams"
            :key="team.id"
            class="flex items-center justify-between gap-md rounded-[1.75rem] border border-surface-container-low bg-surface p-md shadow-sm"
            data-testid="cabinet-team-discover"
          >
            <div class="flex items-center gap-md">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface-container-high text-on-surface-variant">
                <Icon
                  :name="getSportIcon(team.sport)"
                  :size="22"
                />
              </div>
              <div>
                <h3 class="text-body-md font-semibold text-on-surface">
                  {{ team.name }}
                </h3>
                <p class="text-body-sm text-on-surface-variant">
                  {{ getSportLabel(team.sport) }} · {{ t('cabinet.membersCount', { count: team.members.length }) }}
                </p>
              </div>
            </div>
            <Button @click="joinHandle(team.id)">
              {{ t('cabinet.joinTeam') }}
            </Button>
          </article>
        </div>
      </div>
    </template>
  </div>
</template>
