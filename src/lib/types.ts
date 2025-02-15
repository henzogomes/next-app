export type userInfo = {
  uuid: string
  email: string
  info: string
}

export type SessionPayload = {
  uuid: string | number
  email: string
  expiresAt: Date
}
