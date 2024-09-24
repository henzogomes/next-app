import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || ''

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined')
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const secret = new TextEncoder().encode(JWT_SECRET)

    try {
      const { payload } = await jose.jwtVerify(token, secret)

      // Extract user information from the payload
      const user = {
        uuid: payload.uuid,
        email: payload.email,
        customInfo: 'myInfo',
      }

      return NextResponse.json({ success: true, user }, { status: 200 })
    } catch (verifyError) {
      console.error('Token verification failed:', verifyError)
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 })
    }
  } catch (error) {
    console.error('Error in user route:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
