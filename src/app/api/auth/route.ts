// app/api/auth/route.ts

import { UserController } from '@/controllers/UserController'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const authResult = await UserController.authenticateUser(email, password)

    if (!authResult.success) {
      return NextResponse.json({ success: false, error: authResult.message }, { status: 401 })
    }

    return NextResponse.json({ success: true, user: authResult.user }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
