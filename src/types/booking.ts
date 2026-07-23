const REGISTRATION_STATUS = {
  PENDING_PAYMENT: 'pending_payment',
  PAID: 'paid'
} as const

type IRegistrationStatus = typeof REGISTRATION_STATUS[keyof typeof REGISTRATION_STATUS]

interface IRegistration {
  id: string
  gameId: string
  userId: string
  status: IRegistrationStatus
  gameTitle: string
  gameStartsAt: string
  price: number
  createdAt: string
}

export { REGISTRATION_STATUS }
export type { IRegistration, IRegistrationStatus }
