// src/app/api/auth/route.ts
import { UserController } from '@/controllers/UserController'
import { NextResponse } from 'next/server'
import * as jose from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || ''

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined')
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const authResult = await UserController.authenticateUser(email, password)

    if (!authResult.success) {
      return NextResponse.json({ success: false, error: authResult.message }, { status: 401 })
    }

    // Generate JWT
    const secret = new TextEncoder().encode(JWT_SECRET)
    const token = await new jose.SignJWT({
      uuid: authResult.user?.uuid,
      email: authResult.user?.email,
      info: 'myInfo',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(secret)

    // Create the response
    const response = NextResponse.json({ success: true, user: authResult.user }, { status: 200 })

    // Set the token as an HTTP-only cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 1 hour
    })

    console.log('Token set in cookie:', token)

    return response
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
