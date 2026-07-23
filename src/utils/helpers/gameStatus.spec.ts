import { describe, it, expect } from 'vitest'
import { resolveGameStatus, isGameJoinable, ALMOST_FULL_SEATS_LEFT } from '@/utils/helpers/gameStatus'
import { GAME_STATUS } from '@/types/game'
import { makeGame } from '@tests/fixtures/gameFixtures'

describe('resolveGameStatus', () => {
  it('keeps a non-open status as is regardless of seats', () => {
    expect(resolveGameStatus(GAME_STATUS.CANCELLED, 10, 0)).toBe(GAME_STATUS.CANCELLED)
  })

  it('turns open into full when no seats are left', () => {
    expect(resolveGameStatus(GAME_STATUS.OPEN, 10, 10)).toBe(GAME_STATUS.FULL)
  })

  it('turns open into almost_full at the seats threshold', () => {
    expect(resolveGameStatus(GAME_STATUS.OPEN, 10, 10 - ALMOST_FULL_SEATS_LEFT)).toBe(GAME_STATUS.ALMOST_FULL)
  })

  it('keeps open when there are enough free seats', () => {
    expect(resolveGameStatus(GAME_STATUS.OPEN, 10, 3)).toBe(GAME_STATUS.OPEN)
  })
})

describe('isGameJoinable', () => {
  it('allows joining open and almost_full games', () => {
    expect(isGameJoinable(makeGame({ status: GAME_STATUS.OPEN }))).toBe(true)
    expect(isGameJoinable(makeGame({ status: GAME_STATUS.ALMOST_FULL }))).toBe(true)
  })

  it('blocks joining full, in_progress, finished and cancelled games', () => {
    expect(isGameJoinable(makeGame({ status: GAME_STATUS.FULL }))).toBe(false)
    expect(isGameJoinable(makeGame({ status: GAME_STATUS.IN_PROGRESS }))).toBe(false)
    expect(isGameJoinable(makeGame({ status: GAME_STATUS.FINISHED }))).toBe(false)
    expect(isGameJoinable(makeGame({ status: GAME_STATUS.CANCELLED }))).toBe(false)
  })
})
