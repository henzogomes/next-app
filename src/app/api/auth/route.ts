import { UserController } from '@/controllers/UserController'
import { NextResponse } from 'next/server'
import { SessionController } from '@/controllers/SessionController'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Authenticate user in the database
    const authResult = await UserController.authenticateUser(email, password)

    if (!authResult.success) {
      return NextResponse.json({ success: false, error: authResult.message }, { status: 401 })
    }

    const session = await SessionController.createSession({
      uuid: authResult.user?.uuid,
      email: authResult.user?.email,
      info: 'myInfo', //todo change
    })

    return NextResponse.json({ success: true, user: authResult.user, session }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
