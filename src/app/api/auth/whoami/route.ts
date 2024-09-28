import { NextResponse } from 'next/server'
import { SessionController } from '@/controllers/SessionController'

export async function GET() {
  try {
    const session = await SessionController.verifySession()

    if (!session.isAuth) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    return NextResponse.json({ success: true, session }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
