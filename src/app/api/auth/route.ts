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

    const user = authResult.user
    if (!user || !user.uuid || !user.email) {
      return NextResponse.json({ success: false, error: 'Invalid user data' }, { status: 400 })
    }

    const session = await SessionController.createSession({
      uuid: user.uuid,
      email: user.email,
      info: 'myInfo', // TODO: change
    })

    return NextResponse.json({ success: true, user, session }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
