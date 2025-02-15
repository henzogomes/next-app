import { SESSION_COOKIE } from '@/lib/constants'
import { type userInfo, type SessionPayload } from '@/lib/types'
import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined')
}

export class SessionController {
  static async createSession(user: userInfo) {
    const { uuid, email } = user
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) //1h
    const session = await this.encrypt({ uuid, email, expiresAt })

    cookies().set(SESSION_COOKIE, session, {
      httpOnly: true,
      secure: true,
      expires: expiresAt,
      sameSite: 'lax',
      path: '/',
    })

    console.log('Session set in cookie:', session)

    return session
  }

  static async encrypt(payload: SessionPayload) {
    const secret = new TextEncoder().encode(JWT_SECRET)

    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1hr')
      .sign(secret)
  }

  static async decrypt(session: string | undefined = '') {
    const secret = new TextEncoder().encode(JWT_SECRET)

    try {
      const { payload } = await jwtVerify(session, secret, {
        algorithms: ['HS256'],
      })
      return payload
    } catch (error) {
      return null
    }
  }

  static async verifySession() {
    const cookie = cookies().get(SESSION_COOKIE)?.value
    const session = await this.decrypt(cookie)

    if (!session?.uuid) {
      return { isAuth: false }
    }

    console.log('Session verified successfully')

    return { isAuth: true, session, cookie }
  }

  static deleteSession() {
    return cookies().delete(SESSION_COOKIE)
  }
}
